from flask import jsonify
from database import Database
from google_email import Email
from proc_and_sec import ProcAndSec

class StudyGroups:

    def __init__(self, data=None):
        
        # Assigns variables with json data (if available) or default values.
        self.valGroupID = data.get("valGroupID", None)
        self.valGroupName = data.get("valGroupName", None)
        self.valGroupCalendarID = data.get("valGroupCalendarID", None)
        self.valPermanence = data.get("valPermanence", None)
        self.valExpiration = data.get("valExpiration", None)
        self.valGroupBio = data.get("valGroupBio", None)
        self.colGroupID = data.get("colGroupID", None)
        self.colGroupName = data.get("colGroupName", None)
        self.colGroupCalendarID = data.get("colGroupCalendarID", None)
        self.colPermanence = data.get("colPermanence", None)
        self.colExpiration = data.get("colExpiration", None)
        self.colGroupBio = data.get("colGroupBio", None)
        self.order = data.get("Order", None)
        self.distinct = data.get("Distinct", None)

    def Methods(self, method):
        
        # Internal function calls.
        if method == "POST":
            return self.AddStudyGroup()
        else:
            # Catchall error response
            return jsonify({"ERROR": "Invalid method selection"}), 405
 
    def AddStudyGroup(self):
        
        if (self.colGroupID is not None or self.colGroupName is not None or self.colGroupCalendarID is not None or self.colPermanence is not None or self.colExpiration is not None or self.colGroupBio is not None):
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        elif (self.valGroupID is None) or (self.valGroupName is None) or (self.valGroupCalendarID is None) or (self.valPermanence is None):
            return jsonify({"ERROR": "POST method requires GroupID, GroupName, Email, GroupCalendarID, Permanence parameters"}), 400
        elif len(Database.SearchDatabase(table="StudyGroups", rows=f"GroupID = '{self.valGroupID}'")) > 0:
            return jsonify({"ERROR": "GroupID already in use"}), 409  
        else: # Proprocesses inputs and attempts to insert into the database.
            if self.valExpiration is not None:
                self.valExpiration = f"'{self.valExpiration}'"
            else:
                self.valExpiration = "NULL"
            if self.valGroupBio is not None:
                self.valGroupBio = f"'{self.valGroupBio}'"
            else:
                self.valGroupBio = "NULL"

            result = Database.AddToDatabase(table = "StudyGroups", entry = [f"{self.valGroupID}", f"'{self.valGroupName}'", f"'{self.valGroupCalendarID}'", f"'{self.valPermanence}'", self.valExpiration, self.valGroupBio])
            if result == True:
                return jsonify({"SUCCESS": "Study group added"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
