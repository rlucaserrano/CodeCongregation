import os
import jwt
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from database import Database
from users import Users
from educationalresources import EducationalResources
from proc_and_sec import ProcAndSec

# Load environment variables
load_dotenv()

# Flask instance
app = Flask(__name__)

# CORS Configuration to allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
secret = os.getenv('FLASK_SECRET_KEY')

@app.route('/')
def default():
    return "Flask API"

# Access the user table with various methods
@app.route('/users', methods=["GET", "POST", "DELETE", "PATCH", "HEAD", "OPTIONS"])
def AccessUserTable():
    if request.method == 'OPTIONS':
        # Respond to preflight request with appropriate CORS headers
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204  # Use 204 No Content for OPTIONS requests

    user = Users(request.json)
    return user.Methods(request.method)

# Access the educational resources
@app.route('/educationalresources', methods=["GET", "POST", "DELETE", "PATCH", "OPTIONS"])
def AccessEducationalResources():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    resources = EducationalResources(request.json)
    resources.Process()
    return resources.Methods(request.method)

# Add a new user
@app.route('/add', methods=["POST", "OPTIONS"])
def addUser():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    connection = Database.GetConnection()
    addNew = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute(
        '''INSERT INTO MGOLAN.USERTABLE (USERID, USERNAME, HASHEDPASSWORD, EMAIL, ADMIN) 
           VALUES (:0, :1, :2, :3, :4)''', addNew)
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"status": "User created successfully"}), 201

# Retrieve user information
@app.route('/info', methods=["POST", "OPTIONS"])
def info():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    token = request.data
    if not token:
        return jsonify({"error": "Token is empty"}), 401

    try:
        data = jwt.decode(token, key=secret, algorithms=['HS256'])
        return jsonify(data), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

# Find user and authenticate
@app.route('/log', methods=["POST", "OPTIONS"])
def findUser():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    connection = Database.GetConnection()
    verify = list(request.json.get('data').values())
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM MGOLAN.USERTABLE WHERE USERNAME = :1', [verify[0]])
    results = cursor.fetchone()

    if results and ProcAndSec.HashAndSalt(verify[1]) == results[2]:
        data = {
            'id': results[0],
            'user': results[1],
            'mail': results[3],
            'pass': results[2],
            'first': results[4],
            'last': results[5],
            'bio': results[6],
            'admin': results[7]
        }
        token = jwt.encode(payload=data, key=secret)
        cursor.close()
        connection.close()
        return token
    else:
        cursor.close()
        connection.close()
        return jsonify({"error": "Invalid username or password"}), 401

# Google OAuth2 login route with account linking
@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def google_login():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    token = request.json.get('token')
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')

        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MGOLAN.USERTABLE WHERE EMAIL = :1', [email])
        user_data = cursor.fetchone()

        if user_data:
            cursor.execute(
                'UPDATE MGOLAN.USERTABLE SET USERID = :1 WHERE EMAIL = :2', 
                [user_id, email]
            )
        else:
            cursor.execute(
                '''INSERT INTO MGOLAN.USERTABLE (USERID, EMAIL, USERNAME, HASHEDPASSWORD, ADMIN) 
                   VALUES (:1, :2, :3, :4, :5)''', 
                [user_id, email, name, '', 0]
            )

        connection.commit()
        cursor.close()
        connection.close()

        response = jsonify({'status': 'success', 'user_id': user_id, 'email': email, 'name': name})
        response.set_cookie('session_id', user_id, samesite='Strict')
        return response
    except ValueError:
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

# Set CORS headers after each request
@app.after_request
def set_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

if __name__ == "__main__":
    app.run(debug=True, port=8080)
