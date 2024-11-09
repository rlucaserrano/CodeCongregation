# tests/test_main.py

import unittest
import json
from main import app, secret
from database import Database
from unittest.mock import patch, MagicMock
import jwt
import bcrypt
from unittest.mock import patch
from flask import Response

class MainAppTestCase(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app.testing = True

        # Set up any necessary test data here
        # For example, you can create test users in the database

    def tearDown(self):
        # Clean up after each test
        pass

    def test_login_success(self):
        username = 'testuser'
        password = 'testpassword'
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = (
                1,  # USERID
                username,  # USERNAME
                hashed_password,  # HASHEDPASSWORD
                'test@example.com',  # EMAIL
                0,  # ADMIN
                'Test',  # FIRSTNAME
                'User',  # LASTNAME
                'Test bio'  # BIO
            )

            response = self.app.post('/log', json={
                'data': {
                    'Username': username,
                    'Password': password
                }
            })

            self.assertEqual(response.status_code, 200)

            token = response.data.decode('utf-8')
            self.assertTrue(token)

            decoded_data = jwt.decode(token, key=secret, algorithms=['HS256'])
            self.assertEqual(decoded_data['user'], username)

    def test_login_invalid_credentials(self):
        # Mock data
        username = 'testuser'
        password = 'wrongpassword'

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = (
                1,  # USERID
                username,  # USERNAME
                bcrypt.hashpw('correctpassword'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  # HASHEDPASSWORD
                'test@example.com',  # EMAIL
                0,  # ADMIN
                'Test',  # FIRSTNAME
                'User',  # LASTNAME
                'Test bio'  # BIO
            )

            response = self.app.post('/log', json={
                'data': {
                    'Username': username,
                    'Password': password
                }
            })

            self.assertEqual(response.status_code, 401)

            data = response.get_json()
            self.assertEqual(data['error'], 'Invalid credentials')

    def test_login_user_not_found(self):
        username = 'nonexistentuser'
        password = 'any_password'

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor
            # No user found
            mock_cursor.fetchone.return_value = None

            response = self.app.post('/log', json={
                'data': {
                    'Username': username,
                    'Password': password
                }
            })

            self.assertEqual(response.status_code, 404)

            data = response.get_json()
            self.assertEqual(data['error'], 'User not found')

    def test_info_valid_token(self):
        # Mock user data
        user_data = {
            'id': 1,
            'user': 'testuser',
            'mail': 'test@example.com',
            'pass': 'hashed_password',
            'first': 'Test',
            'last': 'User',
            'bio': 'Test bio',
            'admin': 0
        }
        token = jwt.encode(payload=user_data, key=secret, algorithm='HS256')

        response = self.app.post('/info', data=token, content_type='text/plain')

        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertEqual(data['user'], 'testuser')

    def test_info_invalid_token(self):
        token = 'invalid_token'

        response = self.app.post('/info', data=token, content_type='text/plain')

        self.assertEqual(response.status_code, 401)

        data = response.get_json()
        self.assertEqual(data['error'], 'Invalid token')

    def test_add_user(self):
        new_user = {
            'data': {
                'username': 'newuser',
                'hashedPassword': 'newpassword',
                'email': 'newuser@example.com',
                'admin': 0,
                'firstName': 'New',
                'lastName': 'User'
            }
        }

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor

            response = self.app.post('/add', json=new_user)

            self.assertEqual(response.status_code, 200)

            data = response.get_json()
            self.assertEqual(data['SUCCESS'], 'User added')

            args, kwargs = mock_cursor.execute.call_args
            inserted_password = args[1][1]
            self.assertTrue(bcrypt.checkpw(new_user['data']['hashedPassword'].encode('utf-8'), inserted_password.encode('utf-8')))

    def test_update_user(self):
        update_data = {
            'valUserID': 1,
            'valUserName': 'updateduser',
            'valEmail': 'updated@example.com',
            'valFirstName': 'Updated',
            'valLastName': 'User',
            'valBio': 'Updated bio'
        }

        # Mock the database connection and cursor
        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor

            response = self.app.patch('/update_user', json=update_data)

            self.assertEqual(response.status_code, 200)

            data = response.get_json()
            self.assertEqual(data['SUCCESS'], 'User updated successfully')

    def test_update_user_no_user_id(self):
        update_data = {
            'valUserName': 'updateduser'
        }

        response = self.app.patch('/update_user', json=update_data)

        self.assertEqual(response.status_code, 400)

        data = response.get_json()
        self.assertEqual(data['ERROR'], 'UserID is required for updating user')

    def test_add_group(self):
        new_group = {
            'data': {
                '0': 'group_id',
                '1': 'Group Name',
                '2': 'calendar_id',
                '3': 0,
                '4': 'Group Bio'
            }
        }

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor

            response = self.app.post('/addgroup', json=new_group)

            self.assertEqual(response.status_code, 200)

    def test_add_member(self):
        new_member = {
            'data': {
                '0': 'group_id',
                '1': 'user_id',
                '2': 1,
                '3': 1
            }
        }

        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor

            response = self.app.post('/addmem', json=new_member)

            self.assertEqual(response.status_code, 200)

    def test_find_group(self):
       
        user_id = 'user123'

        
        with patch('main.Database.GetConnection') as mock_db_conn:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_db_conn.return_value = mock_conn
            mock_conn.cursor.return_value = mock_cursor

            # Mock group IDs
            mock_cursor.fetchall.side_effect = [
                [('group1',)], 
                [[('Group Name', 'Group Bio', 'group1')]],  
            ]

            response = self.app.post('/groups', data=user_id)

            self.assertEqual(response.status_code, 200)

    def test_access_educational_resources(self):
        resources_data = {
        }

        with patch('main.EducationalResources') as mock_resources:
            mock_instance = mock_resources.return_value
            mock_instance.Process.return_value = None
            mock_instance.Methods.return_value = ('Success', 200)

            response = self.app.get('/educationalresources', json=resources_data)

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), 'Success')

    @patch('main.id_token.verify_oauth2_token')
    def test_google_login_success(self, mock_verify):
        mock_verify.return_value = {
            'iss': 'accounts.google.com',
            'sub': 'google_user_id',
            'email': 'user@example.com',
            'name': 'Google User'
        }

        response = self.app.post('/api/auth/google', json={'token': 'valid_token'})

        self.assertEqual(response.status_code, 200)

        data = response.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['email'], 'user@example.com')

    @patch('main.id_token.verify_oauth2_token')
    def test_google_login_invalid_token(self, mock_verify):
        mock_verify.side_effect = ValueError('Invalid token')

        response = self.app.post('/api/auth/google', json={'token': 'invalid_token'})

        self.assertEqual(response.status_code, 400)

        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Invalid token')

    def test_test_db_connection(self):

        with patch('main.Database.TestConnection') as mock_test_conn:
            mock_test_conn.return_value = None  

            
            response = self.app.get('/test_db_connection')

           
            self.assertEqual(response.status_code, 200)

            
            data = response.get_json()
            self.assertEqual(data['status'], 'connected')

    def test_cors_headers(self):
       
        response = self.app.get('/')

        
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5173')
        self.assertEqual(response.headers.get('Access-Control-Allow-Credentials'), 'true')

if __name__ == '__main__':
    unittest.main()
