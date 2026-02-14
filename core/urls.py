from django.urls import path
from .views import trains_list
from .views import RegisterView
from.views import BookingView
from .views import CreateBookingView
from .views import download_ticket_pdf
from .views import PaymentView

from .views import trains_list, routes_list, travel_dates, ticket_classes
from .views import api_routes, api_trains
from .views import register_user
from .views import RegisterView, LoginView




urlpatterns = [
    path('trains/', trains_list),


    path('routes/', routes_list),
    path('trains/', trains_list),
    path('travel-dates/<int:train_id>/', travel_dates),
    path('ticket-classes/', ticket_classes),


    path('api/routes/', api_routes),
    path('api/trains/', api_trains),



 path('register/',register_user),


  path('register/',RegisterView.as_view(),name='register'),


    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'), 
    
    path('bookings/', BookingView.as_view()),


    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),


path('book/', CreateBookingView.as_view(), name='book'),
]



path(
  'ticket/pdf/<str:ticket_number>/',
  download_ticket_pdf,
  name='ticket-pdf'
),




path(
  'pay/<int:booking_id>/',
  PaymentView.as_view(),
  name='payment'
),


