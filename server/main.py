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

import random
from flask import request, jsonify, make_response
from database import Database
from proc_and_sec import ProcAndSec

@app.route('/add', methods=["POST", "OPTIONS"])
def addUser():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    addNew = request.json.get('data')

    try:
        # Auto-generate USERID using a random number within the valid range.
        user_id = random.randint(1, 10**18)  # Adjust the range if needed for uniqueness.
        username = addNew.get('2')  # USERNAME
        email = addNew.get('3')  # EMAIL
        hashed_password = addNew.get('4')  # HASHEDPASSWORD, should be hashed before sending.
        first_name = addNew.get('5', None)  # FIRSTNAME (Optional)
        last_name = addNew.get('6', None)  # LASTNAME (Optional)
        bio = addNew.get('7', None)  # BIO (Optional)
        admin = int(addNew.get('8', 0))  # ADMIN, convert to integer, default to 0 if not provided.

        # Ensure required fields are provided.
        if not all([username, email, hashed_password]):
            return jsonify({"ERROR": "Missing required fields: Username, Email, and Password"}), 400

        # Construct the SQL statement with placeholders.
        sql = '''
            INSERT INTO MGOLAN.USERTABLE (
                USERID, USERNAME, EMAIL, HASHEDPASSWORD, FIRSTNAME, LASTNAME, BIO, ADMIN
            ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
        '''

        # Prepare the values list based on column ID order.
        values = [
            user_id,          # :1 - USERID (auto-generated)
            username,         # :2 - USERNAME
            email,            # :3 - EMAIL
            hashed_password,  # :4 - HASHEDPASSWORD
            first_name,       # :5 - FIRSTNAME (or NULL)
            last_name,        # :6 - LASTNAME (or NULL)
            bio,              # :7 - BIO (or NULL)
            admin             # :8 - ADMIN (defaults to 0 for regular users)
        ]

        # Connect to the database and execute the query.
        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute(sql, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"status": "User created successfully", "user_id": user_id}), 201

    except ValueError as ve:
        print(f"ValueError during user creation: {ve}")
        return jsonify({"ERROR": "Invalid input type. ADMIN must be a number."}), 400
    except Exception as e:
        print(f"Error during user creation: {e}")
        return jsonify({"ERROR": str(e)}), 500


    except ValueError as ve:
        print(f"ValueError during user creation: {ve}")
        return jsonify({"ERROR": "Invalid input type. USERID and ADMIN must be numbers."}), 400
    except Exception as e:
        print(f"Error during user creation: {e}")
        return jsonify({"ERROR": str(e)}), 500

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

    try:
        data = request.json.get('data', {})
        username = data.get('Username')
        password = data.get('Password')

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400

        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM MGOLAN.USERTABLE WHERE USERNAME = :1', [username])
        user_data = cursor.fetchone()

        if user_data:
            user_id, db_username, db_email, db_password, *_ = user_data
            # Check password using the hash function (assume ProcAndSec.HashAndSalt hashes the password for comparison)
            if ProcAndSec.HashAndSalt(password) == db_password:
                # Generate a token
                token = jwt.encode({
                    'id': user_id,
                    'user': db_username,
                    'mail': db_email
                }, key=secret, algorithm='HS256')
                cursor.close()
                connection.close()
                return token
            else:
                return jsonify({"error": "Invalid username or password."}), 401
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An error occurred during login."}), 500
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
