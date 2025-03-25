from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import jwt
import datetime
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

CORS(app, supports_credentials=True, origins="http://localhost:3000")

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

        token = jwt.encode({'userId': str(user.id), 'email': user.email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, os.getenv("JWT_SECRET"), algorithm="HS256")
        response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
        response.set_cookie("token", token, httponly=True, secure=False, max_age=86400)
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
            token = jwt.encode({'userId': str(user.id), 'email': user.email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, os.getenv("JWT_SECRET"), algorithm="HS256")
            response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
            response.set_cookie("token", token, httponly=True, secure=False, max_age=86400)
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

        token = jwt.encode({'userId': str(user.id), 'email': user.email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, os.getenv("JWT_SECRET"), algorithm="HS256")
        response = make_response(jsonify({"message": "Authentication successful", "user": user.to_json()}), 200)
        response.set_cookie("token", token, httponly=True, secure=False, max_age=86400)
        return response
    except Exception as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 400

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out"}))
    response.delete_cookie("token")
    return response

@app.route("/validate", methods=["GET"])
def validate():
    token = request.cookies.get('token')

    if not token:
        return jsonify({"valid": False, "error": "Unauthorized"}), 401

    try:
        decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return jsonify({"valid":True, "user": decoded})
    except jwt.ExpiredSignatureError:
        return jsonify({"valid": False, "error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"valid": False, "error": "Invalid token"}), 401
    


@app.route('/chats', methods=['GET'])
def get_chats():
    token = request.cookies.get("token")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        data = Messages.objects(email=decoded["email"]).first()
        return jsonify({"message": data.to_json() if data else None, "user": decoded})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    
@app.route('/save-chat', methods=['POST'])
def save_chat():
    try:
        data = request.json
        email = data.get("email").strip().lower()
        msg = data.get("messages")  # Expecting a list like [{'type': 'user', 'msg': 'hello'}]

        if not email or not msg:
            return jsonify({"error": "Missing required fields"}), 400

        # Find user chat history
        chat_entry = Messages.objects(email=email).first()

        if chat_entry:
            # Convert list of dicts to list of ChatMessage objects
            chat_entry.messages = [ChatMessage(**m) for m in msg]
        else:
            # Create new entry
            chat_entry = Messages(email=email, messages=[ChatMessage(**m) for m in msg])

        chat_entry.save()
        return jsonify({"message": "Chat updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete-chat', methods=['DELETE'])
def delete_chat():
    try:
        data = request.json
        email = data.get("email").strip().lower()

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Find user chat history
        chat_entry = Messages.objects(email=email).first()

        if chat_entry:
            chat_entry.messages = []  # Clear messages
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
    app.run(port=PORT, debug=True)