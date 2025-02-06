from django.db import models

# Create your models here.

class NumberCollection(models.Model):
    bill_no = models.IntegerField()
    mobile_number = models.BigIntegerField()
    counter = models.IntegerField(default=2)
    collected = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.bill_no}"