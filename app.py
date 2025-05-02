from flask import Flask, render_template, Response
import cv2

app = Flask(__name__)

# Initialize the conveyor camera
camera = cv2.VideoCapture(0)

def generate_video():
    while True:
        ret, frame = camera.read()
        if not ret:
            break

        # Convert the frame to JPEG
        ret, jpeg = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        # Yield the frame in the MJPEG format
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')  # Your HTML template name

if __name__ == '__main__':
    app.run(debug=True)
