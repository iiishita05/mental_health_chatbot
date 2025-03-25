from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import os
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from models import predict_sentiment, chat_with_model

# Load environment variables
load_dotenv()

app = Flask(__name__)
PORT = 5000

# Configure MongoDB
app.config['MONGODB_SETTINGS'] = {
    'db': 'your_db_name',
    'host': os.getenv("MONGO_URI")
}
db = MongoEngine(app)

CORS(app, origins=["*"])

class User(db.Document):
    email = db.StringField(required=True, unique=True)
    name = db.StringField(required=True)
    password = db.StringField()
    authSource = db.StringField(default="self", choices=["self", "google"])

class ChatMessage(db.EmbeddedDocument):
    type = db.StringField(required=True) 
    msg = db.StringField(required=True) 

class Messages(db.Document):
    email = db.StringField(required=True)
    messages = db.ListField(db.EmbeddedDocumentField("ChatMessage"))


@app.route('/google-auth', methods=['POST'])
def google_auth():
    try:
        data = request.json
        credential = data.get("credential")
        client_id = data.get("client_id")

        payload = id_token.verify_oauth2_token(credential, requests.Request(), client_id)
        email = payload.get("email")
        given_name = payload.get("given_name")
        family_name = payload.get("family_name")

        user = User.objects(email=email).first()
        if not user:
            user = User(email=email, name=f"{given_name} {family_name}", authSource="google").save()

        response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
        return response
    except Exception as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 400

@app.route("/self-auth/login", methods=["POST"])
def self_auth_login():
    try:
        data = request.json
        email = data.get("email")
        name = data.get("name")
        password = data.get("password")

        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "No user found"}), 400

        if user.password == password:
            response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
            return response
        else:
            return jsonify({"error":"wrong password"}), 400
    except Exception as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 400

@app.route("/self-auth/signup", methods=["POST"])
def self_auth_signin():
    try:
        data = request.json
        email = data.get("email")
        name = data.get("name")
        password = data.get("password")
        user = User(email=email, name=name, password=password, authSource="self").save()
        response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
        return response
    except Exception as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 400

@app.route('/chats', methods=['POST'])
def get_chats():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        data = Messages.objects(email=email).first()
        return jsonify({"message": data.to_json() if data else [].to_json()})
    except:
        return jsonify({"error": "Email Not Found"}), 401
    
@app.route('/save-chat', methods=['POST'])
def save_chat():
    try:
        data = request.json
        email = data.get("email")
        msg = data.get("messages")  

        if not email or not msg:
            return jsonify({"error": "Missing required fields"}), 400

        chat_entry = Messages.objects(email=email).first()

        if chat_entry:
            chat_entry.messages = [ChatMessage(**m) for m in msg]
        else:
            chat_entry = Messages(email=email, messages=[ChatMessage(**m) for m in msg])

        chat_entry.save()
        return jsonify({"message": "Chat updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete-chat', methods=['DELETE'])
def delete_chat():
    try:
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        chat_entry = Messages.objects(email=email).first()

        if chat_entry:
            chat_entry.messages = []  
            chat_entry.save()
            return jsonify({"message": "Chat deleted successfully"}), 200
        else:
            return jsonify({"error": "No chat history found for this email"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    user_message = data["message"]
    history = data["history"]
    prediction = predict_sentiment(user_message)

    bot_response = chat_with_model(user_message, history, prediction)
    
    return jsonify({"response": bot_response})


if __name__ == '__main__':
    app.run(port=PORT, debug=True, host="0.0.0.0")