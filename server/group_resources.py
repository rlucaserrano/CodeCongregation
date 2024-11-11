from flask import jsonify
from database import Database
from proc_and_sec import ProcAndSec
class GroupResources:
    def __init__(self, data=None):

        # Assigns variables with json data (if available) or default values.

        if data is None:
            data = {}

        # Values for row information. 
        self.valGroupID = data.get("valGroupID", None)
        self.valGroupResourceID = data.get("valGroupResourceID", None)
        self.valResourceName = data.get("valResourceName", None)
        self.valWebsiteURL = data.get("valWebsiteURL", None)
        self.valResourceCategory = data.get("valResourceCategory", None)
        self.valResourceDescription = data.get("valDescription", None)
        self.valPublicShare = data.get("valPublicShare", None)
        self.valDateAdded = data.get("valDateAdded", None)
        self.valDisplayOrder = data.get("valDisplayOrder", None)
        # Selected columns, * if all are None
        self.colGroupID = data.get("colGroupID", None)
        self.colGroupResourceID = data.get("colGroupResourceID", None)
        self.colResourceName = data.get("colResourceName", None)
        self.colWebsiteURL = data.get("colWebsiteURL", None)
        self.colResourceCategory = data.get("colResourceCategory", None)
        self.colResourceDescription = data.get("colDescription", None)
        self.colPublicShare = data.get("colPublicShare", None)
        self.colDateAdded = data.get("colDateAdded", None)
        self.colDisplayOrder = data.get("colDisplayOrder", None)
        # Search characteristics
        self.order = data.get("Order", None)
        self.distinct = data.get("Distinct", None)
        self.switch = data.get("switch", None)

    def Methods(self, method):

        # Internal function calls.

        if self.switch == "GET":
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
    
    def Process(self):
        if self.valGroupID is not None:
            if not ProcAndSec.CheckValidString(self.valGroupID):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valGroupResourceID is not None:
            if not ProcAndSec.CheckValidString(self.valGroupResourceID):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valResourceName is not None:
            if not ProcAndSec.CheckValidString(self.valResourceName):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valWebsiteURL is not None:
            if not ProcAndSec.CheckWebsiteURLFormat(self.valWebsiteURL):
                return jsonify({"ERROR": "Invalid website URL"}), 409
        if self.valResourceCategory is not None:
            if not ProcAndSec.CheckValidString(self.valResourceCategory):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valResourceDescription is not None:
            if not ProcAndSec.CheckValidString(self.valResourceDescription):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valPublicShare is not None:
            if not ProcAndSec.CheckValidString(self.valPublicShare):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valDateAdded is not None:
            if not ProcAndSec.CheckValidString(self.valDateAdded):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valDisplayOrder is not None:
            if not ProcAndSec.CheckValidString(self.valDisplayOrder):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.order is not None:
            if not ProcAndSec.CheckValidString(self.order[0]):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
            if not ProcAndSec.CheckValidString(self.order[1]):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.distinct is not None:
            if not ProcAndSec.CheckValidString(self.distinct):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
    def GetResource(self):
        # Populates columns based on information requested by the user. 
        columns = []
        if self.colGroupID is not None:
            columns.append("GroupID")
        if self.colGroupResourceID is not None:
            columns.append("GroupResourceID")
        if self.colResourceName is not None:
            columns.append("ResourceName")
        if self.colWebsiteURL is not None:
            columns.append("WebsiteURL")
        if self.colResourceCategory is not None:
            columns.append("ResourceCategory")
        if self.colResourceDescription is not None:
            columns.append("ResourceDescription")
        if self.colPublicShare is not None:
            columns.append("PublicShare") 
        if self.colDateAdded is not None:
            columns.append("DateAdded")
        if self.colDisplayOrder is not None:
            columns.append("DisplayOrder")    
        
        # Creates rowString for use by query constructor. Adds current group ID.
        rowString = "" 
        alreadyAdded = False;
        if self.valGroupID is None:
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        else:
            rowString = rowString + f"GroupID = '{self.valGroupID}'"
        # Modifies row string is additional restictions are passed in.
        if self.valGroupResourceID is not None:
            rowString = rowString + f" AND GroupResourceID = '{self.valGroupResourceID}'"
        if self.valResourceName is not None:
            rowString = rowString + f" AND ResourceName = '{self.valResourceName}'"
        if self.valWebsiteURL is not None:
            rowString = rowString + f" AND WebsiteURL = '{self.valWebsiteURL}'"
        if self.valResourceCategory is not None:
            rowString = rowString + f" AND ResourceCategory = '{self.valResourceCategory}'"
        if self.valPublicShare is not None:
            rowString = rowString + f" AND PublicShare = '{self.valPublicShare}'"
        if self.valDisplayOrder is not None:
            rowString = rowString + f" AND DisplayOrder = '{self.valDisplayOrder}'"
        if self.valResourceDescription is not None:
            rowString = rowString + f" AND ResourceDescription = '{self.valResourceDescription}'"
        if self.valDateAdded is not None:
            rowString = rowString + f" AND DateAdded = '{self.valDateAdded}'"
        
        # Passes information to Database class.
        return jsonify(Database.SearchDatabase(table = "MGOLAN.GroupResources", columns=columns, rows=rowString, order=self.order, distinct=self.distinct)), 200
    
    def AddResource(self):
        
        self.valGroupResourceID = '20'
        self.valDisplayOrder = '20'
        if (self.colGroupID is not None or self.colGroupResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublicShare is not None or self.colDateAdded is not None or self.colDisplayOrder is not None):
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        elif (self.valGroupID is None) or (self.valResourceName is None) or (self.valWebsiteURL is None) or (self.valResourceCategory is None) or (self.valPublicShare is None):
            return jsonify({"ERROR": "POST method requires GroupID, ResourceName, WebsiteURL, ResourceCategory, and PublicShare parameters"}), 400
        elif len(Database.SearchDatabase(table="MGOLAN.GroupResources", rows=f"GroupID = '{self.valGroupID}' AND GroupResourceID = '{self.valGroupResourceID}'")) > 0:
            return jsonify({"ERROR": "ResourceName already in use"}), 409
        elif len(Database.SearchDatabase(table="MGOLAN.GroupResources", rows=f"GroupID = '{self.valGroupID}' AND WebsiteURL = '{self.valWebsiteURL}'")) > 0:
            return jsonify({"ERROR": "WebsiteURL already in shared for this Group"}), 409 
        else: # Proprocesses inputs and attempts to insert into the database.
            if self.valResourceDescription is not None:
                self.valResourceDescription = f"'{self.valResourceDescription}'"
            else:
                self.valResourceDescription = "NULL"
            print("Call to AddToDatabase")
            result = Database.AddToDatabase(table = "MGOLAN.GroupResources", entry = [f"{self.valGroupID}", f"{self.valGroupResourceID}", f"'{self.valResourceName}'", f"'{self.valWebsiteURL}'", f"'{self.valResourceCategory}'", self.valResourceDescription, f"{self.valPublicShare}", "SYSDATE", f"{self.valDisplayOrder}"])
            print(result)
            if result == True:
                return jsonify({"SUCCESS": "Resource added"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
    
    def DeleteResource(self):
        if (self.colGroupID is not None or self.colGroupResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublicShare is not None or self.colDateAdded is not None or self.colDisplayOrder is not None):
            return jsonify({"ERROR": "DELETE method does not take column parameters"}), 400
        if self.valResourceName is not None or self.valWebsiteURL is not None or self.valResourceCategory is not None or self.valResourceDescription is not None or self.valPublicShare is not None or self.valDateAdded is not None or self.valDisplayOrder is not None or self.order is not None:
            return jsonify({"ERROR": "DELETE method only accepts GroupID and GroupResourceID parameter"}), 400
        if self.valGroupID is None or self.valGroupResourceID is None:
            return jsonify({"ERROR": "DELETE method requires GroupID and GroupResourceID parameters"}), 400
        elif len(Database.SearchDatabase(table="MGOLAN.GroupResources", rows=f"GroupID = '{self.valGroupID}' AND GroupResourceID = '{self.valGroupResourceID}'")) <= 0:
            return jsonify({"ERROR": "Resource does not exist"}), 404
        else:
            Database.RemoveFromDatabase(table="MGOLAN.GroupResources", key1="GroupID", value1=self.valGroupID, key2="GroupResourceID", value2=self.valGroupResourceID)
            return jsonify({"SUCCESS": "Resource deleted"}), 200
    
    def UpdateResource(self):
        print("Here")
        if (self.colGroupID is not None or self.colGroupResourceID is not None or self.colResourceName is not None or self.colWebsiteURL is not None or self.colResourceCategory is not None or self.colResourceDescription is not None or self.colPublicShare is not None or self.colDateAdded is not None or self.colDisplayOrder is not None):
            return jsonify({"ERROR": "PATCH method does not take column parameters"}), 400
        if self.valGroupID is None or self.valGroupResourceID is None:
            return jsonify({"ERROR": "PATCH method requires GroupID and GroupResourceID parameters"}), 400
        changes = []
        if self.valResourceName is not None:
            changes.append(("ResourceName", f"'{self.valResourceName}'"))
        if self.valWebsiteURL is not None:
            changes.append(("WebsiteURL", f"'{self.valWebsiteURL}'"))
        if self.valResourceCategory is not None:
            changes.append(("ResourceCategory", f"'{self.valResourceCategory}'")) 
        if self.valResourceDescription is not None:
            changes.append(("ResourceDescription", f"'{self.valResourceDescription}'")) 
        if self.valPublicShare is not None:
            changes.append(("PublicShare", f"'{self.valPublicShare}'"))
        if self.valDateAdded is not None:
            changes.append(("DateAdded", f"'{self.valDateAdded}'")) 
        if self.valDisplayOrder is not None:
            changes.append(("DisplayOrder", f"'{self.valDisplayOrder}'")) 
        if len(changes) <= 0:
             return jsonify({"ERROR": "PATCH method requires at least one parameter other than GroupID and GroupResourceID"}), 400 
        else:
            result = Database.ModifyDatabase(table = "MGOLAN.GroupResources", key1 = "GroupID", value1 = self.valGroupID, changes = changes, key2 = "GroupResourceID", value2 = self.valGroupResourceID)
            if result == True:
                return jsonify({"SUCCESS": "Resource modified"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406