from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ArtisanProfile, CulturalStory, ArtisanReview
from .serializers import ArtisanProfileSerializer, CulturalStorySerializer, ArtisanReviewSerializer

class ArtisanListView(generics.ListAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.AllowAny]

class ArtisanDetailView(generics.RetrieveAPIView):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.AllowAny]

class ArtisanProfileCreateUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = ArtisanProfile.objects.get_or_create(user=self.request.user)
        return profile

class CulturalStoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CulturalStorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return CulturalStory.objects.all()

    def perform_create(self, serializer):
        profile, _ = ArtisanProfile.objects.get_or_create(user=self.request.user)
        serializer.save(artisan=profile)

class ArtisanReviewCreateView(generics.CreateAPIView):
    serializer_class = ArtisanReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        artisan = ArtisanProfile.objects.get(pk=self.kwargs['pk'])
        serializer.save(customer=self.request.user, artisan=artisan)
class FeaturedArtisansView(generics.ListAPIView):
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return ArtisanProfile.objects.filter(
            user__products__isnull=False
        ).distinct().order_by('-created_at')[:4]