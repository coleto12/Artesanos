from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FavoriteProduct, FavoriteArtisan
from .serializers import FavoriteProductSerializer, FavoriteArtisanSerializer

class FavoriteListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        products = FavoriteProduct.objects.filter(user=request.user)
        artisans = FavoriteArtisan.objects.filter(user=request.user)
        return Response({
            'products': FavoriteProductSerializer(products, many=True).data,
            'artisans': FavoriteArtisanSerializer(artisans, many=True).data,
        })

class ToggleFavoriteProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        fav, created = FavoriteProduct.objects.get_or_create(
            user=request.user, product_id=product_id
        )
        if not created:
            fav.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})

class ToggleFavoriteArtisanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        artisan_id = request.data.get('artisan_id')
        fav, created = FavoriteArtisan.objects.get_or_create(
            user=request.user, artisan_id=artisan_id
        )
        if not created:
            fav.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})