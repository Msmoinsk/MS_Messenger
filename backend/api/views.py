from django.shortcuts import render
from rest_framework import generics
from .serializers import NumberCollectionSerializers
from .models import NumberCollection
from rest_framework.permissions import AllowAny

# Create your views here.

class BillListCreateRead(generics.ListCreateAPIView):
    queryset = NumberCollection.objects.all()
    serializer_class = NumberCollectionSerializers
    permission_classes = [AllowAny]
    
class BillListEdit(generics.UpdateAPIView):
    queryset = NumberCollection.objects.all()
    serializer_class = NumberCollectionSerializers
    permission_classes = [AllowAny]

class BillListDelete(generics.DestroyAPIView):
    queryset = NumberCollection.objects.all()
    serializer_class = NumberCollectionSerializers
    permission_classes = [AllowAny]
