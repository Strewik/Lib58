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
from .models import Book
from .serializers import BookSerializer, NoteSerializer, UserSerializer
from .models import IssueReturn
from .serializers import IssueReturnSerializer
from .serializers import IssueReturnSerializer

# Create your views here.

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

class IssueBookView(generics.CreateAPIView):
    queryset = IssueReturn.objects.all()
    serializer_class = IssueReturnSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        data['status'] = 'issued'
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
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
            issue.return_date = timezone.now()  # Automatically set return date
            issue.save()
            serializer = IssueReturnSerializer(issue)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except IssueReturn.DoesNotExist:
            return Response({'detail': 'Issue not found.'}, status=status.HTTP_404_NOT_FOUND)
