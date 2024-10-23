# from django.contrib.auth.models import User
from rest_framework import serializers
from .models import User
from .models import Note
from .models import Book
from .models import IssueReturn


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone_number', 'id_type', 'id_number', 'address', 'role', 'status', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number'),
            id_type=validated_data.get('id_type'),
            id_number=validated_data.get('id_number'),
            address=validated_data.get('address'),
            role=validated_data.get('role', 'client'),
            status=validated_data.get('status', 'active')
        )
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
        read_only_fields = ["issue_date", "book", "user"]

class BookIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReturn
        fields = ['id', 'book', 'user', 'issue_date', 'expected_return_date', 'status']
    
    def create(self, validated_data):
        issue_return = IssueReturn.objects.create(**validated_data)
        return issue_return
        
class UserCountSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_staff = serializers.IntegerField()
    total_admin = serializers.IntegerField()
    total_client = serializers.IntegerField()


    