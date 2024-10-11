import bcrypt 

# Educational sources used to setup proc_and_sec.py 
# 1. https://www.geeksforgeeks.org/hashing-passwords-in-python-with-bcrypt/


# NOTE: This class is composed of modified code from source #1. 
# Full credit to original authors for structure and library/function choices.

class ProcAndSec:

    @staticmethod
    def HashAndSalt(password):
        
        # Converts password into byte array
        bytePassword = password.encode("utf-8") 
  
        # Generates secure salt
        salt = bcrypt.gensalt() 
        
        # Creates hashed byte password
        hashedPassword = bcrypt.hashpw(bytePassword, salt)

        # Returns string version
        return hashedPassword.decode("utf-8")

    #FIXME Add Checks for proper email format and SQL injection attacks 
    


