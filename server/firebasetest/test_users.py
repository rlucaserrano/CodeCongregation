# test_users.py
import sys
import os
import firebase_admin
import unittest
from flask import Flask, jsonify
from firebase_admin import credentials, firestore, initialize_app


# Set up the path to locate modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import Config
from users import Users
from database import Database

# Initialize Firebase if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(Config.FIREBASE_SERVICE_ACCOUNT)
    initialize_app(cred)

# Set up Flask for testing
app = Flask(__name__)

class TestUsers(unittest.TestCase):


    @classmethod
    def setUpClass(cls):
        # One-time setup for all tests, if needed
        cls.cleanup_test_users()  # Ensure any lingering test data is cleared before testing

    def setUp(self):
        self.test_data = {
           "valUserID": "2",
            "valUserName": "username",
            "valEmail": "user@mail.com",
            "valHashedPassword": "$2b$12$kzQEp3KsQLaDfwVd/JJNT.lePT5etjSXw2fIGOk.PEcZz2vnO.W1K",
            "valFirstName": "first",
            "valLastName": "last",
            "valBio": None,  # bio is null
            "valAdmin": 0
        }
        self.user_instance = Users(data=self.test_data)
    
    def tearDown(self):
        # Cleanup test user and other test data after each test
        self.cleanup_test_users()

    @staticmethod
    def cleanup_test_users():
        # Delete the test user by unique fields (e.g., user ID, email, or username)
        Database.RemoveFromDatabase("users", "UserID", "2")
        Database.RemoveFromDatabase("GOOGLE", "OWNERID", "test_google_user_id")
        print("Test data cleanup complete.")

    def test_add_user(self):
        print("\nTesting AddUser...")
        with app.app_context():
            response = self.user_instance.AddUser()
            self.assertEqual(response[1], 200)
            print(response[0].json)  # Display the response content

    def test_get_user(self):
        print("\nTesting GetUser...")
        with app.app_context():
            response = self.user_instance.GetUser()
            self.assertEqual(response[1], 200)
            users = response[0].json
            print("GetUser response:", users)

    def test_update_user(self):
        print("\nTesting UpdateUser...")
        self.test_data["valFirstName"] = "first"
        self.user_instance = Users(data=self.test_data)
        
        with app.app_context():
            response = self.user_instance.UpdateUser()
            self.assertEqual(response[1], 200)
            print("UpdateUser response:", response[0].json)

    def test_check_for_user(self):
        print("\nTesting CheckForUser...")
        with app.app_context():
            response = self.user_instance.CheckForUser()
            self.assertEqual(response[1], 200)
            print("CheckForUser response:", response[0].json)

    def test_delete_user(self):
        print("\nTesting DeleteUser...")
        with app.app_context():
            response = self.user_instance.DeleteUser()
            self.assertEqual(response[1], 200)
            print("DeleteUser response:", response[0].json)

    def test_add_to_google_table(self):
        print("\nTesting AddToGoogleTable...")
        with app.app_context():
            # Add a new Google login entry
            user_id = "test_google_user_id"
            email = "test_google_user@example.com"
            google_uid = "google_uid_12345"
            
            # Invoke AddToGoogleTable
            response = self.user_instance.AddToGoogleTable(
                user_id=user_id,
                email=email,
                google_uid=google_uid
            )
            
            # Check response for successful addition
            self.assertEqual(response[1], 200)
            print("AddToGoogleTable response:", response[0].json)
            
            # Verify the document exists in the GOOGLE collection
            google_user_doc = Database.SelectQuery(
                "GOOGLE", conditions=[("OWNERID", "==", user_id)]
            )
            self.assertTrue(google_user_doc)  # Ensure the document exists
            print("Google document found:", google_user_doc)
 

if __name__ == "__main__":
    unittest.main()
