from flask_socketio import SocketIO, emit
import time

# Initialize SocketIO
socketio = SocketIO(app)

# Socket event to send updates
@socketio.on('connect')
def handle_connect():
    print("Client connected")
    while True:
        # Send the updated counts every second (for demonstration)
        socketio.emit('screw_count', {'total': total, 'good': good, 'bad': bad})
        time.sleep(1)  # Simulate periodic updates

# Start the Flask app with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)
