from flask import Blueprint, jsonify, request
from google.oauth2 import id_token
from google.auth.transport import requests
from config import Config
from database import Database

users_bp = Blueprint('users', __name__)

@users_bp.route('/all', methods=['GET'])
def get_users():
    users = Database.select_query("SELECT UserName FROM UserTable")
    return jsonify(users)

@users_bp.route('/add', methods=['POST'])
def add_user():
    data = request.json
    try:
        Database.insert("UserTable", [data['user_id'], data['username'], data['email'], data['password'], data['first_name'], data['last_name'], data['bio'], data['status']])
        return jsonify({'status': 'success', 'message': 'User added successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@users_bp.route('/remove', methods=['POST'])
def remove_user():
    user_id = request.json.get('user_id')
    try:
        Database.delete("UserTable", f"UserID = '{user_id}'")
        return jsonify({'status': 'success', 'message': 'User removed successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@users_bp.route('/update', methods=['POST'])
def update_user():
    data = request.json
    try:
        set_values = {
            'UserName': data['username'],
            'FirstName': data['first_name'],
            'LastName': data['last_name'],
            'Bio': data['bio']
        }
        Database.update("UserTable", set_values, f"UserID = '{data['user_id']}'")
        return jsonify({'status': 'success', 'message': 'User updated successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@users_bp.route('/auth/google', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
       
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), Config.GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        
        user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name')

     
        return jsonify({'status': 'success', 'user_id': user_id, 'email': email, 'name': name})
    except ValueError:
        return jsonify({'status': 'error', 'message': 'Invalid token'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
