from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    
class Book(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=225)
    author = models.CharField(max_length=225)
    genre = models.CharField(max_length=225)
    language = models.CharField(max_length=225)
    quantity = models.IntegerField()
    published = models.IntegerField()

    def __str__(self):
        return self.title



