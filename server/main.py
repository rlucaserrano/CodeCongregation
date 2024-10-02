import os
import requests as http_requests
from flask import Flask, request, jsonify, make_response, session
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
from database import Database
from config import Config

# Load environment variables
load_dotenv()

# Flask instance
app = Flask(__name__)

#  secret key for session management
app.secret_key = Config.FLASK_SECRET_KEY

#   Flask-Session 
from flask_session import Session
app.config['SESSION_TYPE'] = Config.SESSION_TYPE
app.config['SESSION_PERMANENT'] = Config.SESSION_PERMANENT
app.config['SESSION_USE_SIGNER'] = Config.SESSION_USE_SIGNER
Session(app)

#  CORS
CORS(app, supports_credentials=True)  # Allow credentials to be sent

GOOGLE_CLIENT_ID = Config.GOOGLE_CLIENT_ID

@app.route('/')
def default():
    return "Flask API"

# Database Functionality Testing
@app.route('/users/all', methods=['GET'])
def GetUsers():
    users = Database.SearchDatabase(table="MGOLAN.UserTable", columns=["UserName"])  # Use MGOLAN schema
    return jsonify(users)

@app.route('/users/addBob', methods=['GET'])
def AddBob():
    result = Database.AddToDatabase(table="MGOLAN.UserTable", entry=["0002", "'Bob123'", "'Bob@gmail.com'", "'Password'", "'Bob'", "'Bob'", "'bio'", "0"])
    return jsonify(result)

@app.route('/users/removeBob', methods=['GET'])
def RemoveBob():
    result = Database.RemoveFromDatabase(table="MGOLAN.UserTable", key="UserID", value="0002")
    return jsonify(result)

@app.route('/users/changeBob', methods=['GET'])
def ChangeBob():
    result = Database.ModifyDatabase(table="MGOLAN.UserTable", key="UserID", value="0002", changes=[("UserName", "'newUsernameBob'")])
    return jsonify(result)

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
        # verify  token with Google's OAuth2 library
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # token verified, retrieve user information
        user_id = idinfo['sub']  # Google's unique userID
        email = idinfo['email']
        name = idinfo.get('name')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        # check if the user already exist
        user_exists = Database.SearchDatabase("MGOLAN.UserTable", rows=f"UserID = '{user_id}'")
        
        if not user_exists:
            # if the user  new--> create an entry in the UserTable
            Database.AddToDatabase("MGOLAN.UserTable", [
                f"'{user_id}'",  # UserID
                f"'{name}'",     # UserName
                f"'{email}'",    # email
                "'HashedPasswordPlaceholder'",  # HashedPassword, replace with actual password logic
                f"'{first_name}'",  # FirstName
                f"'{last_name}'",   # LastName
                "'This is a bio'"    #  add more logic here to accept user input
            ])

        # store user session info (flask will automatically manage session cookies)
        session['user_id'] = user_id
        session['email'] = email
        session['name'] = name

        # return a success response with user information
        return jsonify({'status': 'success', 'user_id': user_id, 'email': email, 'name': name})

    except ValueError:
        # invalid token
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        # handle other exceptions
        print(f"An error occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/logout', methods=['POST'])
def logout():
    # clear the session data
    session.clear()
    return jsonify({'status': 'success', 'message': 'Logged out successfully'}), 200

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({
            'status': 'success',
            'message': 'User is logged in',
            'user_id': session['user_id'],
            'email': session['email'],
            'name': session['name']
        })
    else:
        return jsonify({'status': 'error', 'message': 'User not logged in'}), 401

@app.route('/api/calendar/events', methods=['GET'])
def get_calendar_events():
    token = request.args.get('token')
    try:
        # verify the token
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # retrieve the access token
        access_token = token
        
        # make a request to the Google Calendar API
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

@app.route('/test-oracle', methods=['GET'])
def test_oracle_connection():
    try:
       
        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM dual")  
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        
        return jsonify({'status': 'success', 'message': 'Oracle connection successful', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f"An error occurred: {str(e)}"}), 500

@app.route('/api/calendar/sync', methods=['POST'])
def sync_google_calendar():
    token = request.json.get('token')
    try:
        # verify the token with Google's OAuth2 library
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        # retrieve the access token and user ID
        user_id = idinfo['sub']
        access_token = token

        # make a request to the Google Calendar API to get the user's events
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = http_requests.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', headers=headers)

        if response.status_code == 200:
            events = response.json().get('items', [])
            
            
            for event in events:
                event_name = event.get('summary', 'No Title')
                start_date = event['start'].get('dateTime', event['start'].get('date'))
                end_date = event['end'].get('dateTime', event['end'].get('date'))
                google_id = event['id']

                
                Database.AddToDatabase("MGOLAN.Events", [
                    f"'{user_id}'",  
                    f"'{event_name}'",
                    f"'{event.get('description', '')}'",
                    f"TO_DATE('{start_date}', 'YYYY-MM-DD\"T\"HH24:MI:SS')",  
                    f"TO_DATE('{end_date}', 'YYYY-MM-DD\"T\"HH24:MI:SS')",
                    f"1",  
                    f"1",  
                    f"'{google_id}'",
                    "SYSDATE"  
                ])

            return jsonify({'status': 'success', 'message': 'Calendar events synced'})
        else:
            return jsonify({'status': 'error', 'message': 'Failed to fetch events from Google Calendar'}), response.status_code
    except ValueError:
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        print(f"An error occurred while syncing calendar: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400
@app.route('/api/update-user', methods=['POST'])
def update_user():
    data = request.json
    user_id = data.get('user_id')
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')  # plain text for now --> hash this later
    bio = data.get('bio') 

    if not user_id or not username or not password:
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    try:
        # hash the password -->help
        hashed_password = password  # replace with password hashing

        #  list of changes to update in the database
        changes = []
        if username:
            changes.append(("UserName", f"'{username}'"))
        if first_name:
            changes.append(("FirstName", f"'{first_name}'"))
        if last_name:
            changes.append(("LastName", f"'{last_name}'"))
        if password:
            changes.append(("HashedPassword", f"'{hashed_password}'"))
        if bio:
            changes.append(("Bio", f"'{bio}'"))

        # update  UserTable 
        Database.ModifyDatabase(
            table="MGOLAN.UserTable",
            key="UserID",
            value=user_id,
            changes=changes
        )

        return jsonify({'status': 'success', 'message': 'User information updated successfully'})
    except Exception as e:
        print(f"An error occurred while updating the user: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login_with_password():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Missing username or password'}), 400

    try:
        
        user = Database.SearchDatabase("MGOLAN.UserTable", rows=f"UserName = '{username}'")
        
        if not user:
            return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

        
        stored_password = user[0][3]  

       
        if password != stored_password:
            return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

        
        user_id = user[0][0]  
        return jsonify({'status': 'success', 'user_id': user_id, 'user_name': username})

    except Exception as e:
        print(f"An error occurred during login: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)
