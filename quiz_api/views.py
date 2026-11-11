from django.shortcuts import render
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Question, Leaderboard

def index(request):
    if request.user.is_authenticated:
        return render(request, "quiz_api/inbox.html")
    else:
        return HttpResponseRedirect(reverse("login"))



def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "quiz_api/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "quiz_api/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "quiz_api/register.html", {
                "message": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, username, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "quiz_api/register.html", {
                "message": "username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "quiz_api/register.html")

def get_category(request):
    categories_queryset = Question.objects.values_list('category', flat=True).distinct()
    
    categories_list = list(categories_queryset)
    return JsonResponse({
        "status": "success",
        "count": len(categories_list),
        "categories": categories_list
    })

def get_questions(request, category):
    questions = Question.objects.filter(category=category).values('question', 'answer1',
     'answer2', 'answer3', 'answer4', 'right_answer')
    
    all_questions = list(questions)
    
    return JsonResponse({
        "status": "success",
        "category": category,
        "length": len(all_questions),
        "questions": all_questions
    })

import json
from django.http import JsonResponse
from .models import Leaderboard

def leader(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            score = data.get('score')

            # 1. Снима во база САМО ако корисникот пратил score (кога завршува квиз)
            if score is not None:
                Leaderboard.objects.create(
                    user=request.user,
                    points=score
                )
            
            # 2. Ги зема сите редови и ги подредува (од најмногу кон најмалку поени)
            top_korisnici = Leaderboard.objects.order_by('-points')[:10] 
            lista_podatoci = []
            
            for k in top_korisnici:
                lista_podatoci.append({
                    'points': k.points,
                    'user': k.user.username  # Сигурно си најавен, директно го земаме username
                })
            
            return JsonResponse({'status': 'success', 'leaderboard': lista_podatoci})
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Only POST requests allowed'}, status=405)