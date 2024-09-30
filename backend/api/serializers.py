from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
from .models import Book
from .models import IssueReturn


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "created_at",
            "author",
        ]
        extra_kwargs = {"author": {"read_only": True}}


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


# class IssueReturnSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = IssueReturn
#         fields = ['id', 'book', 'user', 'issue_date','expected_return_date' 'return_date', 'status']
#         read_only_fields = ['issue_date']  # Issue date should not be editable


class IssueReturnSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = IssueReturn
        fields = [
            "id",
            "book",
            "user",
            "issue_date",
            "expected_return_date",
            "return_date",
            "status",
        ]
        read_only_fields = ["issue_date", "book", "user", "status"]

        
