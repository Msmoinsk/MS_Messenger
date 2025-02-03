from django.contrib import admin
from .models import NumberCollection

class BillList(admin.ModelAdmin):
    list_display = ("bill_no", "mobile_number", "counter", "collected")

admin.site.register(NumberCollection, BillList)
