from flask import jsonify
from database import Database

class Users:

    def __init__(self, data=None):
        
        # Assigns variables with json data (if available) or default values.
        self.UserID = data.get("UserID", None)
        self.UserName = data.get("UserName", None)
        self.Email = data.get("Email", None)
        self.Password = data.get("Password", None)
        self.FirstName = data.get("FirstName", "EMPTY")
        self.LastName = data.get("LastName", "EMPTY")
        self.Bio = data.get("Bio", "EMPTY")
        self.Admin = data.get("Admin", None)

    def Methods(self, method):
        
        # Internal function calls.
        if method == "GET":
            return self.GetUser()
        elif method == "POST":
            return self.AddUser()
        elif method == "DELETE":
            return self.DeleteUser()
        elif method == "PATCH":
            return self.UpdateUser()
        elif method == "HEAD":
            return self.CheckForUser()
        elif method == "OPTIONS":
            # Retrieves viable methods
            return jsonify({"Options": "GET, POST, DELETE, HEAD, OPTIONS"}), 200
        else:
            # Catchall error response
            return jsonify({"ERROR": "Invalid method selection"}), 405
    
    def GetUser(self):

        if self.Password != None or self.FirstName != "EMPTY" or self.LastName != "EMPTY" or self.Bio != "EMPTY":
            return jsonify({"ERROR": "GET method does not accept parameters for Password, FirstName, LastName, or Bio"}), 400
        rowString = "" # Creates rowString for use by query constructor.
        alreadyAdded = False;
        if self.UserID != None:
            rowString = rowString + f"UserID = '{self.UserID}'"
            alreadyAdded = True
        if self.UserName != None:
            if alreadyAdded == True:
                rowString = rowString + f" AND UserName = '{self.UserName}'"
            else:
                rowString = rowString + f"UserName = '{self.UserName}'"
                alreadyAdded = True
        if self.Email != None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Email = '{self.Email}'"
            else:
                rowString = rowString + f"Email = '{self.Email}'"
                alreadyAdded = True
        if self.Admin != None:
            if alreadyAdded == True:
                rowString = rowString + f" AND Admin = '{self.Admin}'"
            else:
                rowString = rowString + f"Admin = '{self.Admin}'"
                alreadyAdded = True
        if alreadyAdded == True:
            return jsonify(Database.SearchDatabase(table = "UserTable", rows=rowString)), 200
        else:
            return jsonify(Database.SearchDatabase(table = "UserTable")), 200

    def AddUser(self):
        
        if (self.UserID == None) or (self.UserName == None) or (self.Email == None) or (self.Password == None) or (self.Admin == None):
            return jsonify({"ERROR": "POST method requires UserID, UserName, Email, Password, Admin parameters"}), 400
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.UserID}'")) > 0:
            return jsonify({"ERROR": "UserID already in use"}), 409
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserName = '{self.UserName}'")) > 0:
            return jsonify({"ERROR": "UserName already in use"}), 409
        elif len(Database.SearchDatabase(table="UserTable", rows=f"Email = '{self.Email}'")) > 0:
            return jsonify({"ERROR": "Email already in use"}), 409   
        else: # Proprocesses inputs and attempts to insert into the database.
            if self.FirstName != "EMPTY":
                self.FirstName = f"'{self.FirstName}'"
            else:
                self.FirstName = "NULL"
            if self.LastName != "EMPTY":
                self.LastName = f"'{self.LastName}'"
            else:
                self.LastName = "NULL"
            if self.Bio != "EMPTY":
                self.Bio = f"'{self.Bio}'"
            else:
                self.Bio = "NULL"
            result = Database.AddToDatabase(table = "UserTable", entry = [f"{self.UserID}", f"'{self.UserName}'", f"'{self.Email}'", f"'{self.Password}'", self.FirstName, self.LastName, self.Bio, f"{self.Admin}"])
            if result == True:
                return jsonify({"SUCCESS": "User added"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406
    
    def DeleteUser(self):
        if self.UserName != None or self.Email != None or self.Password != None or self.FirstName != "EMPTY" or self.LastName != "EMPTY" or self.Bio != "EMPTY" or self.Admin != None:
            return jsonify({"ERROR": "DELETE method does not accept UserName, Email, Password, FirstName, LastName, Bio, or Admin parameters"}), 400
        if self.UserID ==  None:
            return jsonify({"ERROR": "DELETE method requires UserID parameter"}), 400
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.UserID}'")) <= 0:
            return jsonify({"ERROR": "UserID does not exist"}), 404
        else:
            Database.RemoveFromDatabase("UserTable", "UserID", self.UserID)
            return jsonify({"SUCCESS": "User deleted"}), 200

    def UpdateUser(self):
        
        if self.UserID ==  None:
            return jsonify({"ERROR": "PATCH method requires UserID parameter"}), 400
        changes = []
        if self.UserName != None:
            if len(Database.SearchDatabase(table="UserTable", rows=f"UserName = '{self.UserName}'")) > 0:
                return jsonify({"ERROR": "UserName already in use"}), 409
            changes.append(("UserName", f"'{self.UserName}'"))
        if self.Email != None:
            if len(Database.SearchDatabase(table="UserTable", rows=f"Email = '{self.Email}'")) > 0:
                return jsonify({"ERROR": "Email already in use"}), 409
            changes.append(("Email", f"'{self.Email}'"))
        if self.Password != None:
            changes.append(("Password", f"'{self.Password}'")) 
        if self.Admin != None:
            changes.append(("Admin", f"'{self.Admin}'"))
        if self.FirstName != "EMPTY":
            if self.FirstName != "NULL":
                self.FirstName = f"'{self.FirstName}'"
            changes.append(("FirstName", self.FirstName))
        if self.LastName != "EMPTY":
            if self.LastName != "NULL":
                self.LastName = f"'{self.LastName}'"
            changes.append(("LastName", self.LastName))
        if self.Bio != "EMPTY":
            if self.Bio != "NULL":
                self.Bio = f"'{self.Bio}'"
            changes.append(("Bio", self.Bio))
        if len(changes) <= 0:
             return jsonify({"ERROR": "PATCH method requires at least one parameter other than UserID"}), 400 
        else:
            result = Database.ModifyDatabase(table = "UserTable", key = "UserID", value = self.UserID, changes = changes)
            if result == True:
                return jsonify({"SUCCESS": "User modified"}), 200
            else:
                return jsonify({"ERROR": "Program encountered an unknown issue"}), 406


    def CheckForUser(self):
        if self.UserName != None or self.Email != None or self.Password != None or self.FirstName != "EMPTY" or self.LastName != "EMPTY" or self.Bio != "EMPTY" or self.Admin != None:
            return jsonify({"ERROR": "Head method does not accept UserName, Email, Password, FirstName, LastName, Bio, or Admin parameters"}), 400
        if self.UserID ==  None:
            return jsonify({"ERROR": "Head method requires UserID parameter"}), 400
        elif len(Database.SearchDatabase(table="UserTable", rows=f"UserID = '{self.UserID}'")) <= 0:
            return jsonify({"Result": "Invalid UserID"}), 404
        else:
            return jsonify({"Result": "Valid UserID"}), 200
