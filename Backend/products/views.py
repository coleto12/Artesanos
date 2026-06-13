from rest_framework import generics, permissions, filters
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductCreateSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        artisan_id = self.request.query_params.get('artisan')
        region = self.request.query_params.get('region')
        if artisan_id:
            queryset = queryset.filter(artisan__id=artisan_id)
        if region:
            queryset = queryset.filter(artisan__artisan_profile__region=region)
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductCreateView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class ArtisanProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(artisan=self.request.user)

class ProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(artisan=self.request.user)