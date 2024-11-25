from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    # Simulate chat response logic
    user_message = data['message']
    response = process_message(user_message)
    emit('response', {'message': response})

def process_message(message):
    # Simple responses based on keywords
    if "book" in message.lower():
        return "Which movie would you like to book tickets for?"
    elif "times" in message.lower():
        return "What time would you prefer to watch the movie?"
    else:
        return "I'm not sure how to help with that. Can you try asking something else about booking?"

if __name__ == '__main__':
    socketio.run(app, debug=True)
