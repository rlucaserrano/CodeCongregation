import json
from main import app

userTests = False
educationalResourcesTests = True

if (userTests ==  True):
  # Add Test (Success)
  with app.test_client() as client:
      response = client.post('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                              "valUserName": "GatorFan1",
                              "valEmail": "codecongregation@gmail.com",
                              "valHashedPassword": "FakePassword1",
                              "valAdmin": "0",
                              "valFirstName": "Swamp",
                              "valLastName": "Scripter",
                              "valBio": "Bio"

                            }),
                            content_type='application/json')

  print(response.get_json())

  # Add Test (Failure 1)
  with app.test_client() as client:
      response = client.post('/users', 
                            data=json.dumps({
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Add Test (Failure 2)
  with app.test_client() as client:
      response = client.post('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                              "valUserName": "GatorFan1",
                              "valEmail": "Fake1@Gmail.com",
                              "valHashedPassword": "FakePassword1",
                              "valAdmin": "0"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Add Test (Failure 3)
  with app.test_client() as client:
      response = client.post('/users', 
                            data=json.dumps({
                              "valUserID": "2",
                              "valUserName": "GatorFan1",
                              "valEmail": "Fake1@Gmail.com",
                              "valHashedPassword": "FakePassword1",
                              "valAdmin": "0"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Add Test (Failure 4)
  with app.test_client() as client:
      response = client.post('/users', 
                            data=json.dumps({
                              "valUserID": "2",
                              "valUserName": "GatorFan2",
                              "valEmail": "codecongregation@gmail.com",
                              "valHashedPassword": "FakePassword1",
                              "valAdmin": "0"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test (All columns)
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test (UserNames)
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                              "valUserId": "1",
                              "colUserName": "Type anything you want"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test (UserName and Email)
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                              "valUserId": "1",
                              "colUserName": "Type anything you want",
                              "colEmail": "Yep Anything. Just replace val with col"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Modify Test (Failure - Nothing to modify)
  with app.test_client() as client:
      response = client.patch('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Modify Test (Success)
  with app.test_client() as client:
      response = client.patch('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                              "valHashedPassword": "FakePassword1!",
                              "valAdmin": "1",
                              "valBio": "Now we have a bio!"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Head Test
  with app.test_client() as client:
      response = client.head('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                            }),
                            content_type='application/json')

  print(response.status_code)

  # Delete Test
  with app.test_client() as client:
      response = client.delete('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Head Test
  with app.test_client() as client:
      response = client.head('/users', 
                            data=json.dumps({
                              "valUserID": "1",
                            }),
                            content_type='application/json')

  print(response.status_code)

  # Get Test
  with app.test_client() as client:
      response = client.get('/users', 
                            data=json.dumps({
                            }),
                            content_type='application/json')

  print(response.get_json())

if educationalResourcesTests:

  # Get Test
  with app.test_client() as client:
      response = client.get('/educationalresources', 
                            data=json.dumps({
                              "valResourceID": "20"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Add Test 
  with app.test_client() as client:
      response = client.post('/educationalresources', 
                            data=json.dumps({
                              "valResourceID": "20",
                              "valResourceName": "TestResource",
                              "valWebsiteURL": "https://www.test.org",
                              "valResourceCategory": "FakeCategory",
                              "valResourceDescription": "Test",
                              "valPublished": "0",
                              "valDateAdded": "SYSDATE",
                              "valVotes": "2"
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test
  with app.test_client() as client:
      response = client.get('/educationalresources', 
                            data=json.dumps({
                            "valResourceID": "20", 
                            "order": ["Votes", "DESC"] 
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Delete Test
  with app.test_client() as client:
      response = client.delete('/educationalresources', 
                            data=json.dumps({
                              "valResourceID": "20",
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test
  with app.test_client() as client:
      response = client.get('/educationalresources', 
                            data=json.dumps({
                            "valResourceID": "20", 
                            "order": ["Votes", "DESC"] 
                            }),
                            content_type='application/json')

  print(response.get_json())

  # Get Test
  with app.test_client() as client:
      response = client.get('/educationalresources', 
                            data=json.dumps({
                            "order": ["Votes", "DESC"],
                            "colResourceCategory": "Any text",
                            "Distinct": "Any Value" 
                            }),
                            content_type='application/json')

  print(response.get_json())
