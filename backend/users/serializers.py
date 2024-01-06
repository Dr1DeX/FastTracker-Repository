from rest_framework.serializers import ModelSerializer, Serializer, CharField
from django.contrib.auth.models import User
from .models import ExecutorToTask


class ExecutorSerializer(ModelSerializer):
    class Meta:
        model = ExecutorToTask
        fields = ('pk', 'name', 'email', 'pr_task', 'registration_date', 'avatar')


class LoginRequestSerializer(Serializer):
    model = User
    username = CharField(required=True)
    password = CharField(required=True)