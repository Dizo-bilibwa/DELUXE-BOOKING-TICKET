from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API routes (core app)
    path('api/', include('core.urls')),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # React Homepage
    path('', TemplateView.as_view(template_name='index.html'), name='home'),

    # React Router fallback (important for SPA)
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]