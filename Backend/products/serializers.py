from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    artisan_name = serializers.CharField(source='artisan.username', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('artisan', 'created_at', 'updated_at')

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name', 'description', 'price', 'stock', 'category', 'image')

    def create(self, validated_data):
        validated_data['artisan'] = self.context['request'].user
        return super().create(validated_data)