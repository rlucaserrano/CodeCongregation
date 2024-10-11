from flask import jsonify
from database import Database
from proc_and_sec import ProcAndSec

class EducationalResources:

    def __init__(self, data=None):
        
        # Assigns variables with json data (if available) or default values.
        self.valResourceID = data.get("valResourceID", None)
        self.valResourceName = data.get("valResourceName", None)
        self.valWebsiteURL = data.get("valWebsiteURL", None)
        self.valResourceCategory = data.get("valResourceCategory", None)
        self.valResourceDescription = data.get("valDescription", None)
        self.valPublished = data.get("valPublished", None)
        self.valDateAdded = data.get("valDateAdded", None)
        self.valVotes = data.get("valVotes", None)
        self.colResourceID = data.get("colResourceID", None)
        self.colResourceName = data.get("colResourceName", None)
        self.colWebsiteURL = data.get("colWebsiteURL", None)
        self.colResourceCategory = data.get("colResourceCategory", None)
        self.colResourceDescription = data.get("colDescription", None)
        self.colPublished = data.get("colPublished", None)
        self.colDateAdded = data.get("colDateAdded", None)
        self.colVotes = data.get("colVotes", None)
        self.order = data.get("Order", None)
        self.distinct = data.get("Distinct", None)

    def Methods(self, method):
        
        # Internal function calls.

        if method == "GET":
            return self.GetResource()
        elif method == "POST":
            return self.AddResource()
        elif method == "DELETE":
            return self.DeleteResource()
        elif method == "PATCH":
            return self.UpdateResource()
        elif method == "OPTIONS":
            # Retrieves viable methods
            return jsonify({"Options": "GET, POST, DELETE, OPTIONS"}), 200
        else:
            # Catchall error response
            return jsonify({"ERROR": "Invalid method selection"}), 405
    
    def Process(self):
        if self.valResourceID is not None:
            if not ProcAndSec.CheckValidString(self.valResourceID):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valResourceName is not None:
            if not ProcAndSec.CheckValidString(self.valResourceName):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valResourceCategory is not None:
            if not ProcAndSec.CheckValidString(self.valResourceCategory):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valResourceDescription is not None:
            if not ProcAndSec.CheckValidString(self.valResourceDescription):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valPublished is not None:
            if not ProcAndSec.CheckValidString(self.valPublished):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valDateAdded is not None:
            if not ProcAndSec.CheckValidString(self.valDateAdded):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valVotes is not None:
            if not ProcAndSec.CheckValidString(self.valVotes):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.order is not None:
            if not ProcAndSec.CheckValidString(self.order):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.distinct is not None:
            if not ProcAndSec.CheckValidString(self.distinct):
                return jsonify({"ERROR": "Invalid characters in string"}), 409

    def GetResource(self):

        if self.valResourceDescription is not None or self.valDateAdded is not None:
            return jsonify({"ERROR": "GET method does not accept parameters for ResourceDescription and DateAdded"}), 400
        columns = [] # Populates columns
        if self.colResourceID is not None:
            columns.append("ResourceID")
        if self.colResourceName is not None:
            columns.append("ResourceName")
        if self.colWebsiteURL is not None:
            columns.append("WebsiteURL")
        if self.colResourceCategory is not None:
            columns.append("ResourceCategory")
        if self.colResourceDescription is not None:
            columns.append("ResourceDescription")
        if self.colPublished is not None:
            columns.append("Published") 
        if self.colDateAdded is not None:
            columns.append("DateAdded")
        if self.colVotes is not None:
            columns.append("Votes")    
        rowString = "" # Creates rowString for use by query constructor.
        alreadyAdded = False;
        if self.valResourceID is not None:
            rowString = rowString + f"ResourceID = '{self.valResourceID}'"
            alreadyAdded = True
        if self.valResourceName is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND ResourceName = '{self.valResourceName}'"
            else:
                rowString = rowString + f"ResourceName = '{self.valResourceName}'"
                alreadyAdded = True
        if self.valWebsiteURL is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND WebsiteURL = '{self.valWebsiteURL}'"
            else:
                rowString = rowString + f"WebsiteURL = '{self.valWebsiteURL}'"
                alreadyAdded = True
        if self.valResourceCategory is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND ResourceCategory = '{self.valResourceCategory}'"
            else:
                rowString = rowString + f"ResourceCategory = '{self.valResourceCategory}'"
                alreadyAdded = True
        if self.valPublished is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Published = '{self.valPublished}'"
            else:
                rowString = rowString + f"Published = '{self.valPublished}'"
                alreadyAdded = True
        if self.valVotes is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Votes = '{self.valVotes}'"
            else:
                rowString = rowString + f"Votes = '{self.valVotes}'"
                alreadyAdded = True
        if alreadyAdded == True:
            return jsonify(Database.SearchDatabase(table = "EducationalResources", columns=columns, rows=rowString, order=self.order, distinct=self.distinct)), 200
        else:
            return jsonify(Database.SearchDatabase(table = "EducationalResources", columns=columns, order=self.order, distinct=self.distinct)), 200

    def AddResource(self):
        
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        elif (self.valResourceID is None) or (self.valResourceName is None) or (self.valWebsiteURL is None) or (self.valResourceCategory is None) or (self.valPublished is None) or (self.valDateAdded is None) or (self.valVotes is None):
            return jsonify({"ERROR": "POST method requires ResourceID, ResourceName, WebsiteURL, ResourceCategory, Published, DateAdded, and Votes parameters"}), 400
        elif len(Database.SearchDatabase(table="EducationalResources", rows=f"ResourceID = '{self.valResourceID}'")) > 0:
            return jsonify({"ERROR": "ResourceID already in use"}), 409
        elif len(Database.SearchDatabase(table="EducationalResources", rows=f"ResourceName = '{self.valResourceName}'")) > 0:
            return jsonify({"ERROR": "ResourceName already in use"}), 409
        elif len(Database.SearchDatabase(table="EducationalResources", rows=f"WebsiteURL = '{self.valWebsiteURL}'")) > 0:
            return jsonify({"ERROR": "WebsiteURL already in use"}), 409 
        else: # Proprocesses inputs and attempts to insert into the database.
            if self.valResourceDescription is not None:
                self.valResourceDescription = f"'{self.valResourceDescription}'"
            else:
                self.valResourceDescription = "NULL"
            # Checks for valid url format
            if not ProcAndSec.CheckWebsiteURLFormat(self.valWebsiteURL):
                return jsonify({"ERROR": "Invalid Website URL format"}), 409
            result = Database.AddToDatabase(table = "EducationalResources", entry = [f"{self.valResourceID}", f"'{self.valResourceName}'", f"'{self.valWebsiteURL}'", f"'{self.valResourceCategory}'", self.valResourceDescription, f"{self.valPublished}", f"{self.valDateAdded}", f"{self.valVotes}"])
            if result == True:
                return jsonify({"SUCCESS": "Resource added"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
    
    def DeleteResource(self):
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "DELETE method does not take column parameters"}), 400
        if self.valResourceName is not None or self.valWebsiteURL is not None or self.valResourceCategory is not None or self.valResourceDescription is not None or self.valPublished is not None or self.valDateAdded is not None or self.valVotes is not None or self.order is not None:
            return jsonify({"ERROR": "DELETE method only accepts ResourceID parameter"}), 400
        if self.valResourceID is None:
            return jsonify({"ERROR": "DELETE method requires ResourceID parameter"}), 400
        elif len(Database.SearchDatabase(table="EducationalResources", rows=f"ResourceID = '{self.valResourceID}'")) <= 0:
            return jsonify({"ERROR": "Resource does not exist"}), 404
        else:
            Database.RemoveFromDatabase("EducationalResources", "ResourceID", self.valResourceID)
            return jsonify({"SUCCESS": "Resource deleted"}), 200

    def UpdateResource(self):
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "PATCH method does not take column parameters"}), 400
        if self.valResourceID is None:
            return jsonify({"ERROR": "PATCH method requires ResourceID parameter"}), 400
        changes = []
        if self.valResourceName is not None:
            if len(Database.SearchDatabase(table="EducationalResources", rows=f"ResourceName = '{self.valResourceName}'")) > 0:
                return jsonify({"ERROR": "ResourceName already in use"}), 409
            changes.append(("ResourceName", f"'{self.valResourceName}'"))
        if self.valWebsiteURL is not None:
            if len(Database.SearchDatabase(table="EducationalResources", rows=f"WebsiteURL = '{self.valWebsiteURL}'")) > 0:
                return jsonify({"ERROR": "WebsiteURL already in use"}), 409
            changes.append(("WebsiteURL", f"'{self.valWebsiteURL}'"))
        if self.valResourceCategory is not None:
            changes.append(("ResourceCategory", f"'{self.valResourceCategory}'")) 
        if self.valResourceDescription is not None:
            changes.append(("ResourceDescription", f"'{self.valResourceDescription}'")) 
        if self.valPublished is not None:
            changes.append(("Published", f"'{self.valPublished}'"))
        if self.valDateAdded is not None:
            changes.append(("DateAdded", f"'{self.valDateAdded}'")) 
        if self.valVotes is not None:
            changes.append(("Votes", f"'{self.valVotes}'")) 
        if len(changes) <= 0:
             return jsonify({"ERROR": "PATCH method requires at least one parameter other than ResourceID"}), 400 
        else:
            result = Database.ModifyDatabase(table = "EducationalResources", key = "ResourceID", value = self.valResourceID, changes = changes)
            if result == True:
                return jsonify({"SUCCESS": "Resource modified"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406

