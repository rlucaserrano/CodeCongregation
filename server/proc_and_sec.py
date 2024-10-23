import bcrypt
import re 

# Educational sources used to setup proc_and_sec.py 
# 1. https://www.geeksforgeeks.org/hashing-passwords-in-python-with-bcrypt/
# 2. https://www.geeksforgeeks.org/extracting-email-addresses-using-regular-expressions-python/
# 3. https://www.geeksforgeeks.org/check-if-an-url-is-valid-or-not-using-regular-expression/


# NOTE: This class is composed of modified code from source #1. 
# Full credit to original authors for structure and library/function choices.

class ProcAndSec:

    @staticmethod
    def HashAndSalt(password):
        # converts password into byte array
        bytePassword = password.encode("utf-8") 
  
        # generates secure salt
        salt = bcrypt.gensalt() 
        
        # creates hashed byte password
        hashedPassword = bcrypt.hashpw(bytePassword, salt)

        # returns string version
        return hashedPassword.decode("utf-8")

    @staticmethod
    def VerifyPassword(plain_password, hashed_password):
        # converts password into byte array
        byte_password = plain_password.encode("utf-8")
        byte_hashed_password = hashed_password.encode("utf-8")
        return bcrypt.checkpw(byte_password, byte_hashed_password)

    @staticmethod
    def CheckEmailFormat(email):
        # RegEx was taken and modified from COP4020 course materials. Credit to original authors.
        template = r"^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$"
        return re.match(template, email)
    
    @staticmethod
    def CheckWebsiteURLFormat(url):
        # RegEx taken directly from source #3.
        template = "((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"
        return re.match(template, url)

    @staticmethod
    def CheckValidString(string):
        # Valid strings currently restricted to these characters
        template = r"^[A-Za-z0-9?!$.,@_\- ]+$"
        return re.match(template, string)
