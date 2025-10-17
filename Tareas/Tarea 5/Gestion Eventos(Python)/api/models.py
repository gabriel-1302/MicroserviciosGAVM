from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()
    location = models.CharField(max_length=100)
    capacity = models.IntegerField()
    price = models.FloatField()

    def __str__(self):
        return self.name
