from flask import jsonify
from database import Database
from proc_and_sec import ProcAndSec


class Users:
    def __init__(self, data=None):
        # Initialize user attributes based on provided data or set to None
        self.valUserID = data.get("valUserID") if data else None
        self.valUserName = data.get("valUserName") if data else None
        self.valEmail = data.get("valEmail") if data else None
        self.valHashedPassword = data.get("valHashedPassword") if data else None
        self.valFirstName = data.get("valFirstName") if data else None
        self.valLastName = data.get("valLastName") if data else None
        self.valBio = data.get("valBio") if data else None
        self.valAdmin = data.get("valAdmin") if data else None

    def Methods(self, method):
        try:
            if method == "GET":
                return self.get_user()
            elif method == "POST":
                return self.add_user()
            elif method == "DELETE":
                return self.delete_user()
            elif method == "PATCH":
                return self.update_user()
            elif method == "HEAD":
                return self.check_user_exists()
            elif method == "OPTIONS":
                return jsonify({"Options": "GET, POST, DELETE, PATCH, HEAD, OPTIONS"}), 200
            else:
                return jsonify({"ERROR": "Invalid method selection"}), 405
        except Exception as e:
            return jsonify({"ERROR": str(e)}), 500

    def get_user(self):
        # Prepare conditions for searching
        conditions = []
        if self.valUserID:
            conditions.append(f"UserID = '{self.valUserID}'")
        if self.valUserName:
            conditions.append(f"UserName = '{self.valUserName}'")
        if self.valEmail:
            conditions.append(f"Email = '{self.valEmail}'")

        # Join conditions into a single query string
        condition_string = " AND ".join(conditions) if conditions else "1=1"

        # Query the database
        try:
            result = Database.SearchDatabase("MGOLAN.USERTABLE", rows=condition_string)
            return jsonify({"data": result}), 200
        except Exception as e:
            return jsonify({"ERROR": f"Error fetching user: {e}"}), 500

    def add_user(self):
        # Check for required fields
        if not all([self.valUserID, self.valUserName, self.valEmail, self.valAdmin]):
            return jsonify({"ERROR": "Missing required fields: UserID, UserName, Email, Admin"}), 400

        # Check for duplicates
        if self._is_duplicate("UserID", self.valUserID):
            return jsonify({"ERROR": "UserID already exists"}), 409
        if self._is_duplicate("UserName", self.valUserName):
            return jsonify({"ERROR": "UserName already exists"}), 409
        if self._is_duplicate("Email", self.valEmail):
            return jsonify({"ERROR": "Email already exists"}), 409

        # Hash the password
        if self.valHashedPassword:
            self.valHashedPassword = ProcAndSec.HashAndSalt(self.valHashedPassword)
        else:
            return jsonify({"ERROR": "Password is required"}), 400

        # Handle optional fields
        first_name = f"'{self.valFirstName}'" if self.valFirstName else "NULL"
        last_name = f"'{self.valLastName}'" if self.valLastName else "NULL"
        bio = f"'{self.valBio}'" if self.valBio else "NULL"

        # Construct the entry for insertion
        entry = [
            f"{self.valUserID}",
            f"'{self.valUserName}'",
            f"'{self.valEmail}'",
            f"'{self.valHashedPassword}'",
            first_name,
            last_name,
            bio,
            f"{self.valAdmin}"
        ]

        # Add user to the database
        try:
            result = Database.AddToDatabase("MGOLAN.USERTABLE", entry=entry)
            if result:
                return jsonify({"SUCCESS": "User added successfully"}), 201
            return jsonify({"ERROR": "Failed to add user"}), 500
        except Exception as e:
            return jsonify({"ERROR": f"Error adding user: {e}"}), 500

    def update_user(self):
        if not self.valUserID:
            return jsonify({"ERROR": "UserID is required for updating user data"}), 400

        # Prepare the changes for the update
        changes = []
        if self.valUserName:
            changes.append(("UserName", f"'{self.valUserName}'"))
        if self.valEmail:
            changes.append(("Email", f"'{self.valEmail}'"))
        if self.valHashedPassword:
            self.valHashedPassword = ProcAndSec.HashAndSalt(self.valHashedPassword)
            changes.append(("HashedPassword", f"'{self.valHashedPassword}'"))
        if self.valFirstName:
            changes.append(("FirstName", f"'{self.valFirstName}'"))
        if self.valLastName:
            changes.append(("LastName", f"'{self.valLastName}'"))
        if self.valBio:
            changes.append(("Bio", f"'{self.valBio}'"))

        if not changes:
            return jsonify({"ERROR": "No updates provided"}), 400

        # Update the database
        try:
            result = Database.ModifyDatabase(
                table="MGOLAN.USERTABLE",
                key="UserID",
                value=self.valUserID,
                changes=changes
            )
            if result:
                return jsonify({"SUCCESS": "User updated successfully"}), 200
            return jsonify({"ERROR": "Failed to update user"}), 500
        except Exception as e:
            return jsonify({"ERROR": f"Error updating user: {e}"}), 500

    def delete_user(self):
        if not self.valUserID:
            return jsonify({"ERROR": "UserID is required for deleting a user"}), 400

        try:
            result = Database.RemoveFromDatabase("MGOLAN.USERTABLE", key="UserID", value=self.valUserID)
            if result:
                return jsonify({"SUCCESS": "User deleted successfully"}), 200
            return jsonify({"ERROR": "Failed to delete user"}), 500
        except Exception as e:
            return jsonify({"ERROR": f"Error deleting user: {e}"}), 500

    def check_user_exists(self):
        if not self.valUserName:
            return jsonify({"ERROR": "UserName is required to check for user existence"}), 400

        is_duplicate = self._is_duplicate("UserName", self.valUserName)
        if is_duplicate:
            return jsonify({"SUCCESS": "User exists"}), 200
        return jsonify({"ERROR": "User does not exist"}), 404

    def _is_duplicate(self, field, value):
        # Check if a record with the given field and value exists in the database
        return len(Database.SearchDatabase("MGOLAN.USERTABLE", rows=f"{field} = '{value}'")) > 0
