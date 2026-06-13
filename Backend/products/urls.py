from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ArtisanProductListView,
    ProductUpdateDeleteView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('', ProductListView.as_view(), name='products'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('my-products/', ArtisanProductListView.as_view(), name='my-products'),
    path('<int:pk>/edit/', ProductUpdateDeleteView.as_view(), name='product-edit'),
]