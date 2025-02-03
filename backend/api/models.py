from django.db import models

# Create your models here.

class NumberCollection(models.Model):
    bill_no = models.IntegerField()
    mobile_number = models.IntegerField()
    counter = models.IntegerField(default=2)
    collected = models.BooleanField(default=False)
