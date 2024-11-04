from django.urls import path
from . import views
from .views import BookListCreate, BookDetail
from .views import IssueReturnListView
from .views import ReturnBookView
from .views import UserListView
from .views import RegisterUserView
from .views import LoginView
from .views import BookIssueView
from .views import UserCountView
from .views import BookStatsView
from .views import PopularBooksView
from .views import OverdueBooksView
from .views import TopGenresView
from .views import TotalBooksView
from .views import UserEditView
from .views import UserDeleteView
from .views import ClientInfoView, ClientOverdueBooksView, UpcomingDueBooksView, ClientBookListView

urlpatterns = [
    path("signup/", RegisterUserView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    # path("books/", views.books, name="books"),
    path("books/", BookListCreate.as_view(), name="book-list"),
    path("book/<str:pk>/", BookDetail.as_view(), name="book-detail"),
    path("issue/", IssueReturnListView.as_view(), name="issue-book"),
    path("issues/<uuid:pk>/return/", ReturnBookView.as_view(), name="return-book"),
    path("books/issue/", BookIssueView.as_view(), name="issue-book"),
    path("user-count/", UserCountView.as_view(), name="user-count"),
    path("book-stats/", BookStatsView.as_view(), name="book-stats"),
    path("popular-books/", PopularBooksView.as_view(), name="popular-books"),
    path("overdue-books/", OverdueBooksView.as_view(), name="overdue-books"),
    path('top-genres/', TopGenresView.as_view(), name='top-genres'),
    path('total-books/', TotalBooksView.as_view(), name='total-books'),
    path('edit-user/<uuid:id>/', UserEditView.as_view(), name='edit-user'),
    path('delete-user/<uuid:id>/', UserDeleteView.as_view(), name='delete-user'),
    path("client-info/", ClientInfoView.as_view(), name="client-info"),
    path("client-overdue-books/", ClientOverdueBooksView.as_view(), name="overdue-books"),
    path("upcoming-due-books/", UpcomingDueBooksView.as_view(), name="upcoming-due-books"),
    path("client-books/", ClientBookListView.as_view(), name="books"),
]

