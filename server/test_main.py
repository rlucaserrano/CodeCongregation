import unittest
from unittest.mock import patch, MagicMock
import json
from main import app

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        # Set up the test client
        self.app = app.test_client()
        self.app.testing = True

    def test_default_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode('utf-8'), 'Flask API')

    @patch('main.Database')
    def test_add_user(self, mock_database):
        # Mock the database connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_database.GetConnection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor

        data = {
            'data': ['user_id', 'username', 'hashed_password', 'email', 'admin']
        }
        response = self.app.post('/add', json=data)
        self.assertEqual(response.status_code, 200)

        # Assert that database methods were called
        mock_conn.cursor.assert_called_once()
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()
        mock_conn.close.assert_called_once()

    @patch('main.Database')
    def test_get_resources(self, mock_database):
        # Mock the database connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_database.GetConnection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            ('Resource1', 'http://example.com', 'Category1', 10),
            ('Resource2', 'http://example.org', 'Category2', 5)
        ]

        response = self.app.get('/res')
        self.assertEqual(response.status_code, 200)
        expected_response = [
            ('Resource1', 'http://example.com', 'Category1', 10),
            ('Resource2', 'http://example.org', 'Category2', 5)
        ]
        self.assertEqual(json.loads(response.data), expected_response)

    @patch('main.id_token.verify_oauth2_token')
    def test_google_login_success(self, mock_verify_token):
        mock_verify_token.return_value = {
            'iss': 'accounts.google.com',
            'sub': '1234567890',
            'email': 'user@example.com',
            'name': 'Test User'
        }
        data = {'token': 'valid_token'}
        response = self.app.post('/api/auth/google', json=data)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['status'], 'success')
        self.assertEqual(response_data['user_id'], '1234567890')

    @patch('main.id_token.verify_oauth2_token')
    def test_google_login_invalid_token(self, mock_verify_token):
        mock_verify_token.side_effect = ValueError('Invalid token')
        data = {'token': 'invalid_token'}
        response = self.app.post('/api/auth/google', json=data)
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.data)
        self.assertEqual(response_data['status'], 'error')
        self.assertEqual(response_data['message'], 'Invalid token')

    def test_dev2_route(self):
        response = self.app.get('/api/dev2')
        self.assertEqual(response.status_code, 200)
        expected_response = {
            "dev2": [
                'helloworld',
                'helloworld2',
                'helloworld3'
            ]
        }
        self.assertEqual(json.loads(response.data), expected_response)

    # Add more tests for other routes and methods as needed

if __name__ == '__main__':
    unittest.main()
