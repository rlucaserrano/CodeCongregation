import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from calendars import calendars_bp
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class CalendarsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(calendars_bp)
        self.client = self.app.test_client()
        self.app.testing = True

    def tearDown(self):
        pass

    @patch('calendars.google_credentials.Credentials')
    @patch('calendars.build')
    def test_build_calendar_service_success(self, mock_build, mock_credentials):

        mock_creds = MagicMock()
        mock_credentials.return_value = mock_creds

        mock_service = MagicMock()
        mock_build.return_value = mock_service

        from calendars import build_calendar_service
        service = build_calendar_service('fake_token')

        mock_credentials.assert_called_with('fake_token')
        mock_build.assert_called_with('calendar', 'v3', credentials=mock_creds)
        self.assertEqual(service, mock_service)

    @patch('calendars.google_credentials.Credentials')
    @patch('calendars.build')
    def test_build_calendar_service_failure(self, mock_build, mock_credentials):

        mock_credentials.side_effect = Exception('Invalid token')

        from calendars import build_calendar_service
        service = build_calendar_service('invalid_token')

        mock_credentials.assert_called_with('invalid_token')
        self.assertIsNone(service)

    @patch('calendars.build_calendar_service')
    def test_create_calendar_success(self, mock_build_service):

        mock_service = MagicMock()
        mock_calendars = mock_service.calendars()
        mock_insert = mock_calendars.insert()
        mock_insert.execute.return_value = {'id': 'new_calendar_id'}
        mock_calendars.insert.return_value = mock_insert
        mock_service.calendars.return_value = mock_calendars
        mock_build_service.return_value = mock_service

        response = self.client.post('/create', json={'token': 'valid_token'})

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['calendarId'], 'new_calendar_id')

    @patch('calendars.build_calendar_service')
    def test_create_calendar_missing_token(self, mock_build_service):
        response = self.client.post('/create', json={})
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Token missing')

    @patch('calendars.build_calendar_service')
    def test_create_calendar_service_failure(self, mock_build_service):

        mock_build_service.return_value = None

        response = self.client.post('/create', json={'token': 'valid_token'})
        self.assertEqual(response.status_code, 500)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Failed to initialize Google Calendar service')

    @patch('calendars.build_calendar_service')
    def test_create_calendar_exception(self, mock_build_service):

        mock_service = MagicMock()
        mock_calendars = mock_service.calendars()
        mock_insert = mock_calendars.insert()
        mock_insert.execute.side_effect = Exception('API error')
        mock_calendars.insert.return_value = mock_insert
        mock_service.calendars.return_value = mock_calendars
        mock_build_service.return_value = mock_service

        response = self.client.post('/create', json={'token': 'valid_token'})
        self.assertEqual(response.status_code, 500)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'API error')

    @patch('calendars.build_calendar_service')
    def test_get_calendar_events_success(self, mock_build_service):

        mock_service = MagicMock()
        mock_events = mock_service.events()
        mock_list = mock_events.list()
        mock_list.execute.return_value = {'items': [{'id': 'event1'}, {'id': 'event2'}]}
        mock_events.list.return_value = mock_list
        mock_service.events.return_value = mock_events
        mock_build_service.return_value = mock_service

        response = self.client.get('/events', query_string={'token': 'valid_token'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data, [{'id': 'event1'}, {'id': 'event2'}])

    @patch('calendars.build_calendar_service')
    def test_get_calendar_events_missing_token(self, mock_build_service):
        response = self.client.get('/events')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Token missing')

    @patch('calendars.build_calendar_service')
    def test_get_calendar_events_service_failure(self, mock_build_service):

        mock_build_service.return_value = None

        response = self.client.get('/events', query_string={'token': 'valid_token'})
        self.assertEqual(response.status_code, 500)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Failed to initialize Google Calendar service')

    @patch('calendars.build_calendar_service')
    def test_get_calendar_events_exception(self, mock_build_service):

        mock_service = MagicMock()
        mock_events = mock_service.events()
        mock_list = mock_events.list()
        mock_list.execute.side_effect = Exception('API error')
        mock_events.list.return_value = mock_list
        mock_service.events.return_value = mock_events
        mock_build_service.return_value = mock_service

        response = self.client.get('/events', query_string={'token': 'valid_token'})
        self.assertEqual(response.status_code, 500)
        data = response.get_json()
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'API error')

if __name__ == '__main__':
    unittest.main()
