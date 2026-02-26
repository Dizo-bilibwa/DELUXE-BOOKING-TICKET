from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Route, Train, TravelDate, TicketClass, Booking, Ticket, Payment
from django.contrib.auth import authenticate


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class TrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train
        fields = '__all__'


class TravelDateSerializer(serializers.ModelSerializer):  
    class Meta:
        model = TravelDate
        fields = '__all__'


class TicketClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketClass
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['travel_date', 'ticket_class', 'seats']
    
    def create(self, validated_data):
        # Get the user from the request context
        user = self.context['request'].user
        ticket_class = validated_data['ticket_class']
        seats = validated_data.get('seats', 1)
        total_amount = ticket_class.price * seats
        
        booking = Booking.objects.create(
            user=user,
            travel_date=validated_data['travel_date'],
            ticket_class=ticket_class,
            seats=seats,
            total_amount=total_amount
        )
        return booking


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['phone_number']
