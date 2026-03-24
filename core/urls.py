from django.urls import path
from .views import trains_list
from .views import RegisterView
from .views import BookingView
from .views import CreateBookingView
from .views import DownloadTicketPDFView
from .views import PaymentView
from .views import trains_list, routes_list, travel_dates, ticket_classes
from .views import api_routes, api_trains
from .views import RegisterView, LoginView

urlpatterns = [
    # API endpoints
    path('routes/', api_routes, name='api_routes'),
    path('trains/', api_trains, name='api_trains'),
    path('travel-dates/', travel_dates, name='travel_dates'),
    path('ticket-classes/', ticket_classes, name='ticket_classes'),
    
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Booking
    path('book/', CreateBookingView.as_view(), name='book'),
    path('pay/<int:booking_id>/', PaymentView.as_view(), name='payment'),
    
    # Ticket
    path('ticket/pdf/<str:ticket_number>/', DownloadTicketPDFView.as_view(), name='ticket-pdf'),
]
