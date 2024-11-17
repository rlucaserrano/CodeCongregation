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
from group_resources import GroupResources
from proc_and_sec import ProcAndSec
from educationalresources import EducationalResources
from flask import Flask, request, jsonify, make_response, Response
import bcrypt


# Educational sources used to setup main.py
# 1. https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/HTTP-methods
# 2. https://www.oxitsolutions.co.uk/blog/http-status-code-cheat-sheet-infographic

# from .env file
load_dotenv()


# Flask instance
app = Flask(__name__)
#CORS(app)  # Currently allowing all origins
#CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
#made an edit here to make sure CORS issue is solved
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True, methods=["GET", "POST", "PATCH", "DELETE","HEAD", "OPTIONS"])
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

secret = 'testSecret'

@app.route('/')
def default():
    return "Flask API"

#### Database Routes ####

@app.route('/groupresources', methods=["GET", "POST", "DELETE", "PATCH", "OPTIONS"])
def AccessGroupResources():

    if request.method == "OPTIONS":
        # Handles CORS request
        response = jsonify({"Options": "GET, POST, DELETE, OPTIONS"})
        response.status_code = 200
        return response

    # Accesses EducationalResources from database


    # Check the raw data before parsing
    data = request.get_json()
    resources = GroupResources(data)
    resources.Process()
    return (resources.Methods(request.method))

@app.route('/users', methods=["GET", "POST", "DELETE", "PATCH", "OPTIONS", "HEAD"])
def AccessUserTable():
    # handle OPTIONS request for CORS preflight
    print("HTTP method:", request.method) #debugging 
    print("Request JSON:", request.json)
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, HEAD, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 204

    # process user-related requests
    user = Users(request.json)
    user.Process()
    return user.Methods(request.method)

@app.route('/educationalresources', methods=["GET", "POST", "DELETE", "PATCH", "OPTIONS"])
def AccessEducationalResources():

    
    if request.method == "OPTIONS":
        # Handles CORS request
        response = jsonify({"Options": "GET, POST, DELETE, OPTIONS"})
        response.status_code = 200
        return response

    # Accesses EducationalResources from database
    data = None
    if request.method != "GET":
        data = request.get_json()

    resources = EducationalResources(data)
    #resources.Process()
    return (resources.Methods(request.method))

@app.route('/webpages', methods=["POST", "OPTIONS"])
def AccessWebPages():

    if request.method == "OPTIONS":
        # Handles CORS request
        response = jsonify({"Options": "GET, POST, DELETE, OPTIONS"})
        response.status_code = 200
        return response
    else:
        data = request.get_json()
        baseURL = data.get("HomePage", None)
        action = data.get("Action", None)
        print("ABC2")
        if action == "GET":

            result = Database.SearchDatabase(table="MGOLAN.Websites", rows=f"BaseURL = '{baseURL}'", distinct='yes')
            print(result)
            return (result)

@app.route('/feedback', methods=["POST", "OPTIONS"])
def AccessFeedback():

    if request.method == "OPTIONS":
        # Handles CORS request
        response = jsonify({"Options": "GET, POST, DELETE, OPTIONS"})
        response.status_code = 200
        return response
    else:
        data = request.get_json()
        description = data.get("valDescription", None)
        category = data.get("valCategory", None)
        resourceID = data.get("valResourceID", None)

        result = Database.AddToDatabase(table="MGOLAN.Feedback", entry=[f"{resourceID}", f"'{category}'", f"'{description}'"])
        return (jsonify({"result": str(result)}))

# made changes to increment userID by 1 for simplicity
@app.route('/add', methods=["POST"])
def addUser():
    connection = Database.GetConnection()
    addNew = request.json.get('data')
    
    # hash password before storing into database
    addNew['hashedPassword'] = ProcAndSec.HashAndSalt(addNew['hashedPassword'])
    
    cursor = connection.cursor()
    cursor.execute(
        '''INSERT INTO MGOLAN.USERTABLE (USERID, USERNAME, HASHEDPASSWORD, EMAIL, ADMIN, FIRSTNAME, LASTNAME)
           VALUES (ALLIEMONTIAGUE.user_id_seq.NEXTVAL, :1, :2, :3, :4, :5, :6)''',
        (addNew['username'], addNew['hashedPassword'], addNew['email'], addNew['admin'], addNew.get('firstName'), addNew.get('lastName'))
    )
    
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"SUCCESS": "User added"}), 200

@app.route('/update_user', methods=["PATCH"])
def update_user():
    if not request.is_json:
        return jsonify({"ERROR": "Request must be JSON"}), 400

    data = request.json
    print("Received PATCH data:", data)  # debugging

    user_id = data.get("valUserID")
    if user_id is None:
        return jsonify({"ERROR": "UserID is required for updating user"}), 400

    fields_to_update = []
    values = []

    if "valUserName" in data:
        fields_to_update.append("USERNAME = :1")
        values.append(data["valUserName"])
    if "valHashedPassword" in data:
        fields_to_update.append("HASHEDPASSWORD = :2")
        values.append(data["valHashedPassword"])
    if "valEmail" in data:
        fields_to_update.append("EMAIL = :3")
        values.append(data["valEmail"])
    if "valFirstName" in data:
        fields_to_update.append("FIRSTNAME = :4")
        values.append(data.get("valFirstName"))
    if "valLastName" in data:
        fields_to_update.append("LASTNAME = :5")
        values.append(data.get("valLastName"))
    if "valBio" in data:
        fields_to_update.append("BIO = :6")
        values.append(data.get("valBio"))
    if "valAdmin" in data:
        fields_to_update.append("ADMIN = :7")
        values.append(data.get("valAdmin"))

    
    if not fields_to_update:
        return jsonify({"ERROR": "No valid fields provided for update"}), 400

    values.append(user_id)  
    set_clause = ", ".join(fields_to_update)

    connection = Database.GetConnection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            f'''UPDATE MGOLAN.USERTABLE SET {set_clause} WHERE USERID = :{len(values)}''',
            values
        )
        connection.commit()
        return jsonify({"SUCCESS": "User updated successfully"}), 200
    except Exception as e:
        print("Error during user update:", e)
        return jsonify({"ERROR": "Failed to update user"}), 500
    finally:
        cursor.close()
        connection.close()


@app.route('/addgroup', methods=["POST"])
def addGroup():
    connection = Database.GetConnection()
    addNew = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('''INSERT INTO MGOLAN.STUDYGROUPS(GROUPID,GROUPNAME,GROUPCALENDARID,PERMANENCE,GROUPBIO) VALUES(:0,:1,:2,:3,:4)''', addNew)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/addmem', methods=["POST"])
def addMember():
    connection = Database.GetConnection()
    addNew = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('''INSERT INTO MGOLAN.GROUPMEMBERS VALUES(:0,:1,:2,:3)''', addNew)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/groups', methods=["POST"])
def findGroup():
    connection = Database.GetConnection()
    user = (request.data).decode("utf-8")
    cursor = connection.cursor()
    cursor.execute('SELECT GROUPID, GROUPMANAGER FROM MGOLAN.GROUPMEMBERS WHERE (USERID = \'' + user + '\' AND ACCEPTED = 1)')
    results = cursor.fetchall()
    groups = []
    for i in results:
        id = str(i[0])
        cursor.execute('SELECT GROUPNAME, GROUPBIO, GROUPID FROM MGOLAN.STUDYGROUPS WHERE (GROUPID = \'' + id +'\')')
        entry = cursor.fetchall()
        entry.append(i[1])
        groups.append(entry)
    cursor.close()
    connection.close()
    groups.sort()
    return groups

@app.route('/invite', methods=["POST"])
def findInvite():
    connection = Database.GetConnection()
    user = (request.data).decode("utf-8")
    cursor = connection.cursor()
    cursor.execute('SELECT GROUPID FROM MGOLAN.GROUPMEMBERS WHERE (USERID = \'' + user + '\' AND ACCEPTED = 0)')
    results = cursor.fetchall()
    groups = []
    for i in results:
        id = str(i[0])
        cursor.execute('SELECT GROUPNAME, GROUPBIO, GROUPID FROM MGOLAN.STUDYGROUPS WHERE (GROUPID = \'' + id +'\')')
        groups.append(cursor.fetchall())
    cursor.close()
    connection.close()
    groups.sort()
    return groups

@app.route('/groupacc', methods=["POST"])
def acceptInvite():
    connection = Database.GetConnection()
    accept = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('UPDATE MGOLAN.GROUPMEMBERS SET ACCEPTED = 1 WHERE (GROUPID = :0 AND USERID = :1 AND ACCEPTED = 0)', accept)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/grouprej', methods=["POST"])
def rejectInvite():
    connection = Database.GetConnection()
    reject = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('DELETE FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = :0 AND USERID = :1 AND ACCEPTED = 0)', reject)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/memberid', methods=["POST"])
def findIds():
    connection = Database.GetConnection()
    data = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('SELECT USERID, ACCEPTED FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = :0 AND USERID != :1)', data)
    results = cursor.fetchall()
    members = []
    friends = []
    for i in results:
        ind = []
        id = str(i[0])
        cursor.execute('SELECT USERNAME, USERID FROM MGOLAN.USERTABLE WHERE (USERID = \'' + id +'\')')
        result = cursor.fetchall()
        members.append(result[0][0])
        ind.append(result[0][1])
        cursor.execute('SELECT FRIENDSTATUS, NUMBEROFCOLLABORATIONS FROM MGOLAN.COLLABORATIONHISTORY WHERE ((FIRSTUSERID = \'' + id +'\' AND SECONDUSERID = \'' + data["1"] +'\') OR (FIRSTUSERID = \'' + data["1"] +'\' AND SECONDUSERID = \'' + id +'\')) FETCH FIRST 1 ROWS ONLY')
        res = (cursor.fetchall())
        if (res == []):
            ind.append(-1) #Friend Status
            ind.append(0) #Collaboration Count
            ind.append(i[1]) #Accepted Invite to Group
        else:
            ind.append(res[0][0])
            ind.append(res[0][1])
            ind.append(i[1])
        friends.append(ind)
    cursor.close()
    connection.close()
    toReturn = dict(zip(members, friends))
    return toReturn

@app.route('/friendreq', methods=["POST"])
def friendReq():
    connection = Database.GetConnection()
    data = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('''INSERT INTO MGOLAN.COLLABORATIONHISTORY VALUES(:0,:1,0,:2)''', data)
    connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/sendinvite', methods=["POST"])
def sendInvite():
    connection = Database.GetConnection()
    data = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('SELECT USERID FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = \'' + data["0"] + '\' AND USERID = \'' + data["1"] + '\' AND GROUPMANAGER = 1)')
    manager = cursor.fetchall()
    if (manager == []):
        print("Not a manager")
    else:
        cursor.execute('SELECT USERID FROM MGOLAN.USERTABLE WHERE (USERNAME = \'' + data["2"] + '\')')
        userID = cursor.fetchall()
        if(userID == []):
            print("No such user exists")
        else:
            cursor.execute('SELECT USERID FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = \'' + data["0"] + '\' AND USERID = \'' + str(userID[0][0]) + '\')')
            sent = cursor.fetchall()
            if(sent != []):
                print("Invite already sent/accepted")
            else:
                cursor.execute('INSERT INTO MGOLAN.GROUPMEMBERS VALUES(\'' + data["0"] + '\',\'' + str(userID[0][0]) + '\',0,0)')
                connection.commit()
                print("Invited")
    cursor.close()
    connection.close()
    return ""

@app.route('/leave', methods=["POST"])
def leave():
    connection = Database.GetConnection()
    data = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('DELETE FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = :0 AND USERID = :1)', data)
    connection.commit()
    cursor.close()
    connection.close()
    return ""


@app.route('/remuser', methods=["POST"])
def remove():
    connection = Database.GetConnection()
    data = request.json.get('data')
    cursor = connection.cursor()
    cursor.execute('SELECT USERID FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = \'' + data["0"] + '\' AND USERID = \'' + data["1"] + '\' AND GROUPMANAGER = 1)')
    manager = cursor.fetchall()
    if (manager == []):
        print("Not a manager")
    else:
        #If we allow deletion by typing (instead of selecting)
        cursor.execute('SELECT USERID FROM MGOLAN.USERTABLE WHERE (USERNAME = \'' + data["2"] + '\')')
        userID = cursor.fetchall()
        if(userID == []):
            print("No such user exists")
        else:
            #Else skip to this (replacing userID with the JSON entry)
            cursor.execute('DELETE FROM MGOLAN.GROUPMEMBERS WHERE (GROUPID = \'' + data["0"] + '\' AND USERID = \'' + str(userID[0][0]) + '\')')
            connection.commit()
    cursor.close()
    connection.close()
    return ""

@app.route('/info', methods=["POST"])
def info():
    # decode the token received as plain text
    token = request.data.decode("utf-8")  # read token as plain text

    if not token:
        print("Token is empty")
        return jsonify({"error": "Token is missing"}), 400

    print("Token is:", token)
    print('============')
    
    try:
        data = jwt.decode(token, key=secret, algorithms=['HS256'])
        print("Decoded data:", data)
        return jsonify(data)  # Directly return JSON object as JSON response
    except jwt.DecodeError:
        print("Invalid token.")
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print("An unexpected error occurred:", e)
        return jsonify({"error": "Server error"}), 500

#this commented out log works for logging in with unhashed passwords
# @app.route('/log', methods=["POST"])
# def findUser():
#     connection = Database.GetConnection()
#     verify = list(request.json.get('data').values())
#     cursor = connection.cursor()
#     cursor.execute('SELECT * FROM MGOLAN.USERTABLE WHERE (USERNAME = \''+ verify[0] +'\' AND HASHEDPASSWORD = \'' + verify[1] + '\')') #Had to be done slightly differently
#     results = cursor.fetchall()
#     if (len(results) == 1):
#         data = {
#             'id': results[0][0],
#             'user': results[0][1],
#             'mail': results[0][2],
#             'pass': results[0][3],
#             'first': results[0][4],
#             'last': results[0][5],
#             'bio': results[0][6],
#             'admin': results[0][7]
#         }
#         token = jwt.encode(payload=data, key=secret, algorithm='HS256')
#         print("Generated token:", token)  # Debugging: Ensure token is generated correctly
#         cursor.close()
#         connection.close()
#         return Response(token, mimetype='text/plain')  # Return token as plain text response
#     else:
#         cursor.close()
#         connection.close()
#         return jsonify({"error": "Invalid credentials"}), 401


@app.route('/log', methods=["POST"])
def findUser():
    connection = Database.GetConnection()
    verify = request.json.get('data')
    username = verify.get("Username")
    password = verify.get("Password")

    cursor = connection.cursor()
    cursor.execute('SELECT USERID, USERNAME, HASHEDPASSWORD, EMAIL, ADMIN, FIRSTNAME, LASTNAME, BIO FROM MGOLAN.USERTABLE WHERE USERNAME = :1', (username,))
    result = cursor.fetchone()

    if result:
        user_id, db_username, db_hashed_password, email, admin, first_name, last_name, bio = result
        # check if the entered password matches the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), db_hashed_password.encode('utf-8')):
            # Create a JWT token with user data if the password matches
            data = {
                'id': user_id,
                'user': db_username,
                'mail': email,
                'pass': db_hashed_password,  # avoid storing plain passwords
                'first': first_name,
                'last': last_name,
                'bio': bio,
                'admin': admin
            }
            token = jwt.encode(payload=data, key=secret, algorithm='HS256')
            cursor.close()
            connection.close()
            return Response(token, mimetype='text/plain')  # return token as plain text
        else:
            # unauthorized if the password does not match
            cursor.close()
            connection.close()
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        # user not found in the database
        cursor.close()
        connection.close()
        return jsonify({"error": "User not found"}), 404

@app.route('/res', methods=["GET"])
def getRes():
    connection = Database.GetConnection()
    cursor = connection.cursor()
    cursor.execute('''SELECT RESOURCENAME, WEBSITEURL, RESOURCECATEGORY, VOTES FROM MGOLAN.EDUCATIONALRESOURCES''')
    toReturn = cursor.fetchall();
    cursor.close()
    connection.close()
    return toReturn

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

@app.route('/test_db_connection', methods=['GET'])
def test_db_connection():
    try:
        Database.TestConnection()
        return jsonify({"status": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "failed", "error": str(e)}), 500    
    
@app.after_request
def set_cors_headers(response):
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response
    
if __name__ == "__main__":
    app.run(debug=True, port=8080)