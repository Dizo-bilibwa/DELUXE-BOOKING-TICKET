from django.contrib import admin
from .models import Patient
from .models import Payment
admin.site.register(Patient)

from django.contrib import admin
from .models import Route, Train, TravelDate, TicketClass, Booking, Ticket

admin.site.register(Route)
admin.site.register(Train)
admin.site.register(TravelDate)
admin.site.register(TicketClass)
admin.site.register(Booking)
admin.site.register(Ticket)
admin.site.register(Payment)