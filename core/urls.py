from django.urls import path
from .views import trains_list
from .views import RegisterView
from.views import BookingView
from .views import CreateBookingView
from .views import download_ticket_pdf
from .views import PaymentView



urlpatterns = [
    path('trains/', trains_list),
]


from django.urls import path
from .views import trains_list, routes_list, travel_dates, ticket_classes

urlpatterns = [
    path('routes/', routes_list),
    path('trains/', trains_list),
    path('travel-dates/<int:train_id>/', travel_dates),
    path('ticket-classes/', ticket_classes),
]



from .views import api_routes, api_trains

urlpatterns += [
    path('api/routes/', api_routes),
    path('api/trains/', api_trains),
]


from .views import register_user
urlpatterns+=[
    path('register/',register_user),
]


urlpatterns=[
    path('register/',RegisterView.as_view(),name='register')
]

from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'), 
    
]


urlpatterns = [

path('bookings/', BookingView.as_view()),

]

from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
]

from django.urls import path
from .views import CreateBookingView
urlpatterns = [

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


