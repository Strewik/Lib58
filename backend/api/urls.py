from django.urls import path
from . import views
from .views import BookListCreate, BookDetail
from .views import IssueReturnListView
from .views import ReturnBookView
from .views import UserListView
from .views import RegisterUserView
from .views import LoginView


urlpatterns = [
    path('signup/', RegisterUserView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    # path("books/", views.books, name="books"),
    path("books/", BookListCreate.as_view(), name="book-list"),
    path("book/<str:pk>/", BookDetail.as_view(), name="book-detail"),
    # Issue a book
    path("issue/", IssueReturnListView.as_view(), name="issue-book"),
    # Return a book
    path("issues/<uuid:pk>/return/", ReturnBookView.as_view(), name="return-book"),
]
