from django.urls import path
from .views import CartView, OrderCreateView, OrderListView, OrderDetailView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('', OrderListView.as_view(), name='orders'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]