from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Route, Train, TravelDate, TicketClass, Booking, Ticket
from .models import Booking

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

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'






class TicketClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketClass
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)






class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields =['username','email','password']

        def create (self, validated_data):
            User = User.objects.create_user(username=validated_data['username'],email =validated_data['email'],
                                            password=validated_data['password'])
            return User



from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers


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

from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['travel_date', 'ticket_class', 'seats']


from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['phone_number']








