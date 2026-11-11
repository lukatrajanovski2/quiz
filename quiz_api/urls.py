from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('quiz_api/categories/', views.get_category, name='get_category'),
    path('quiz_api/questions/<str:category>/', views.get_questions, name='get_questions'),
    path('quiz_api/leaderboard/', views.leader, name='leader')
]
