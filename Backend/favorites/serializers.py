from rest_framework import serializers
from .models import FavoriteProduct, FavoriteArtisan
from products.serializers import ProductSerializer
from artisans.serializers import ArtisanProfileSerializer

class FavoriteProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = FavoriteProduct
        fields = ('id', 'product', 'product_id', 'created_at')
        read_only_fields = ('user', 'created_at')

class FavoriteArtisanSerializer(serializers.ModelSerializer):
    artisan = ArtisanProfileSerializer(read_only=True)
    artisan_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = FavoriteArtisan
        fields = ('id', 'artisan', 'artisan_id', 'created_at')
        read_only_fields = ('user', 'created_at')