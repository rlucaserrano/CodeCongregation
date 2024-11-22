# test_database.py
import sys
import os
import firebase_admin
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import Database
from config import Config
from firebase_admin import credentials, firestore, initialize_app

# Initialize Firebase if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(Config.FIREBASE_SERVICE_ACCOUNT)
    initialize_app(cred)

def test_add_to_database():
    print("Testing AddToDatabase...")
    test_entry = {
        "username": "test_user",
        "email": "test@example.com",
        "bio": "This is a test user"
    }
    success = Database.AddToDatabase("users", test_entry)
    print("AddToDatabase result:", success)
    return success

def test_select_query():
    print("Testing SelectQuery...")
    # Search for users where username is "test_user"
    results = Database.SelectQuery("users", conditions=[("username", "==", "test_user")])
    print("SelectQuery results:", results)
    return results

def test_modify_database(doc_id):
    print("Testing ModifyDatabase...")
    changes = {
        "email": "updated_test@example.com",
        "bio": "Updated bio"
    }
    success = Database.ModifyDatabase("users", doc_id, changes)
    print("ModifyDatabase result:", success)
    return success

def test_remove_from_database():
    print("Testing RemoveFromDatabase...")
    success = Database.RemoveFromDatabase("users", "username", "test_user")
    print("RemoveFromDatabase result:", success)
    return success

def test_connection():
    print("Testing Firestore connection...")
    Database.TestConnection()

if __name__ == "__main__":
    # Test Firestore connection
    test_connection()
    
    # Test add function
    if test_add_to_database():
        # If add was successful, test select function
        results = test_select_query()
        
        if results:
            # If select was successful, test modify function with the document ID of the first result
            doc_id = results[0]["doc_id"]
            if doc_id:
                test_modify_database(doc_id)

            # Finally, test delete function
            test_remove_from_database()
