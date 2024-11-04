from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
import uuid
from django.conf import settings
from datetime import datetime, date


# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        unique=True, primary_key=True, default=uuid.uuid4, editable=False
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    id_type = models.CharField(max_length=50, blank=True, null=True)
    id_number = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    ROLE_CHOICES = (
        ("client", "Client"),
        ("staff", "Staff"),
        ("admin", "Admin"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="client")

    STATUS_CHOICES = (
        ("active", "Active"),
        ("suspended", "Suspended"),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="supended")

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",  
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions", 
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.email


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes"
    )

    def __str__(self):
        return self.title


class Book(models.Model):
    id = models.UUIDField(
        unique=True, primary_key=True, default=uuid.uuid4, editable=False
    )
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=225)
    author = models.CharField(max_length=225)
    genre = models.CharField(max_length=225)
    language = models.CharField(max_length=225)
    quantity = models.IntegerField()
    published = models.IntegerField()
    available = models.IntegerField(default=0)

    @property
    def availability(self):
        issued_count = IssueReturn.objects.filter(book=self, status="issued").count()
        return self.quantity - issued_count

    def __str__(self):
        return self.title


class IssueReturn(models.Model):
    id = models.UUIDField(
        unique=True, primary_key=True, default=uuid.uuid4, editable=False
    )
    STATUS_CHOICES = (
        ("issued", "Issued"),
        ("returned", "Returned"),
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    expected_return_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="issued")
    fine = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.book.title} issued by {self.user.username}"

    def save(self, *args, **kwargs):
        if self.return_date and isinstance(self.return_date, datetime):
            self.return_date = self.return_date.date()

        if self.status == "issued":
            total_quantity = self.book.quantity
            copies_issued = IssueReturn.objects.filter(
                book=self.book, status="issued"
            ).count()

            if copies_issued < total_quantity:
                self.book.available = total_quantity - copies_issued
                self.book.save()
            else:
                raise ValueError("No copies available for issuing")

        elif self.status == "returned":
            return_date = self.return_date

            if return_date and return_date > self.expected_return_date:
                self.fine = 10.00
            else:
                self.fine = 0.00

            self.book.available += 1
            self.book.save()

        super().save(*args, **kwargs)

        