
import os
from dotenv import load_dotenv

# Educational sources used to setup config.py 
# 1. https://docs.python.org/3.11/distutils/configfile.html
# 2. https://www.geeksforgeeks.org/python-os-getenv-method/

load_dotenv()

class Config:
    
    # Database
    ORACLE_USER = os.getenv("ORACLE_USER")
    ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
    ORACLE_HOST = os.getenv("ORACLE_HOST")
    ORACLE_PORT = os.getenv("ORACLE_PORT")
    ORACLE_SID = os.getenv("ORACLE_SID")

    # Google 
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
<<<<<<< HEAD
    GOOGLE_SECRET_KEY = os.getenv("GOOGLE_SECRET_KEY")

    #Flask app secret key
    FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

    #  Flask-Session configuration 
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
=======
    GOOGLE_SECRET_KEY = os.getenv("GOOGLE_SECRET_KEY")
>>>>>>> 9b1143f5c09ac00b1c44227f2cb84a060ed544b2
