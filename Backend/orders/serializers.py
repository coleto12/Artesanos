from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity', 'subtotal')

    def get_subtotal(self, obj):
        return obj.subtotal()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total', 'created_at')

    def get_total(self, obj):
        return sum(item.subtotal() for item in obj.items.all())

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price', 'subtotal')

    def get_subtotal(self, obj):
        return obj.subtotal()

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'customer_name', 'status', 'total', 'address', 'items', 'created_at')
        read_only_fields = ('customer', 'total', 'created_at')