import os
import requests as http_requests
import oracledb
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from database import Database
from users import Users
from educationalresources import EducationalResources

# Educational sources used to setup main.py
# 1. https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/HTTP-methods
# 2. https://www.oxitsolutions.co.uk/blog/http-status-code-cheat-sheet-infographic

# from .env file
load_dotenv()


# Flask instance
app = Flask(__name__)
CORS(app)  # Currently allowing all origins

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

@app.route('/')
def default():
    return "Flask API"

#### Actual database routes ####

@app.route('/users', methods=["GET", "POST", "DELETE", "PATCH", "HEAD", "OPTIONS"])
def AccessUserTable():

    # Constucts user object to assign parameters and calls methods function, returns json data.
    user = Users(request.json)
    return (user.Methods(request.method))

@app.route('/educationalresources', methods=["GET", "POST", "DELETE", "PATCH", "OPTIONS"])
def AccessEducationalResources():

    # Accesses EducationalResources from database
    resources = EducationalResources(request.json)
    resources.Process()
    return (resources.Methods(request.method))

@app.route('/add', methods=["POST"])
def addUser():
    connection = Database.GetConnection()
    addNew = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('''INSERT INTO MGOLAN.USERTABLE(USERID,USERNAME,HASHEDPASSWORD,EMAIL,ADMIN) VALUES(:0,:1,:2,:3,:4)''', addNew)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/log', methods=["POST"])
def findUser():
    connection = Database.GetConnection()
    verify = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('''SELECT * FROM MGOLAN.USERTABLE(USERNAME,HASHEDPASSWORD) VALUES(:0,:1)''', verify)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/res', methods=["GET"])
def getRes():
    connection = Database.GetConnection()
    cursor = connection.cursor()
    cursor.execute('''SELECT RESOURCENAME, WEBSITEURL, RESOURCECATEGORY, VOTES FROM MGOLAN.EDUCATIONALRESOURCES''')
    toReturn = cursor.fetchall();
    cursor.close()
    connection.close()
    return toReturn
 
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

@app.route('/api/calendar/events', methods=['GET'])
def get_calendar_events():
    token = request.args.get('token')
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Retrieve the access token
        access_token = token
        
        # Make a request to the Google Calendar API
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = http_requests.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', headers=headers)

        if response.status_code == 200:
            events = response.json().get('items', [])
            return jsonify(events)
        else:
            return jsonify({'status': 'error', 'message': 'Failed to fetch events'}), response.status_code
    except ValueError:
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        print(f"An error occurred while fetching calendar events: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=8080)