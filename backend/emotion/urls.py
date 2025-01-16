from django.urls import path
from .views import EmotionDetectorView

urlpatterns = [
    path('detect/', EmotionDetectorView.as_view(), name='detect-emotion'),
]
