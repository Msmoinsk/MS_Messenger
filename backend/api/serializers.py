from rest_framework import serializers
from .models import NumberCollection

class NumberCollectionSerializers(serializers.ModelSerializer):
    class Meta:
        model = NumberCollection
        fields = ["id", "bill_no", "mobile_number", "counter", "collected"]