# test_email.py

from google_email import Email  # Replace 'email_module' with the name of your Python file containing the Email class
from config import Config

def main():
    # Initialize the Email class
    email_client = Email()
    
    # Construct the email
    test_email = email_client.ConstructEmail(name="Jane Doe", emailType=1)
    
    # Recipient's email address
    recipient_email = "recipient@example.com"  # Replace with the recipient's email address
    
    # Send the email
    email_client.SendEmail(test_email, recipient_email)
    
    # Close the SMTP connection
    email_client.CloseConnection()
    
    print("Test email sent successfully.")

if __name__ == "__main__":
    main()
