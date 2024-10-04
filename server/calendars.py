from flask import Blueprint, jsonify, request
from google.oauth2 import credentials as google_credentials
from googleapiclient.discovery import build

calendars_bp = Blueprint('calendars', __name__)

def build_calendar_service(token):
    try:
        creds = google_credentials.Credentials(token)
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building Google Calendar service: {e}")
        return None

# route to create new calendar
@calendars_bp.route('/create', methods=['POST'])
def create_calendar():
    token = request.json.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Token missing'}), 400

    try:
        service = build_calendar_service(token)
        if service is None:
            return jsonify({'status': 'error', 'message': 'Failed to initialize Google Calendar service'}), 500
        
        calendar = {
            'summary': 'My App Calendar',
            'timeZone': 'America/New_York'
        }
        
        created_calendar = service.calendars().insert(body=calendar).execute()
        return jsonify({'status': 'success', 'calendarId': created_calendar['id']})
    
    except Exception as e:
        print(f"Error creating calendar: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# route to fetch events from calendar
@calendars_bp.route('/events', methods=['GET'])
def get_calendar_events():
    token = request.args.get('token')
    if not token:
        return jsonify({'status': 'error', 'message': 'Token missing'}), 400

    try:
        service = build_calendar_service(token)
        if service is None:
            return jsonify({'status': 'error', 'message': 'Failed to initialize Google Calendar service'}), 500

        #fetch personal calendar events (read-only)
        events_result = service.events().list(
            calendarId='primary',  # personal calendar of the logged-in user
            singleEvents=True,
            orderBy='startTime'
        ).execute()

        events = events_result.get('items', [])
        return jsonify(events)
    
    except Exception as e:
        print(f"Error fetching events: {e}")  # debug stuff
        return jsonify({'status': 'error', 'message': str(e)}), 500
