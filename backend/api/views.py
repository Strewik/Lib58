from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer, BookSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Note
from .models import User
from .models import Book
from .models import IssueReturn
from .serializers import IssueReturnSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone
from .serializers import BookIssueSerializer
from .serializers import UserCountSerializer
from django.db.models import Count
from django.db.models import Q
from collections import Counter
from datetime import timedelta, date
from django.db.models import Sum
from .serializers import UserEditSerializer
from .serializers import OverdueBookSerializer, UpcomingDueBookSerializer, BookSerializer
from .utils import userToken


# Create your views here.

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
   

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class BookListCreate(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookIssueView(generics.CreateAPIView):
    queryset = IssueReturn.objects.all()
    serializer_class = BookIssueSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get("user")
        book_id = request.data.get("book")

        # Ensure both user and book IDs are provided
        if not user_id or not book_id:
            return Response({"error": "User ID and Book ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            book = Book.objects.get(id=book_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Book.DoesNotExist:
            return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.status == "suspended":
            return Response({"error": "This user's account is suspended, they cannot borrow books."},
                            status=status.HTTP_403_FORBIDDEN)

        active_issues = IssueReturn.objects.filter(user=user, status="issued").count()
        if active_issues >= 3:
            return Response({"error": "This user has reached the maximum limit of 3 borrowed books."},
                            status=status.HTTP_400_BAD_REQUEST)

        if book.availability <= 0:
            return Response({"error": "No copies available for issuing."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Book.objects.filter(id=book.id).update(availability=book.availability - 1)

        book.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_class = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class IssueReturnListView(generics.ListAPIView):
    queryset = IssueReturn.objects.all()
    serializer_class = IssueReturnSerializer

    def get_queryset(self):
       
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ReturnBookView(APIView):
    def patch(self, request, pk):
        try:
            issue = IssueReturn.objects.get(id=pk)
            if issue.status == 'returned':
                return Response({'detail': 'Book already returned.'}, status=status.HTTP_400_BAD_REQUEST)
            
            overdue = issue.expected_return_date < timezone.now().date()
            fine_paid = request.data.get('fine_paid', False)
            
            # if overdue and not fine_paid:
            #     return Response({'detail': 'Book is overdue - Fine $10. Confirm fine payment to return.'}, status=status.HTTP_400_BAD_REQUEST)
            
            issue.status = 'returned'
            issue.return_date = timezone.now()
            issue.save()
            
            serializer = IssueReturnSerializer(issue)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except IssueReturn.DoesNotExist:
            return Response({'detail': 'Issue not found.'}, status=status.HTTP_404_NOT_FOUND)

class UserCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_staff = User.objects.filter(role='staff').count()
        total_admin = User.objects.filter(role='admin').count()
        total_client = User.objects.filter(role='client').count()

        data = {
            'total_users': total_users,
            'total_staff': total_staff,
            'total_admin': total_admin,
            'total_client': total_client,
        }
        serializer = UserCountSerializer(data)
        return Response(serializer.data)

class UserEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserEditSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_issued = IssueReturn.objects.all().count()  # All records of issued books
        books_returned = IssueReturn.objects.filter(status='returned').count()  # Books marked as returned
        books_currently_issued = IssueReturn.objects.filter(status='issued').count()  # Books currently issued

        return Response({
            'total_issued': total_issued,
            'books_returned': books_returned,
            'books_currently_issued': books_currently_issued,
        })

class PopularBooksView(APIView):
  
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the 20 most issued books
        popular_books = IssueReturn.objects.values('book__title', 'book__author')\
                                           .annotate(issue_count=Count('book'))\
                                           .order_by('-issue_count')[:20]

        return Response(popular_books)
    
class OverdueBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_date = timezone.now().date()
        overdue_books_count = IssueReturn.objects.filter(
            Q(expected_return_date__lt=current_date) & Q(return_date__isnull=True)
        ).count()

        return Response({"overdue_books": overdue_books_count})
    
class TopGenresView(APIView):
   
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all books that have been issued
        issued_books = IssueReturn.objects.filter(return_date__isnull=False).values_list('book__genre', flat=True)

        # Split comma-separated genres and count occurrences
        genre_counter = Counter()
        for genres in issued_books:
            if genres:
                genre_list = [genre.strip() for genre in genres.split(',')]
                genre_counter.update(genre_list)

        # Get the top 5 most common genres
        top_genres = genre_counter.most_common(5)

        # Prepare the response data
        response_data = [{"genre": genre, "count": count} for genre, count in top_genres]

        return Response(response_data)
    
class TotalBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_books = Book.objects.count() 
        total_copies = Book.objects.aggregate(total_quantity=Sum('quantity'))['total_quantity'] 
        return Response({
            "total_books": total_books,
            "total_copies": total_copies
        })

class ClientInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"full_name": user.full_name})

class ClientOverdueBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        overdue_books = IssueReturn.objects.filter(
            user=request.user,
            expected_return_date__lt=date.today(),
            return_date__isnull=True
        )
        serializer = OverdueBookSerializer(overdue_books, many=True)
        return Response(serializer.data)

class UpcomingDueBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        upcoming_books = IssueReturn.objects.filter(
            user=request.user,
            expected_return_date__range=[date.today(), date.today() + timedelta(days=2)],
            return_date__isnull=True
        )
        serializer = UpcomingDueBookSerializer(upcoming_books, many=True)
        return Response(serializer.data)

class ClientBookListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
