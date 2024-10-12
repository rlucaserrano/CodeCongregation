import json
from main import app

# Add Test (Success)
with app.test_client() as client:
    response = client.post('/users', 
                          data=json.dumps({
                            "UserID": "1",
                            "UserName": "GatorFan1",
                            "Email": "Fake1@Gmail.com",
                            "HashedPassword": "FakePassword1",
                            "Admin": "0",
                            "FirstName": "First",
                            "LastName": "Last",
                            "Bio": "Bio"

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
                            "UserID": "1",
                            "UserName": "GatorFan1",
                            "Email": "Fake1@Gmail.com",
                            "HashedPassword": "FakePassword1",
                            "Admin": "0"
                          }),
                          content_type='application/json')

print(response.get_json())

# Add Test (Failure 3)
with app.test_client() as client:
    response = client.post('/users', 
                          data=json.dumps({
                            "UserID": "2",
                            "UserName": "GatorFan1",
                            "Email": "Fake1@Gmail.com",
                            "HashedPassword": "FakePassword1",
                            "Admin": "0"
                          }),
                          content_type='application/json')

print(response.get_json())

# Add Test (Failure 4)
with app.test_client() as client:
    response = client.post('/users', 
                          data=json.dumps({
                            "UserID": "2",
                            "UserName": "GatorFan2",
                            "Email": "Fake1@Gmail.com",
                            "HashedPassword": "FakePassword1",
                            "Admin": "0"
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

# Modify Test (Failure - Nothing to modify)
with app.test_client() as client:
    response = client.patch('/users', 
                          data=json.dumps({
                            "UserID": "1",
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
                            "UserID": "1",
                            "HashedPassword": "FakePassword1!",
                            "Admin": "1",
                            "Bio": "Now we have a bio!"
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
                            "UserID": "1",
                          }),
                          content_type='application/json')

print(response.status_code)

# Delete Test
with app.test_client() as client:
    response = client.delete('/users', 
                          data=json.dumps({
                            "UserID": "1",
                          }),
                          content_type='application/json')

print(response.get_json())

# Head Test
with app.test_client() as client:
    response = client.head('/users', 
                          data=json.dumps({
                            "UserID": "1",
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