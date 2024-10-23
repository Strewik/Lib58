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
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

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
        book_id = request.data.get('book')
        try:
            book = Book.objects.get(id=book_id)
            # Check if the number of copies issued is less than the available quantity
            issued_count = IssueReturn.objects.filter(book=book, status='issued').count()
            if issued_count >= book.quantity:
                return Response({"error": "No copies available for issuing"}, status=status.HTTP_400_BAD_REQUEST)

            # Proceed with issuing the book
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            # Update the available count on the book
            book.available = book.quantity - (issued_count + 1)
            book.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
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
        """
        Optionally filter by status (issued or returned).
        """
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class ReturnBookView(APIView):
    """
    Updates the status of an issued book to 'returned'.
    """
    def patch(self, request, pk):
        try:
            issue = IssueReturn.objects.get(id=pk)
            if issue.status == 'returned':
                return Response({'detail': 'Book already returned.'}, status=status.HTTP_400_BAD_REQUEST)
            
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
    """
    View to return the 20 most issued books.
    """
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
        # Count books where the current date is greater than the expected return date and the book hasn't been returned
        overdue_books_count = IssueReturn.objects.filter(
            Q(expected_return_date__lt=current_date) & Q(return_date__isnull=True)
        ).count()

        return Response({"overdue_books": overdue_books_count})