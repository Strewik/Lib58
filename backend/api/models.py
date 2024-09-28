from django.db import models
from django.contrib.auth.models import User
import uuid


# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    
class Book(models.Model):
    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=225)
    author = models.CharField(max_length=225)
    genre = models.CharField(max_length=225)
    language = models.CharField(max_length=225)
    quantity = models.IntegerField()
    published = models.IntegerField()
    available = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Issue(models.Model):
    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4, editable=False)

class IssueReturn(models.Model):
    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('issued', 'Issued'),
        ('returned', 'Returned'),
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    expected_return_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='issued')


    def __str__(self):
        return f"{self.book.title} issued by {self.user.username}"

    def save(self, *args, **kwargs):
        if self.status == 'issued':
            total_quantity = self.book.quantity
            copies_issued = IssueReturn.objects.filter(book=self.book, status='issued').count()

            if copies_issued < total_quantity:
                self.book.available = total_quantity - copies_issued
                self.book.save()
            else:
                raise ValueError("No copies available for issuing")
        elif self.status == 'returned':
            self.book.available += 1
            self.book.save()

        super().save(*args, **kwargs)

