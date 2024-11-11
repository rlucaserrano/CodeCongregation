# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
# functions/main.py

from flask import Flask, jsonify, request
from firebase_functions import https_fn

app = Flask(__name__)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask on Firebase Functions!"})

# Define the Firebase function entry point
@https_fn.on_request
def flask_app(request):
    return app(request)