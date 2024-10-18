from email.mime.text import MIMEText  
from email.mime.multipart import MIMEMultipart 
import smtplib
from config import Config

# Educational sources used to setup google_email.py 
# 1. https://www.geeksforgeeks.org/how-to-send-automated-email-messages-in-python/


# NOTE: This class is composed of modified code from source #1. 
# Full credit to original authors for structure and library/function choices.

class Email:


    def __init__(self):
    
        self.smtp = smtplib.SMTP('smtp.gmail.com', 587) 
        self.smtp.ehlo() 
        self.smtp.starttls() 
        self.smtp.login(Config.EMAIL_ADDRESS, Config.EMAIL_PASSWORD)
    
    @staticmethod
    def ConstructEmail(name=None, emailType=1):
        
        email = MIMEMultipart()
        body = ""
        subject = ""

        if emailType == 1:
            body = f"DEMO: Hello {name}! Welcome to Code Congregation: A Virtual Study Group"
            subject = f"DEMO: Welcome to Code Congregation!"
        
        email['Subject'] = subject
        email.attach(MIMEText(body))
        return email
        

    def SendEmail(self, email, userEmail):
        self.smtp.sendmail(from_addr="codecongregation@gmail.com", to_addrs=userEmail, msg=email.as_string())

    def CloseConnection(self):
        self.smtp.quit()