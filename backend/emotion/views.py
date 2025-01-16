from rest_framework.exceptions import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .services.emotion_detector import EmotionDetector

"""Emotion Detector class inheriting DjangoRestFramework's APIView to interact with the frontend"""
class EmotionDetectorView(APIView):
    def __init__(self):
        self.detector = EmotionDetector()

    """This function will be executed with a POST request and return emotion values in form of hashmap (JSON)"""
    def post(self, request):
        try:
            image_data = request.data.get('image')
            if not image_data:
                return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            results = self.detector.process_image(image_data)
            print(results)
            return Response(results)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
