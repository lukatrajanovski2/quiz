from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

CATEGORIES = [
    ('geography', 'geography'),
    ('history', 'history'),
    ('science', 'science'),
    ('sport', 'sport'),
]


class Question(models.Model):
    category = models.CharField(
        max_length=50, 
        choices=CATEGORIES, 
        default='geography'
    )
    question = models.CharField(max_length=200)
    answer1 = models.CharField(max_length=200)
    answer2 = models.CharField(max_length=200)
    answer3 = models.CharField(max_length=200)
    answer4 = models.CharField(max_length=200)
    right_answer = models.IntegerField(default='1')
    
class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bid")
    points = models.IntegerField()

