from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
import os

app = Flask(__name__)
CORS(app)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def decode_image(image_data):
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    img_bytes = base64.b64decode(image_data)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    return cv2.imdecode(img_array, cv2.IMREAD_COLOR)

def detect_emotion(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    if len(faces) == 0:
        return 'neutral', 0.5
    x, y, w, h = faces[0]
    face = gray[y:y+h, x:x+w]
    brightness = np.mean(face)
    contrast = np.std(face)
    if brightness > 140 and contrast > 40:
        return 'happy', 0.75
    elif brightness < 90:
        return 'bored', 0.65
    elif contrast < 25:
        return 'confused', 0.60
    elif brightness > 120 and contrast > 50:
        return 'focus', 0.70
    else:
        return 'neutral', 0.55

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400
    try:
        img = decode_image(data['image'])
        emotion, confidence = detect_emotion(img)
        return jsonify({'emotion': emotion, 'confidence': round(confidence, 3)})
    except Exception as e:
        return jsonify({'emotion': 'neutral', 'confidence': 0.5})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'model': 'OpenCV'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print(f'ML API running on port {port}')
    app.run(host='0.0.0.0', port=port, debug=True)