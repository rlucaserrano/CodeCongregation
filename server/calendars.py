from flask import jsonify, request
from database import Database
import uuid
from datetime import datetime



class Calendars:
    def __init__(self, data=None):
        self.data = data or {}

        self.valCalendarID = self.data.get("valCalendarID")
        self.valCalendarName = self.data.get("valCalendarName")
        self.valOwnerID = self.data.get("valOwnerID")

    def Methods(self, method):
        try:
            if method == "GET":
                return self.get_calendars()
            elif method == "POST":
                return self.add_calendar()
            elif method == "DELETE":
                return self.delete_calendar()
            elif method == "PATCH":
                return self.update_calendar()
            elif method == "OPTIONS":
                return jsonify({"Options": "GET, POST, DELETE, PATCH, OPTIONS"}), 200
            else:
                return jsonify({"ERROR": "Method not allowed"}), 405
        except Exception as e:
            print(f"Error in Calendars.Methods: {e}")
            return jsonify({"ERROR": "Internal server error"}), 500

    def Process(self):

        if self.valCalendarID and not isinstance(self.valCalendarID, str):
            return jsonify({"ERROR": "CalendarID must be a string"}), 400
        if self.valCalendarName and not isinstance(self.valCalendarName, str):
            return jsonify({"ERROR": "CalendarName must be a string"}), 400
        if self.valOwnerID and not isinstance(self.valOwnerID, str):
            return jsonify({"ERROR": "OwnerID must be a string"}), 400

    def get_calendars(self):
        try:
            user_id = request.args.get("userId")  
            if not user_id:
                return jsonify({"ERROR": "userId query parameter is required"}), 400

            owned_query = """
                SELECT CALENDARID, CALENDARNAME, OWNERID 
                FROM MGOLAN.CALENDARS 
                WHERE OWNERID = :1
            """
            owned_calendars = Database.SelectQuery(owned_query, [user_id])

            shared_query = """
                SELECT c.CALENDARID, c.CALENDARNAME, c.OWNERID, cp.ACCESS_LEVEL 
                FROM MGOLAN.CALENDARS c
                JOIN ALLIEMONTIAGUE.CALENDAR_PERMISSIONS cp ON c.CALENDARID = cp.CALENDARID
                WHERE cp.USERID = :1
            """
            shared_calendars = Database.SelectQuery(shared_query, [user_id])


            owned_calendars = [
                {"id": row[0], "name": row[1], "ownerId": row[2], "accessLevel": "OWNER"}
                for row in owned_calendars
            ]
            shared_calendars = [
                {"id": row[0], "name": row[1], "ownerId": row[2], "accessLevel": row[3]}
                for row in shared_calendars
            ]

            return jsonify({"calendars": owned_calendars + shared_calendars}), 200
        except Exception as e:
            print(f"Error fetching calendars: {e}")
            return jsonify({"ERROR": str(e)}), 500

    def add_calendar(self):
        try:
         
            if not (self.valCalendarName and self.valOwnerID):
                return jsonify({"ERROR": "Missing required fields"}), 400

            query_get_next_id = "SELECT NVL(MAX(CALENDARID), 0) + 1 FROM MGOLAN.CALENDARS"
   
            result = Database.SelectQuery(query_get_next_id)
            if not result:
                return jsonify({"ERROR": "Failed to generate CalendarID"}), 500
            calendar_id = result[0][0]  # Extract the next ID from the result

        
            print(f"Generated Sequential CalendarID: {calendar_id}")

         
            query_insert_calendar = '''
                INSERT INTO MGOLAN.CALENDARS (CALENDARID, CALENDARNAME, OWNERID)
                VALUES (:1, :2, :3)
            '''
            
            params = (calendar_id, self.valCalendarName, self.valOwnerID)

            success = Database.AddToDatabase(query_insert_calendar, params)
            if success:
                return jsonify({"SUCCESS": "Calendar added", "calendarID": calendar_id}), 201
            else:
                return jsonify({"ERROR": "Failed to add calendar to database"}), 500
        except Exception as e:
            print(f"Error adding calendar: {e}")
            return jsonify({"ERROR": str(e)}), 500



    def update_calendar(self):
        try:
         
            if not self.valCalendarID:
                return jsonify({"ERROR": "CalendarID is required"}), 400

           
            if not self.valCalendarName:
                return jsonify({"ERROR": "No fields to update"}), 400

           
            table = "MGOLAN.CALENDARS"
            key1 = "CALENDARID"
            value1 = self.valCalendarID
            changes = [("CALENDARNAME", f"'{self.valCalendarName}'")]

            success = Database.ModifyDatabase(table, key1, value1, changes)

            if success:
                return jsonify({"SUCCESS": "Calendar updated"}), 200
            else:
                return jsonify({"ERROR": "Failed to update calendar"}), 500
        except Exception as e:
            print(f"Error updating calendar: {e}")
            return jsonify({"ERROR": str(e)}), 500


    def delete_calendar(self):
        try:
           
            if not self.valCalendarID:
                return jsonify({"ERROR": "CalendarID is required"}), 400

        
            table = "MGOLAN.CALENDARS"
            key1 = "CALENDARID"
            value1 = self.valCalendarID

            success = Database.RemoveFromDatabase(table, key1, value1)

            if success:
                return jsonify({"SUCCESS": "Calendar deleted"}), 200
            else:
                return jsonify({"ERROR": "Failed to delete calendar"}), 500
        except Exception as e:
            print(f"Error deleting calendar: {e}")
            return jsonify({"ERROR": str(e)}), 500
    def share_calendar(self):
        try:
            calendar_id = self.data.get("calendarId")
            username = self.data.get("username")
            access_level = self.data.get("accessLevel")

            print(f"Incoming Data: calendarId={calendar_id}, username={username}, accessLevel={access_level}")

            if not (calendar_id and username and access_level):
                print("[ERROR] Missing required fields")
                return jsonify({"ERROR": "Missing required fields"}), 400

            if access_level not in ["READ", "WRITE", "MANAGE"]:
                return jsonify({"ERROR": "Invalid access level"}), 400

            # Resolve username to userId
            user_query = "SELECT USERID FROM MGOLAN.USERTABLE WHERE USERNAME = :1"
            user_result = Database.SelectQuery(user_query, [username])
            if not user_result:
                return jsonify({"ERROR": "Username not found"}), 404
            user_id = user_result[0][0]

            query = """
                INSERT INTO ALLIEMONTIAGUE.CALENDAR_PERMISSIONS (CALENDARID, USERID, ACCESS_LEVEL)
                VALUES (:1, :2, :3)
            """
            params = [calendar_id, user_id, access_level]
            Database.AddToDatabase(query, params)

            return jsonify({"SUCCESS": "Permission added"}), 201
        except Exception as e:
            print(f"Error sharing calendar: {e}")
            return jsonify({"ERROR": str(e)}), 500


    # def share_calendar(self):
    #     try:
    #         calendar_id = self.data.get("calendarId")
    #         user_id = self.data.get("userId")
    #         access_level = self.data.get("accessLevel")

    #         if not (calendar_id and user_id and access_level):
    #             return jsonify({"ERROR": "Missing required fields"}), 400

            
    #         if access_level not in ["READ", "WRITE", "MANAGE"]:
    #             return jsonify({"ERROR": "Invalid access level"}), 400

          
    #         query = """
    #             INSERT INTO ALLIEMONTIAGUE.CALENDAR_PERMISSIONS (CALENDARID, USERID, ACCESS_LEVEL)
    #             VALUES (:1, :2, :3)
    #         """
    #         params = [calendar_id, user_id, access_level]
    #         Database.AddToDatabase(query, params)

    #         return jsonify({"SUCCESS": "Permission added"}), 201
    #     except Exception as e:
    #         print(f"Error sharing calendar: {e}")
    #         return jsonify({"ERROR": str(e)}), 500        


class Events:
    def __init__(self, data=None):
        self.data = data or {}

        self.valEventID = self.data.get("valEventID")
        self.valCalendarID = self.data.get("valCalendarID")
        self.valEventName = self.data.get("valEventName")
        self.valEventDescription = self.data.get("valEventDescription")
        self.valStartDate = self.data.get("valStartDate")
        self.valEndDate = self.data.get("valEndDate")
        self.valStartTime = self.data.get("valStartTime")
        self.valEndTime = self.data.get("valEndTime")
        self.valStatus = self.data.get("valStatus")
        self.valFromGoogle = self.data.get("valFromGoogle", 0)
        self.valGoogleID = self.data.get("valGoogleID")
        self.valLastUpdate = datetime.now()

    def Process(self):
        pass

    def Methods(self, method):
        if method == "GET":
            return self.get_events()
        elif method == "POST":
            return self.add_event()
        elif method == "DELETE":
            return self.delete_event()
        elif method == "PATCH":
            return self.update_event()
        else:
            return jsonify({"ERROR": "Method not allowed"}), 405

    def get_events(self):
        try:
            calendar_id = request.args.get("calendarId")
            if not calendar_id:
                return jsonify({"ERROR": "calendarId query parameter is required"}), 400

            query = '''
                SELECT EVENTID, EVENTNAME, EVENTDESCRIPTION, 
                    TO_CHAR(STARTDATE, 'YYYY-MM-DD') AS STARTDATE,
                    TO_CHAR(ENDDATE, 'YYYY-MM-DD') AS ENDDATE,
                    TO_CHAR(STARTTIME, 'HH24:MI') AS STARTTIME,
                    TO_CHAR(ENDTIME, 'HH24:MI') AS ENDTIME
                FROM MGOLAN.EVENTS
                WHERE CALENDARID = :1
            '''
            params = [calendar_id]

            events = Database.SelectQuery(query, params)

            formatted_events = [
                {
                    "id": row[0],
                    "title": row[1],
                    "description": row[2],
                    "start": f"{row[3]}T{row[5]}",
                    "end": f"{row[4]}T{row[6]}"
                }
                for row in events
            ]

            return jsonify({"events": formatted_events}), 200
        except Exception as e:
            print(f"Error fetching events: {e}")
            return jsonify({"ERROR": str(e)}), 500

    def add_event(self):

        required_fields = [self.valCalendarID, self.valEventName, self.valStartDate, self.valStartTime, self.valEndDate, self.valEndTime]
        if not all(required_fields):
            return jsonify({"ERROR": "Missing required fields"}), 400

        try:
        
            print("CalendarID:", self.valCalendarID)
            print("EventName:", self.valEventName)
            print("EventDescription:", self.valEventDescription)
            print("StartDate:", self.valStartDate)
            print("EndDate:", self.valEndDate)
            print("StartTime:", self.valStartTime)
            print("EndTime:", self.valEndTime)
            print("GoogleID:", self.valGoogleID)

            start_datetime = f"{self.valStartDate} {self.valStartTime}"
            end_datetime = f"{self.valEndDate} {self.valEndTime}"
            if datetime.strptime(start_datetime, '%Y-%m-%d %H:%M') > datetime.strptime(end_datetime, '%Y-%m-%d %H:%M'):
                return jsonify({"ERROR": "End date and time must be after start date and time"}), 400

            event_id = str(uuid.uuid4())

            
            last_update_str = self.valLastUpdate.strftime('%Y-%m-%d %H:%M:%S')

        
            query = '''
                INSERT INTO MGOLAN.EVENTS (
                    EVENTID, CALENDARID, EVENTNAME, EVENTDESCRIPTION, 
                    STARTDATE, ENDDATE, STARTTIME, ENDTIME, STATUS, 
                    FROMGOOGLE, GOOGLEID, LASTUPDATE
                ) VALUES (
                    :1, :2, :3, :4, 
                    TO_DATE(:5, 'YYYY-MM-DD'), TO_DATE(:6, 'YYYY-MM-DD'), 
                    TO_TIMESTAMP(:7, 'HH24:MI'), TO_TIMESTAMP(:8, 'HH24:MI'), 
                    :9, :10, :11, TO_TIMESTAMP(:12, 'YYYY-MM-DD HH24:MI:SS')
                )
            '''

          
            params = (
                event_id,
                self.valCalendarID,
                self.valEventName,
                self.valEventDescription or '',  
                self.valStartDate,
                self.valEndDate,
                self.valStartTime,
                self.valEndTime,
                self.valStatus,
                self.valFromGoogle,
                self.valGoogleID or '',  
                last_update_str,  
            )

          
            print("Query Parameters:", params)

            Database.AddToDatabase(query, params)
            return jsonify({"SUCCESS": "Event added", "eventID": event_id}), 201
        except Exception as e:
            print(f"Error adding event: {e}")
            return jsonify({"ERROR": str(e)}), 500


    def update_event(self):
        try:
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
            if self.valGoogleID:
                changes.append(f"GOOGLEID = '{self.valGoogleID}'")

            last_update_str = self.valLastUpdate.strftime('%Y-%m-%d %H:%M:%S')
            changes.append(f"LASTUPDATE = TO_TIMESTAMP('{last_update_str}', 'YYYY-MM-DD HH24:MI:SS')")

            if not changes:
                return jsonify({"ERROR": "No fields to update"}), 400

           
            set_clause = ", ".join(changes)
            query = f"UPDATE MGOLAN.EVENTS SET {set_clause} WHERE EVENTID = '{self.valEventID}'"

            print(f"Executing query: {query}")
            Database.AlterQuery(query)  
            return jsonify({"SUCCESS": "Event updated"}), 200
        except Exception as e:
            print(f"Error updating event: {e}")
            return jsonify({"ERROR": str(e)}), 500



    def delete_event(self):
        try:
          
            if not self.valEventID:
                return jsonify({"ERROR": "EventID is required"}), 400

            table = "MGOLAN.EVENTS"
            key1 = "EVENTID"
            value1 = self.valEventID

        
            success = Database.RemoveFromDatabase(table, key1, value1)

            if success:
                return jsonify({"SUCCESS": "Event deleted"}), 200
            else:
                return jsonify({"ERROR": "Failed to delete event"}), 500
        except Exception as e:
            print(f"Error deleting event: {e}")
            return jsonify({"ERROR": str(e)}), 500

    def share_event(self):
        """
        Handles the sharing of an event with another user.
        """
        try:
            event_id = self.data.get("eventId")
            user_id = self.data.get("userId")
            access_level = self.data.get("accessLevel")

            if not (event_id and user_id and access_level):
                return jsonify({"ERROR": "Missing required fields"}), 400

            if access_level not in ["READ", "WRITE", "MANAGE"]:
                return jsonify({"ERROR": "Invalid access level"}), 400

            Events.AddEventPermission(event_id, user_id, access_level)

            return jsonify({"SUCCESS": "Permission added"}), 201
        except Exception as e:
            print(f"Error sharing event: {e}")
            return jsonify({"ERROR": str(e)}), 500
    @staticmethod
    def AddEventPermission(event_id, user_id, access_level):
        """
        Adds a sharing permission for an event.
        """
        query = """
            INSERT INTO ALLIEMONTIAGUE.EVENT_PERMISSIONS (EVENTID, USERID, ACCESS_LEVEL)
            VALUES (:1, :2, :3)
        """
        params = [event_id, user_id, access_level]
        try:
            Database.AddToDatabase(query, params)
        except Exception as e:
            print(f"Error adding event permission: {e}")
            raise

