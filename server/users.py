from flask import jsonify
from database import Database
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
        try:
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
                return jsonify({"Options": "GET, POST, DELETE, HEAD, OPTIONS"}), 200
            else:
                return jsonify({"ERROR": "Invalid method selection"}), 405
        except Exception as e:
            return jsonify({"ERROR": str(e)}), 500

    def GetUser(self):
        if self.valHashedPassword or self.valFirstName or self.valLastName or self.valBio:
            return jsonify({"ERROR": "GET method does not accept parameters for HashedPassword, FirstName, LastName, or Bio"}), 400

        columns = self._build_columns()
        rowString = self._build_row_string()
        return jsonify(Database.SearchDatabase(table="UserTable", columns=columns, rows=rowString)), 200

    def AddUser(self):
        if not all([self.valUserID, self.valUserName, self.valEmail, self.valAdmin]):
            return jsonify({"ERROR": "POST method requires UserID, UserName, Email, Admin parameters"}), 400

        if self._is_duplicate("UserID", self.valUserID):
            return jsonify({"ERROR": "UserID already in use"}), 409
        if self._is_duplicate("UserName", self.valUserName):
            return jsonify({"ERROR": "UserName already in use"}), 409
        if self._is_duplicate("Email", self.valEmail):
            return jsonify({"ERROR": "Email already in use"}), 409

        if self.valHashedPassword:
            self.valHashedPassword = ProcAndSec.HashAndSalt(self.valHashedPassword)
        else:
            self.valHashedPassword = "NULL"

        self.valFirstName = f"'{self.valFirstName}'" if self.valFirstName else "NULL"
        self.valLastName = f"'{self.valLastName}'" if self.valLastName else "NULL"
        self.valBio = f"'{self.valBio}'" if self.valBio else "NULL"

        result = Database.AddToDatabase(
            table="UserTable",
            entry=[f"{self.valUserID}", f"'{self.valUserName}'", f"'{self.valEmail}'", f"'{self.valHashedPassword}'", self.valFirstName, self.valLastName, self.valBio, f"{self.valAdmin}"]
        )
        if result:
            return jsonify({"SUCCESS": "User added"}), 200
        return jsonify({"ERROR": "Program encountered an unknown issue"}), 406

    def UpdateUser(self):
        if not self.valUserID:
            return jsonify({"ERROR": "PATCH method requires UserID parameter"}), 400

        changes = self._build_changes()
        if not changes:
            return jsonify({"ERROR": "PATCH method requires at least one parameter other than UserID"}), 400

        result = Database.ModifyDatabase(
            table="UserTable",
            key="UserID",
            value=self.valUserID,
            changes=changes
        )
        if result:
            return jsonify({"SUCCESS": "User modified"}), 200
        return jsonify({"ERROR": "Program encountered an unknown issue"}), 406

    def _build_columns(self):
        columns = ["UserID", "UserName", "Email", "Admin"]
        if self.colHashedPassword:
            columns.append("HashedPassword")
        if self.colFirstName:
            columns.append("FirstName")
        if self.colLastName:
            columns.append("LastName")
        if self.colBio:
            columns.append("Bio")
        return columns

    def _is_duplicate(self, field, value):
        return len(Database.SearchDatabase(table="UserTable", rows=f"{field} = '{value}'")) > 0
