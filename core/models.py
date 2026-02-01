from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100)
    age =models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20)
    def __str__(self):
        return self.name

class Route(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.origin} to {self.destination}"

 
class Train(models.Model):
    train_name = models.CharField(max_length=100)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)

    def __str__(self):
        return self.train_name

class TravelDate(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE)
    travel_date = models.DateField()

    def __str__(self):
        return f"{self.train} - {self.travel_date}"

class TicketClass(models.Model):
    CLASS_CHOICES = [
        ('First', 'First Class'),
        ('Second', 'Second Class'),
        ('Third', 'Third Class'),
    ]

    name = models.CharField(max_length=20, choices=CLASS_CHOICES)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.price}"


from django.contrib.auth.models import User

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    travel_date = models.ForeignKey(TravelDate, on_delete=models.CASCADE)
    ticket_class = models.ForeignKey(TicketClass, on_delete=models.CASCADE)
    seats = models.IntegerField(default=1)
    booking_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.IntegerField()

    def __str__(self):
        return f"booking #{self.id} - {self.user.username}"
    

class Ticket(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=20, unique=True)
    issued_date = models.DateTimeField(auto_now_add=True)

def __str__(self):
    return self.ticket_number



class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="PAID")



class Payment(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
def __str__(self):
        return f"Payment {self.booking.id} - {self.status}"





