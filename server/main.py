import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv

# from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # currently allowing all origins

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

@app.after_request
def set_cors_headers(response):
    # Set COOP and COEP headers
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    return response

@app.route("/api/dev2", methods=['GET'])
def dev2():
    return jsonify(
        {
            "dev2": [
                'helloworld',
                'helloworld2',
                'helloworld3'
            ]
        }
    )

@app.route('/api/auth/google', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        # verify token with Google's OAuth2 library
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # the token is verified -->   retrieve user information
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')

        # save user information in database or session
        # return the user information to the frontend
        response = jsonify({'status': 'success', 'user_id': user_id, 'email': email, 'name': name})
        # set a cookie with SameSite attribute
        response.set_cookie('session_id', user_id, samesite='Strict')  # example cookie[replace]
        return response
    except ValueError:
        # invalid token
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        # handle other exceptions
        print(f"An error occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=8080)