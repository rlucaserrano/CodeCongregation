from flask import jsonify
from database import Database
from google_email import Email
from proc_and_sec import ProcAndSec

class Users:

    def __init__(self, data=None):
        
        # Assigns variables with json data (if available) or default values.
        self.valUserID = data.get("valUserID", None)
        self.valUserName = data.get("valUserName", None)
        self.valEmail = data.get("valEmail", None)
        self.valHashedPassword = data.get("valHashedPassword", None)
        self.valFirstName = data.get("valFirstName", None)
        self.valLastName = data.get("valLastName", None)
        self.valBio = data.get("valBio", None)
        self.valAdmin = data.get("valAdmin", None)
        self.colUserID = data.get("colUserID", None)
        self.colUserName = data.get("colUserName", None)
        self.colEmail = data.get("colEmail", None)
        self.colHashedPassword = data.get("colHashedPassword", None)
        self.colFirstName = data.get("colFirstName", None)
        self.colLastName = data.get("colLastName", None)
        self.colBio = data.get("colBio", None)
        self.colAdmin = data.get("colAdmin", None)
        self.order = data.get("Order", None)
        self.distinct = data.get("Distinct", None)

    def Methods(self, method):
        print("Received method in Methods:", method)  # Debug line

        try:
            if method == "GET":
                return self.GetUser()
            elif method == "POST":
                return self.AddUser()
            elif method == "DELETE":
                return self.DeleteUser()
            elif method == "PATCH":
                print("Calling UpdateUser")  # debugging PATCH 
                return self.UpdateUser()
            elif method == "HEAD":
                return self.CheckForUser()
            elif method == "OPTIONS":
                return jsonify({"Options": "GET, POST, DELETE, HEAD, PATCH, OPTIONS"}), 200
            else:
                return jsonify({"ERROR": "Invalid method selection"}), 405
        except Exception as e:
            print("Error in Methods:", e)  # print any errors here
            return jsonify({"ERROR": "Internal server error"}), 500

    def Process(self):
        if self.valUserID is not None:
            # Convert valUserID to a string for validation
            if not ProcAndSec.CheckValidString(str(self.valUserID)):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valUserName is not None:
            if not ProcAndSec.CheckValidString(self.valUserName):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valFirstName is not None:
            if not ProcAndSec.CheckValidString(self.valFirstName):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valLastName is not None:
            if not ProcAndSec.CheckValidString(self.valLastName):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valBio is not None:
            if not ProcAndSec.CheckValidString(self.valBio):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.valAdmin is not None:
            if not ProcAndSec.CheckValidString(self.valAdmin):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.order is not None:
            if not ProcAndSec.CheckValidString(self.order[0]):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
            if not ProcAndSec.CheckValidString(self.order[1]):
                return jsonify({"ERROR": "Invalid characters in string"}), 409
        if self.distinct is not None:
            if not ProcAndSec.CheckValidString(self.distinct):
                return jsonify({"ERROR": "Invalid characters in string"}), 409

    def GetUser(self):

        if self.valHashedPassword is not None or self.valFirstName is not None or self.valLastName is not None or self.valBio is not None:
            return jsonify({"ERROR": "GET method does not accept parameters for HashedPassword, FirstName, LastName, or Bio"}), 400
        columns = [] # populates columns
        if self.colUserID is not None:
            columns.append("UserID")
        if self.colUserName is not None:
            columns.append("UserName")
        if self.colEmail is not None:
            columns.append("Email")
        if self.colHashedPassword is not None:
            columns.append("HashedPassword")
        if self.colFirstName is not None:
            columns.append("FistName")
        if self.colLastName is not None:
            columns.append("LastName") 
        if self.colBio is not None:
            columns.append("Bio")
        if self.colAdmin is not None:
            columns.append("Admin")              
        rowString = "" # Creates rowString for use by query constructor.
        alreadyAdded = False;
        if self.valUserID is not None:
            rowString = rowString + f"UserID = '{self.valUserID}'"
            alreadyAdded = True
        if self.valUserName is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND UserName = '{self.valUserName}'"
            else:
                rowString = rowString + f"UserName = '{self.valUserName}'"
                alreadyAdded = True
        if self.valEmail is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Email = '{self.valEmail}'"
            else:
                rowString = rowString + f"Email = '{self.valEmail}'"
                alreadyAdded = True
        if self.valAdmin is not None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Admin = '{self.valAdmin}'"
            else:
                rowString = rowString + f"Admin = '{self.valAdmin}'"
                alreadyAdded = True
        if alreadyAdded == True:
            return jsonify(Database.SearchDatabase(table = "UserTable", columns=columns, rows=rowString, order=self.order, distinct=self.distinct)), 200
        else:
            return jsonify(Database.SearchDatabase(table = "UserTable", columns=columns, order=self.order, distinct=self.distinct)), 200

    def AddUser(self):
        # Check for invalid parameters in POST request
        if (self.colUserID is not None or self.colUserName is not None or self.colEmail is not None or 
            self.colHashedPassword is not None or self.colFirstName is not None or self.colLastName is not None or 
            self.colBio is not None or self.colAdmin is not None):
            return jsonify({"ERROR": "POST method does not take column parameters"}), 400
        
        # Check for missing required values
        if self.valUserID is None or self.valUserName is None or self.valEmail is None or self.valHashedPassword is None or self.valAdmin is None:
            return jsonify({"ERROR": "POST method requires UserID, UserName, Email, HashedPassword, and Admin parameters"}), 400

        # Check for unique constraints on UserID, UserName, and Email
        if len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.valUserID}'")) > 0:
            return jsonify({"ERROR": "UserID already in use"}), 409
        if len(Database.SearchDatabase(table="UserTable", rows=f"UserName = '{self.valUserName}'")) > 0:
            return jsonify({"ERROR": "UserName already in use"}), 409
        if len(Database.SearchDatabase(table="UserTable", rows=f"Email = '{self.valEmail}'")) > 0:
            return jsonify({"ERROR": "Email already in use"}), 409

        # Optional fields: set to NULL if missing
        self.valFirstName = f"'{self.valFirstName}'" if self.valFirstName else "NULL"
        self.valLastName = f"'{self.valLastName}'" if self.valLastName else "NULL"
        self.valBio = f"'{self.valBio}'" if self.valBio else "NULL"

        # Validate email format
        if not ProcAndSec.CheckEmailFormat(self.valEmail):
            return jsonify({"ERROR": "Invalid Email format"}), 409

        # Hash the password
        self.valHashedPassword = ProcAndSec.HashAndSalt(self.valHashedPassword)

        # Insert the new user into the database
        result = Database.AddToDatabase(
            table="UserTable", 
            entry=[
                f"{self.valUserID}", f"'{self.valUserName}'", f"'{self.valEmail}'", 
                f"'{self.valHashedPassword}'", self.valFirstName, self.valLastName, self.valBio, f"{self.valAdmin}"
            ]
        )

        # Return success or failure response based on insertion result
        if result:
            return jsonify({"SUCCESS": "User added"}), 200
        else:
            return jsonify({"ERROR": "Program encountered an unknown issue"}), 406

    def DeleteUser(self):
        if (self.colUserID is not None or self.colUserName is not None or self.colEmail is not None or self.colHashedPassword is not None or self.colFirstName is not None or self.colLastName is not None or self.colBio is not None or self.colAdmin is not None):
            return jsonify({"ERROR": "DELETE method does not take column parameters"}), 400
        elif self.valUserName is not None or self.valEmail is not None or self.valHashedPassword is not None or self.valFirstName is not None or self.valLastName is not None or self.valBio is not None or self.valAdmin is not None:
            return jsonify({"ERROR": "DELETE method does not accept UserName, Email, HashedPassword, FirstName, LastName, Bio, or Admin parameters"}), 400
        if self.valUserID is None:
            return jsonify({"ERROR": "DELETE method requires UserID parameter"}), 400
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.valUserID}'")) <= 0:
            return jsonify({"ERROR": "User does not exist"}), 404
        else:
            Database.RemoveFromDatabase("UserTable", "UserID", self.valUserID)
            return jsonify({"SUCCESS": "User deleted"}), 200

    def UpdateUser(self):
        # Check for UserID to be provided for update
        if self.valUserID is None:
            return jsonify({"ERROR": "PATCH method requires UserID parameter"}), 400
        
        # Start debug logging for UpdateUser
        print("Updating user - ID:", self.valUserID)
        print("First name:", self.valFirstName)
        print("Last name:", self.valLastName)

        # Ensure that column parameters are not passed in PATCH
        if any([self.colUserID, self.colUserName, self.colEmail, self.colHashedPassword, self.colFirstName, 
                self.colLastName, self.colBio, self.colAdmin]):
            return jsonify({"ERROR": "PATCH method does not take column parameters"}), 400

        # Collect changes based on provided values
        changes = []
        if self.valUserName is not None:
            if Database.SearchDatabase(table="UserTable", rows=f"UserName = '{self.valUserName}'"):
                return jsonify({"ERROR": "UserName already in use"}), 409
            changes.append(("UserName", f"'{self.valUserName}'"))
        if self.valEmail is not None:
            if Database.SearchDatabase(table="UserTable", rows=f"Email = '{self.valEmail}'"):
                return jsonify({"ERROR": "Email already in use"}), 409
            changes.append(("Email", f"'{self.valEmail}'"))
        if self.valHashedPassword is not None:
            changes.append(("HashedPassword", f"'{self.valHashedPassword}'"))
        if self.valAdmin is not None:
            changes.append(("Admin", f"'{self.valAdmin}'"))
        if self.valFirstName is not None:
            changes.append(("FirstName", f"'{self.valFirstName}'" if self.valFirstName != "NULL" else "NULL"))
        if self.valLastName is not None:
            changes.append(("LastName", f"'{self.valLastName}'" if self.valLastName != "NULL" else "NULL"))
        if self.valBio is not None:
            changes.append(("Bio", f"'{self.valBio}'" if self.valBio != "NULL" else "NULL"))

        # If no changes provided, return error
        if not changes:
            return jsonify({"ERROR": "PATCH method requires at least one parameter other than UserID"}), 400

        # Attempt to modify the database
        result = Database.ModifyDatabase(table="UserTable", key="UserID", value=self.valUserID, changes=changes)
        if result:
            return jsonify({"SUCCESS": "User modified"}), 200
        else:
            return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
        # End debug logging for UpdateUser

    def CheckForUser(self):
        if (self.colUserID is not None or self.colUserName is not None or self.colEmail is not None or self.colHashedPassword is not None or self.colFirstName is not None or self.colLastName is not None or self.colBio is not None or self.colAdmin is not None):
            return jsonify({"ERROR": "HEAD method does not take column parameters"}), 400
        elif self.valUserName is not None or self.valEmail is not None or self.valHashedPassword is not None or self.valFirstName is not None or self.valLastName is not None or self.valBio is not None or self.valAdmin is not None:
            return jsonify({"ERROR": "HEAD method does not accept UserName, Email, HashedPassword, FirstName, LastName, Bio, or Admin parameters"}), 400
        elif self.valUserID is None:
            return jsonify({"ERROR": "HEAD method requires UserID parameter"}), 400
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.valUserID}'")) <= 0:
            return jsonify({"Result": "Invalid UserID"}), 404
        else:
            return jsonify({"Result": "Valid UserID"}), 200


        # def Methods(self, method):
        
    #     # Internal function calls.
    #     try:
    #         if method == "GET":
    #             return self.GetUser()
    #         elif method == "POST":
    #             result = self.AddUser()
    #             # FIXME Sends Welcom Email. Remove second condition once testing is complete.
    #             if result[1] == 200 and self.valEmail == "codecongregation@gmail.com":
    #                 self.valFirstName = self.valFirstName[1:-1]
    #                 emailObject = Email()
    #                 emailMessage = emailObject.ConstructEmail(name=self.valFirstName, emailType=1)
    #                 emailObject.SendEmail(email=emailMessage, userEmail=self.valEmail)
    #                 emailObject.CloseConnection
    #             return result
    #         elif method == "DELETE":
    #             return self.DeleteUser()
    #         elif method == "PATCH":
    #             return self.UpdateUser()
    #         elif method == "HEAD":
    #             return self.CheckForUser()
    #         elif method == "OPTIONS":
    #             # Retrieves viable methods
    #             return jsonify({"Options": "GET, POST, DELETE, HEAD, PATCH, OPTIONS"}), 200
    #         else:
    #             # Catchall error response
    #             return jsonify({"ERROR": "Invalid method selection"}), 405
    #     except:
    #         # Catchall error response
    #             return jsonify({"ERROR": "Invalid method selection"}), 405
    
    # def Process(self):
    #     if self.valUserID is not None:
    #         if not ProcAndSec.CheckValidString(self.valUserID):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.valUserName is not None:
    #         if not ProcAndSec.CheckValidString(self.valUserName):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.valFirstName is not None:
    #         if not ProcAndSec.CheckValidString(self.valFirstName):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.valLastName is not None:
    #         if not ProcAndSec.CheckValidString(self.valLastName):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.valBio is not None:
    #         if not ProcAndSec.CheckValidString(self.valBio):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.valAdmin is not None:
    #         if not ProcAndSec.CheckValidString(self.valAdmin):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.order is not None:
    #         if not ProcAndSec.CheckValidString(self.order[0]):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #         if not ProcAndSec.CheckValidString(self.order[1]):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
    #     if self.distinct is not None:
    #         if not ProcAndSec.CheckValidString(self.distinct):
    #             return jsonify({"ERROR": "Invalid characters in string"}), 409
        