from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from .serializers import *
from utils import connect
import uuid
import base64
import json

_, channel = connect()


@api_view(['POST', ])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            login(request, authenticated_user)
            return Response({'status': 'Success'})
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)


def logout_view(request):
    logout(request)


@api_view(['GET', 'POST'])
def executors_list(request):
    if request.method == 'GET':
        data = ExecutorToTask.objects.all()
        serializer = ExecutorSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ExecutorSerializer(data=request.data)
        if serializer.is_valid():
            executor = serializer.save()
            if bool(request.FILES.get('file', False)):
                save_image(executor.pk, request.FILES['file'])
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def executor_detail(request, pk):
    try:
        executor = ExecutorToTask.objects.get(pk=pk)
    except ExecutorToTask.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT':
        serializer = ExecutorSerializer(executor, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            if bool(request.FILES.FILES.get('file', False)):
                save_image(executor.pk, request.FILES['file'])
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        executor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def save_image(pk, file):
    global channel
    filename = str(uuid.uuid4()) + '.' + file.name[file.name.rfind('.') + 1:]
    msg = {'filename': filename, 'image': base64.b64encode(file.read()).decode('UTF-8'), 'pk': pk}
    try:
        if (channel is None) or (channel.is_open == False):
            _, channel = connect(retry=False)
        if (channel is not None) and (channel.is_open == True):
            channel.basic_publish(exchange='', routing_key='to_resize',
                                  body=bytes(json.dumps(msg), 'UTF-8'))
    except:
        print('Connection error')
