from deepface import DeepFace
import cv2
import numpy as np
import base64

class EmotionDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    def process_image(self, base64_image):
        try:
            img_data = base64.b64decode(base64_image.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            analysis = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)

            return {
                'emotions': analysis[0]['emotion'],
                'dominant_emotion': analysis[0]['dominant_emotion']
            }

        except Exception as e:
            return {"error": str(e)}
