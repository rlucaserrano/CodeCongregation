from flask import jsonify
from database import Database
from proc_and_sec import ProcAndSec

class EducationalResources:

    def __init__(self, data=None):
        
        if data is not None:
            
            # Assigns variables with json data (if available) or default value of None.
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
        else:
            # Catchall error response
            return jsonify({"ERROR": "Invalid method selection"}), 405
    
    def GetResource(self):

        # Returns all available resources, ordered by Votes (DESC)
        return jsonify(Database.SearchDatabase(table = "MGOLAN.EducationalResources", order=["Votes", "DESC"]), ), 200

   
# Remaining functions currently vestigial code: POST, DELETE, and PATCH requests not implemented for Frontend. Adding, modifying, and deleting community resources done directly from database. 
   
    def AddResource(self):
        
        # Checks for invalid parameter types and characteristics
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        elif (self.valResourceID is None) or (self.valResourceName is None) or (self.valWebsiteURL is None) or (self.valResourceCategory is None) or (self.valPublished is None) or (self.valDateAdded is None) or (self.valVotes is None):
            return jsonify({"ERROR": "POST method requires ResourceID, ResourceName, WebsiteURL, ResourceCategory, Published, DateAdded, and Votes parameters"}), 400
        elif len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"ResourceID = '{self.valResourceID}'")) > 0:
            return jsonify({"ERROR": "ResourceID already in use"}), 409
        elif len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"ResourceName = '{self.valResourceName}'")) > 0:
            return jsonify({"ERROR": "ResourceName already in use"}), 409
        elif len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"WebsiteURL = '{self.valWebsiteURL}'")) > 0:
            return jsonify({"ERROR": "WebsiteURL already in use"}), 409 
        else: # Proprocesses inputs and attempts to insert into the database.
            if self.valResourceDescription is not None:
                self.valResourceDescription = f"'{self.valResourceDescription}'"
            else:
                self.valResourceDescription = "NULL"
            result = Database.AddToDatabase(table = "MGOLAN.EducationalResources", entry = [f"{self.valResourceID}", f"'{self.valResourceName}'", f"'{self.valWebsiteURL}'", f"'{self.valResourceCategory}'", self.valResourceDescription, f"{self.valPublished}", f"{self.valDateAdded}", f"{self.valVotes}"])
            if result == True:
                return jsonify({"SUCCESS": "Resource added"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
    
    def DeleteResource(self):
        
        # Checks for invalid parameter types and characteristics
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "DELETE method does not take column parameters"}), 400
        if self.valResourceName is not None or self.valWebsiteURL is not None or self.valResourceCategory is not None or self.valResourceDescription is not None or self.valPublished is not None or self.valDateAdded is not None or self.valVotes is not None or self.order is not None:
            return jsonify({"ERROR": "DELETE method only accepts ResourceID parameter"}), 400
        if self.valResourceID is None:
            return jsonify({"ERROR": "DELETE method requires ResourceID parameter"}), 400
        elif len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"ResourceID = '{self.valResourceID}'")) <= 0:
            return jsonify({"ERROR": "Resource does not exist"}), 404
        else: # Else, deletes resource.
            Database.RemoveFromDatabase("EducationalResources", "ResourceID", self.valResourceID)
            return jsonify({"SUCCESS": "Resource deleted"}), 200

    def UpdateResource(self):
        
        # Checks for invalid parameter types and characteristics
        if (self.colResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublished is not None or self.colDateAdded is not None or self.colVotes is not None):
            return jsonify({"ERROR": "PATCH method does not take column parameters"}), 400
        if self.valResourceID is None:
            return jsonify({"ERROR": "PATCH method requires ResourceID parameter"}), 400
        #Preprocesses and compiles changes.
        changes = []
        if self.valResourceName is not None:
            if len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"ResourceName = '{self.valResourceName}'")) > 0:
                return jsonify({"ERROR": "ResourceName already in use"}), 409
            changes.append(("ResourceName", f"'{self.valResourceName}'"))
        if self.valWebsiteURL is not None:
            if len(Database.SearchDatabase(table="MGOLAN.EducationalResources", rows=f"WebsiteURL = '{self.valWebsiteURL}'")) > 0:
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
        else: # Updates database.
            result = Database.ModifyDatabase(table = "MGOLAN.EducationalResources", key1 = "ResourceID", value1 = self.valResourceID, changes = changes)
            if result == True:
                return jsonify({"SUCCESS": "Resource modified"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406

