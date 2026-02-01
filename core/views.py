

from django.http import JsonResponse
from .models import Train, TravelDate, TicketClass
from .serializers import BookingSerializer
from django.http import JsonResponse
from .models import Route, Train, TravelDate, TicketClass, Booking, Ticket


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import Route,Train
from.serializers import RouteSerializer,TrainSerializer

from django.http import HttpResponse
from reportlab.pdfgen import canvas
from .models import Ticket



from .models import Payment, Booking
from .serializers import PaymentSerializer
import time








def trains_list(request):
    trains = Train.objects.all()
    data = [
        {
            "id": train.id,
            "name": train.train_name,
            "route": str(train.route)
        }
        for train in trains
    ]
    return JsonResponse(data, safe=False)





def routes_list(request):
    routes = Route.objects.all()
    data = [
        {
            "id": route.id,
            "origin": route.origin,
            "destination": route.destination
        }
        for route in routes
    ]
    return JsonResponse(data, safe=False)


def travel_dates(request, train_id):
    dates = TravelDate.objects.filter(train_id=train_id)
    data = [
        {
            "id": d.id,
            "date": d.travel_date
        }
        for d in dates
    ]
    return JsonResponse(data, safe=False)

def ticket_classes(request):
    classes = TicketClass.objects.all()
    data = [
        {
            "id": c.id,
            "name": c.name,
            "price": c.price
        }
        for c in classes
    ]
    return JsonResponse(data, safe=False)





@api_view(['GET'])
def api_routes(request):
    routes = Route.objects.all()
    serializer = RouteSerializer(routes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def api_trains(request):
    trains = Train.objects.all()
    serializer = TrainSerializer(trains, many=True)
    return Response(serializer.data)




import uuid
from rest_framework.decorators import api_view

@api_view(['POST'])
def create_booking(request):
    user = request.user
    travel_date_id = request.data['travel_date']
    ticket_class_id = request.data['ticket_class']

    ticket_class = TicketClass.objects.get(id=ticket_class_id)

    booking = Booking.objects.create(
        user=user,
        travel_date_id=travel_date_id,
        ticket_class=ticket_class,
        total_amount=ticket_class.price
    )

    Ticket.objects.create(
        booking=booking,
        ticket_number=str(uuid.uuid4())[:8]
    )

    return Response({"message": "Booking successful"})






from reportlab.pdfgen import canvas
from django.http import HttpResponse

def ticket_pdf(request, ticket_id):
    ticket = Ticket.objects.get(id=ticket_id)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="ticket.pdf"'

    p = canvas.Canvas(response)
    p.drawString(100, 750, "DELUXE TRAIN TICKET")
    p.drawString(100, 720, f"Ticket No: {ticket.ticket_number}")
    p.drawString(100, 700, f"Passenger: {ticket.booking.user.username}")
    p.drawString(100, 680, f"Route: {ticket.booking.travel_date.train.route}")
    p.showPage()
    p.save()
    return response



from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "user  registered successfully"},status=201)
    return Response(serializer.errors,status=400)


from rest_framework import generics
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status



from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated


from .serializers import LoginSerializer




from rest_framework.permissions import IsAuthenticated

class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are allowed because you are logged in"
        })



class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        if serializer.is_valid():
            ticket_class = serializer.validated_data['ticket_class']
            seats = serializer.validated_data['seats']

            total_amount = ticket_class.price * seats

            booking = serializer.save(
                user=request.user,
                total_amount=total_amount
            )

            ticket = Ticket.objects.create(
                booking=booking,
                ticket_number=str(uuid.uuid4())[:10]
            )

            return Response({
                "message": "Booking successful",
                "booking_id": booking.id,
                "ticket_number": ticket.ticket_number,
                "total_amount": total_amount
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)











class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            return Response({
                "message": "Login successful",
                "username": user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "token": token.key,
                "username": user.username
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






from rest_framework.permissions import IsAuthenticated

class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are allowed because you are logged in"
        })


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import LoginSerializer



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                "message": "Login successful",
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





def download_ticket_pdf(request, ticket_number):
    ticket = Ticket.objects.get(ticket_number=ticket_number)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="ticket_{ticket_number}.pdf"'

    p = canvas.Canvas(response)

    p.setFont("Helvetica", 12)

    p.drawString(100, 800, "DELUXE TRAIN BOOKING TICKET")
    p.drawString(100, 770, "--------------------------------")

    p.drawString(100, 740, f"Ticket Number: {ticket.ticket_number}")
    p.drawString(100, 710, f"Passenger: {ticket.booking.user.username}")
    p.drawString(100, 680, f"Route: {ticket.booking.travel_date.train.route}")
    p.drawString(100, 650, f"Train: {ticket.booking.travel_date.train.train_name}")
    p.drawString(100, 620, f"Travel Date: {ticket.booking.travel_date.travel_date}")
    p.drawString(100, 590, f"Class: {ticket.booking.ticket_class.name}")
    p.drawString(100, 560, f"Seats: {ticket.booking.seats}")
    p.drawString(100, 530, f"Total Amount: {ticket.booking.total_amount} TZS")

    p.drawString(100, 480, "Have a safe journey 🚆")

    p.showPage()
    p.save()

    return response




class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)

        serializer = PaymentSerializer(data=request.data)

        if serializer.is_valid():
            payment = serializer.save(
                booking=booking,
                amount=booking.total_amount,
                status="PROCESSING"
            )

            # MOCK DELAY (like M-Pesa)
            time.sleep(2)

            payment.status = "SUCCESS"
            payment.save()

            return Response({
                "message": "Payment successful",
                "status": payment.status
            })

        return Response(serializer.errors, status=400)



