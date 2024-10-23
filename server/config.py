import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    ORACLE_USER = os.getenv("ORACLE_USER")
    ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
    ORACLE_HOST = os.getenv("ORACLE_HOST")
    ORACLE_PORT = os.getenv("ORACLE_PORT")
    ORACLE_SID = os.getenv("ORACLE_SID")
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_SECRET_KEY = os.getenv("GOOGLE_SECRET_KEY")
    FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
