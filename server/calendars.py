from flask import Blueprint, jsonify, request
from google.oauth2 import credentials as google_credentials
from googleapiclient.discovery import build

from flask import jsonify
from database import Database
import uuid


class Calendars:
    def __init__(self, data=None):
        if data is None:
            data = {}

        self.valEventID = data.get("valEventID")
        self.valCalendarID = data.get("valCalendarID")
        self.valEventName = data.get("valEventName")
        self.valEventDescription = data.get("valEventDescription")
        self.valStartDate = data.get("valStartDate")
        self.valEndDate = data.get("valEndDate")
        self.valStartTime = data.get("valStartTime")
        self.valEndTime = data.get("valEndTime")
        self.valStatus = data.get("valStatus")
        self.valOwnerID = data.get("valOwnerID")
        self.valFromGoogle = data.get("valFromGoogle", 0)
        self.valCalendarName = data.get("valCalendarName")

    def get_events(self):
        try:
            query = f"SELECT * FROM MGOLAN.EVENTS WHERE CALENDARID = {self.valCalendarID}"
            events = Database.SearchDatabase(query)
            return jsonify({"events": events}), 200
        except Exception as e:
            return jsonify({"ERROR": str(e)}), 500

    def add_event(self):
        # validate required fields
        if not (self.valCalendarID and self.valEventName and self.valStartDate and self.valStartTime and self.valEndDate and self.valEndTime):
            return jsonify({"ERROR": "Missing required fields"}), 400

        try:
            event_id = str(uuid.uuid4())

            # Convert string inputs to the correct data types
            calendar_id = (self.valCalendarID)
            start_date = self.valStartDate  # 
            end_date = self.valEndDate 
            start_time = self.valStartTime  
            end_time = self.valEndTime 
            status = (self.valStatus)
            from_google = (self.valFromGoogle)

            # Build the query
            query = '''
            INSERT INTO MGOLAN.EVENTS (EVENTID, CALENDARID, EVENTNAME, EVENTDESCRIPTION, STARTDATE, ENDDATE, STARTTIME, ENDTIME, STATUS, FROMGOOGLE)
            VALUES (:1, :2, :3, :4, TO_DATE(:5, 'YYYY-MM-DD'), TO_DATE(:6, 'YYYY-MM-DD'), TO_TIMESTAMP(:7, 'HH24:MI'), TO_TIMESTAMP(:8, 'HH24:MI'), :9, :10)
             '''
            params = (event_id, calendar_id, self.valEventName, self.valEventDescription, start_date, end_date, start_time, end_time, status, from_google)


            # Execute the query
            Database.AddToDatabase(query, params)
            connection = Database.GetConnection()  # Ensure this function is correctly implemented
            cursor = connection.cursor()

            cursor.execute(query, params)  # Execute the SQL command with parameters
            connection.commit()  # Save the changes to the database

            cursor.close()  # Close the cursor
            connection.close()  # Close the connection
            return jsonify({"SUCCESS": "Event added","eventID": event_id}), 200

        except ValueError as ve:
            print(f"ValueError: {ve}")
            return jsonify({"ERROR": f"Invalid input data: {ve}"}), 400
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"ERROR": str(e)}), 500


    def update_event(self):
        if not self.valEventID:
            return jsonify({"ERROR": "EventID is required"}), 400

        changes = []
        if self.valEventName:
            changes.append(f"EVENTNAME = '{self.valEventName}'")
        if self.valEventDescription:
            changes.append(f"EVENTDESCRIPTION = '{self.valEventDescription}'")
        if self.valStartDate:
            changes.append(f"STARTDATE = TO_DATE('{self.valStartDate}', 'YYYY-MM-DD')")
        if self.valEndDate:
            changes.append(f"ENDDATE = TO_DATE('{self.valEndDate}', 'YYYY-MM-DD')")
        if self.valStartTime:
            changes.append(f"STARTTIME = TO_TIMESTAMP('{self.valStartTime}', 'HH24:MI')")
        if self.valEndTime:
            changes.append(f"ENDTIME = TO_TIMESTAMP('{self.valEndTime}', 'HH24:MI')")
        if self.valStatus is not None:
            changes.append(f"STATUS = {self.valStatus}")

        if not changes:
            return jsonify({"ERROR": "No fields to update"}), 400

        query = f"UPDATE MGOLAN.EVENTS SET {', '.join(changes)} WHERE EVENTID = {self.valEventID}"
        try:
            Database.ModifyDatabase(query)
            return jsonify({"SUCCESS": "Event updated"}), 200
        except Exception as e:
            return jsonify({"ERROR": str(e)}), 500

    def delete_event(self):
        if not self.valEventID:
            return jsonify({"ERROR": "EventID is required"}), 400

        try:
            query = f"DELETE FROM MGOLAN.EVENTS WHERE EVENTID = {self.valEventID}"
            Database.RemoveFromDatabase(query)
            return jsonify({"SUCCESS": "Event deleted"}), 200
        except Exception as e:
            return jsonify({"ERROR": str(e)}), 500

    def get_calendars(self):
        try:
            # userId as ownerId
            owner_id = request.args.get('ownerId')
            if not owner_id:
                print("Missing ownerId in query parameters")
                return jsonify({"ERROR": "ownerId query parameter is required"}), 400

            # Log  owner_id for debugging
            print(f"Fetching calendars for ownerId (userId): {owner_id}")

            # query 2 fetch calendars for  user
            query = "SELECT * FROM MGOLAN.CALENDARS WHERE OWNERID = :1"
            calendars = Database.SearchDatabase(query, [owner_id])

            #  data is JSON 
            print(f"Retrieved calendars: {calendars}")
            return jsonify({"calendars": calendars}), 200
        except Exception as e:
            print(f"Error in /calendars: {e}")
            return jsonify({"ERROR": "Internal Server Error"}), 500
    def add_calendar(self):
        if not self.valOwnerID or not hasattr(self, "valCalendarName"):
            return jsonify({"ERROR": "Missing required fields"}), 400

        try:
            calendar_id = str(uuid.uuid4())  # generate unique cal ID

            # build query
            query = '''
                INSERT INTO MGOLAN.CALENDARS (CALENDARID, CALENDARNAME, OWNERID)
                VALUES (:1, :2, :3)
            '''
            params = (calendar_id, self.valCalendarName, self.valOwnerID)

            # execute query
            Database.AddToDatabase(query, params)
            return jsonify({"SUCCESS": "Calendar added", "calendarID": calendar_id}), 201

        except Exception as e:
            print(f"Error adding calendar: {e}")
            return jsonify({"ERROR": str(e)}), 500
    def create_default_calendars(self, owner_id):
        try:
            # generate unique IDs for cals
            personal_calendar_id = str(uuid.uuid4())
            task_calendar_id = str(uuid.uuid4())

            # define queries for both cals
            queries = [
                (
                    '''INSERT INTO MGOLAN.CALENDARS (CALENDARID, CALENDARNAME, OWNERID)
                    VALUES (:1, :2, :3)''',
                    (personal_calendar_id, "Personal Calendar", owner_id),
                ),
                (
                    '''INSERT INTO MGOLAN.CALENDARS (CALENDARID, CALENDARNAME, OWNERID)
                    VALUES (:1, :2, :3)''',
                    (task_calendar_id, "Task", owner_id),
                ),
            ]

            # execute queries
            connection = Database.GetConnection()
            cursor = connection.cursor()
            for query, params in queries:
                cursor.execute(query, params)
            connection.commit()

            # close resources
            cursor.close()
            connection.close()

            # return IDs of the created calendars
            return {"personalCalendarID": personal_calendar_id, "taskCalendarID": task_calendar_id}
        except Exception as e:
            print(f"Error creating default calendars: {e}")
            return {"ERROR": str(e)}

            
