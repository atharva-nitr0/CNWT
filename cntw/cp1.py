import cv2
import os
from ultralytics import YOLO

from pygrabber.dshow_graph import FilterGraph

graph = FilterGraph()

cameras = graph.get_input_devices()
print("Available Cameras:")
for idx, name in enumerate(cameras):
    print(f"[{idx}] {name}")


# Corrected model path
model_path = r"C:\Users\athar\Desktop\cntw\cntw\best.pt"

# Check if model exists
if not os.path.exists(model_path):
    print(f"Error: Model file '{model_path}' not found.")
    exit()

# Load the model
model = YOLO(model_path)

# Function to find external USB camera
def find_external_camera():
    for i in range(5):  # check first 5 devices
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            # Read a test frame
            ret, frame = cap.read()
            if ret:
                # Heuristic: external USB cameras usually have higher resolutions
                h, w = frame.shape[:2]
                print(f"Camera {i}: resolution {w}x{h}")
                if w >= 640 and h >= 480:  # assuming external camera has at least 640x480
                    print(f"Using Camera {i}")
                    return i
            cap.release()
    print("No external camera found.")
    exit()

# Find the external cam
camera_index = find_external_camera()

# Open the webcam
cap = cv2.VideoCapture(0)

# Check if the webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to grab frame.")
        break

    # Run YOLO prediction on the frame
    results = model.predict(source=frame, save=False, conf=0.5, verbose=False)

    # Draw the predictions on the frame
    annotated_frame = results[0].plot()

    # Show the frame
    cv2.imshow('YOLOv8 Real-Time Detection', annotated_frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and destroy windows
cap.release()
cv2.destroyAllWindows()
