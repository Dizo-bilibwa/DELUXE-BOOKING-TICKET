from django.http import JsonResponse
from .models import Train, TravelDate, TicketClass
from .serializers import BookingSerializer
from .models import Route, Train, TravelDate, TicketClass, Booking, Ticket
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import Route, Train
from .serializers import RouteSerializer, TrainSerializer
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from .models import Payment, Booking
from .serializers import PaymentSerializer
import time
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.urls import reverse


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


def travel_dates(request):
    train_id = request.GET.get('train_id')
    if train_id:
        dates = TravelDate.objects.filter(train_id=train_id)
    else:
        dates = TravelDate.objects.all()
    data = [
        {
            "id": d.id,
            "train": d.train.train_name,
            "travel_date": str(d.travel_date)
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


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


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


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are allowed because you are logged in"
        })


class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            ticket = Ticket.objects.create(
                booking=booking,
                ticket_number=str(uuid.uuid4())[:10]
            )
            return Response({
                "message": "Booking successful",
                "booking_id": booking.id,
                "ticket_number": ticket.ticket_number,
                "total_amount": booking.total_amount
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DownloadTicketPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_number):
        ticket = get_object_or_404(
            Ticket.objects.select_related(
                "booking__user",
                "booking__travel_date__train__route",
                "booking__ticket_class",
            ),
            ticket_number=ticket_number,
            booking__user=request.user,
        )

        payment_succeeded = Payment.objects.filter(
            booking=ticket.booking,
            status="SUCCESS"
        ).exists()
        if not payment_succeeded:
            return Response(
                {"detail": "Complete payment before downloading the ticket."},
                status=status.HTTP_403_FORBIDDEN,
            )

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
        p.drawString(100, 500, "Payment Status: SUCCESS (SIMULATED)")
        p.drawString(100, 470, "Have a safe journey")
        p.showPage()
        p.save()
        return response


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            existing_payment = Payment.objects.filter(
                booking=booking,
                status="SUCCESS"
            ).order_by("-created_at").first()
            ticket = get_object_or_404(Ticket, booking=booking)

            if existing_payment:
                return Response({
                    "message": "Payment already completed for this booking.",
                    "status": existing_payment.status,
                    "simulated": True,
                    "ticket_number": ticket.ticket_number,
                    "ticket_pdf_url": reverse("ticket-pdf", args=[ticket.ticket_number]),
                }, status=status.HTTP_200_OK)

            payment = Payment.objects.create(
                booking=booking,
                amount=booking.total_amount,
                status="PROCESSING"
            )
            time.sleep(2)
            payment.status = "SUCCESS"
            payment.save()
            return Response({
                "message": "Payment successful. This payment is simulated because no real payment gateway is connected yet.",
                "status": payment.status,
                "simulated": True,
                "ticket_number": ticket.ticket_number,
                "ticket_pdf_url": reverse("ticket-pdf", args=[ticket.ticket_number]),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
