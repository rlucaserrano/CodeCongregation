<<<<<<< HEAD
from flask import Flask, request, make_response
from flask_cors import CORS
from config import Config
from users import users_bp
from calendars import calendars_bp  #calendars blueprint
=======
import os
import jwt
import json
import requests as http_requests
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
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2


# Flask instance
app = Flask(__name__)
<<<<<<< HEAD
app.secret_key = Config.FLASK_SECRET_KEY
=======
CORS(app)  # Currently allowing all origins
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2

#fixing cors error
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

<<<<<<< HEAD
# register blueprints
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(calendars_bp, url_prefix='/api/calendar')  # register calendar routes

@app.route('/')
def home():
    return "Flask API Root"

#  custom CORS headers
=======
secret = 'testSecret'

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

@app.route('/info', methods=["POST"])
def info():
    token = request.data
    if (token.decode("utf-8") == ''):
        print("Token is empty")
        return json.dumps({})
    print("Token is: ", token)
    print('============')
    data = json.dumps(jwt.decode(token,key=secret,algorithms=['HS256']))
    print(data)
    return data

@app.route('/log', methods=["POST"])
def findUser():
    connection = Database.GetConnection()
    verify = list(request.json.get('data').values())
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM MGOLAN.USERTABLE WHERE (USERNAME = \''+ verify[0] +'\' AND HASHEDPASSWORD = \'' + verify[1] + '\')') #Had to be done slightly differently
    results = cursor.fetchall()
    if (len(results) == 1):
        data = {
            'id': results[0][0],
            'user': results[0][1],
            'mail': results[0][2],
            'pass': results[0][3],
            'first': results[0][4],
            'last': results[0][5],
            'bio': results[0][6],
            'admin': results[0][7]
        }
        print(data)
        print('============')
        token = jwt.encode(payload=data, key=secret)
        print(token)
        cursor.close()
        connection.close()
        return token
    else:
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
 
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
@app.after_request
def set_cors_headers(response):
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 200

<<<<<<< HEAD
=======
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


>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
if __name__ == "__main__":
    app.run(debug=True, port=8080)