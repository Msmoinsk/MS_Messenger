from django.urls import path
from . import views

urlpatterns = [
    path('bills/', views.BillListCreateRead.as_view(), name="all_bill_add_see"),
    path('bills/edit/<int:pk>', views.BillListEdit.as_view() , name="edit_bill"),
    path('bills/delete/<int:pk>', views.BillListDelete.as_view() , name="delete_bill"),
]
