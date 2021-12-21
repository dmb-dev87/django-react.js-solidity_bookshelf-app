from django.db import models

# Create your models here.

class Book(models.Model):
  title = models.CharField(max_length=140)
  author = models.CharField(max_length=140)
  year = models.IntegerField()
  finished = models.BooleanField()