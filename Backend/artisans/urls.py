from django.urls import path
from .views import (
    ArtisanListView,
    ArtisanDetailView,
    ArtisanProfileCreateUpdateView,
    CulturalStoryListCreateView,
    ArtisanReviewCreateView,
    FeaturedArtisansView,
)

urlpatterns = [
    path('', ArtisanListView.as_view(), name='artisans'),
    path('featured/', FeaturedArtisansView.as_view(), name='featured-artisans'),
    path('<int:pk>/', ArtisanDetailView.as_view(), name='artisan-detail'),
    path('my-profile/', ArtisanProfileCreateUpdateView.as_view(), name='my-profile'),
    path('stories/', CulturalStoryListCreateView.as_view(), name='stories'),
    path('<int:pk>/review/', ArtisanReviewCreateView.as_view(), name='artisan-review'),
]