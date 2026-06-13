from django.urls import path
from .views import FavoriteListView, ToggleFavoriteProductView, ToggleFavoriteArtisanView

urlpatterns = [
    path('', FavoriteListView.as_view(), name='favorites'),
    path('product/', ToggleFavoriteProductView.as_view(), name='toggle-favorite-product'),
    path('artisan/', ToggleFavoriteArtisanView.as_view(), name='toggle-favorite-artisan'),
]