from django.urls import path
from . import views
from .views import BookListCreate, BookDetail

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),

    # path("books/", views.books, name="books"),
    path("books/", BookListCreate.as_view(), name="book-list"),
    path("book/<int:pk>/", BookDetail.as_view(), name="book-detail"), 
    
]

 