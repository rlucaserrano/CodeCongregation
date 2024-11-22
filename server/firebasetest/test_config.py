import sys
import os
import firebase_admin 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config import Config
from firebase_admin import credentials, firestore, initialize_app

def test_config():
    print("Testing Config class...")

    print("GOOGLE_CLIENT_ID:", Config.GOOGLE_CLIENT_ID)
    print("GOOGLE_CLIENT_SECRET:", Config.GOOGLE_CLIENT_SECRET)
    print("GOOGLE_API_KEY:", Config.GOOGLE_API_KEY)
    print("GOOGLE_TOKEN_URI:", Config.GOOGLE_TOKEN_URI)
    print("FLASK_SECRET_KEY:", Config.FLASK_SECRET_KEY)
    print("REACT_APP_BACKEND_URL:", Config.REACT_APP_BACKEND_URL)
    print("JWT_SECRET:", Config.JWT_SECRET)
    print("FIREBASE_SERVICE_ACCOUNT:", Config.FIREBASE_SERVICE_ACCOUNT)

    print("\nConfig test completed.")

def test_firebase_connection():
    print("Testing Firebase connection...")
    
    # initialize Firebase
    if not firebase_admin._apps:  # initialize only if not already initialized
        cred = credentials.Certificate(Config.FIREBASE_SERVICE_ACCOUNT)
        initialize_app(cred)

    # Initialize Firestore and attempt to read from a test collection
    db = firestore.client()
    try:
        # Try reading a test document from a collection named "test"
        test_doc = db.collection("users").document("2").get()
        if test_doc.exists:
            print("Firebase connection successful. Test document data:", test_doc.to_dict())
        else:
            print("Firebase connection successful, but test document does not exist.")
    except Exception as e:
        print("Error connecting to Firebase:", e)

if __name__ == "__main__":
    test_config()
    test_firebase_connection()