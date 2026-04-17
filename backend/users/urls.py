from django.urls import path
from .views import RegisterAPI, UserAPI, ResetPasswordAPI
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserAPI.as_view(), name='user'),
    path('reset-password/', ResetPasswordAPI.as_view(), name='reset_password'),
]
