import unittest
from unittest.mock import patch, MagicMock
from flask import jsonify
from users import Users
import sys
import os

# Add the directory containing 'database.py' and 'proc_and_sec.py' to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class UsersTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_initialization(self):
        data = {
            "valUserID": "1",
            "valUserName": "testuser",
            "valEmail": "test@example.com",
            "valHashedPassword": "hashedpassword",
            "valFirstName": "Test",
            "valLastName": "User",
            "valBio": "This is a bio.",
            "valAdmin": "0",
            "Order": ["UserName", "ASC"],
            "Distinct": "UserID"
        }
        user = Users(data)
        self.assertEqual(user.valUserID, "1")
        self.assertEqual(user.valUserName, "testuser")
        self.assertEqual(user.valEmail, "test@example.com")
        self.assertEqual(user.valHashedPassword, "hashedpassword")
        self.assertEqual(user.valFirstName, "Test")
        self.assertEqual(user.valLastName, "User")
        self.assertEqual(user.valBio, "This is a bio.")
        self.assertEqual(user.valAdmin, "0")
        self.assertEqual(user.order, ["UserName", "ASC"])
        self.assertEqual(user.distinct, "UserID")

    @patch('users.ProcAndSec')
    def test_process_valid_input(self, mock_proc_and_sec):
        mock_proc_and_sec.CheckValidString.return_value = True

        data = {
            "valUserID": "1",
            "valUserName": "testuser",
            "valFirstName": "Test",
            "valLastName": "User",
            "valBio": "This is a bio.",
            "valAdmin": "0",
            "Order": ["UserName", "ASC"],
            "Distinct": "UserID"
        }
        user = Users(data)
        result = user.Process()
        self.assertIsNone(result)
        self.assertEqual(mock_proc_and_sec.CheckValidString.call_count, 7)

    @patch('users.Database')
    def test_get_user_success(self, mock_database):
        mock_database.SearchDatabase.return_value = [{"UserID": "1", "UserName": "testuser"}]

        data = {
            "valUserID": "1",
            "colUserID": True,
            "colUserName": True
        }
        user = Users(data)
        response, status_code = user.Methods("GET")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, [{"UserID": "1", "UserName": "testuser"}])

        mock_database.SearchDatabase.assert_called_with(
            table="UserTable",
            columns=["UserID", "UserName"],
            rows="UserID = '1'",
            order=None,
            distinct=None
        )

    def test_get_user_invalid_parameters(self):
        data = {
            "valHashedPassword": "hashedpassword"
        }
        user = Users(data)
        response, status_code = user.Methods("GET")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "GET method does not accept parameters for HashedPassword, FirstName, LastName, or Bio"
        })

    @patch('users.Database')
    @patch('users.ProcAndSec')
    def test_add_user_success(self, mock_proc_and_sec, mock_database):
        mock_proc_and_sec.CheckEmailFormat.return_value = True
        mock_proc_and_sec.HashAndSalt.return_value = "hashedpassword"

        mock_database.SearchDatabase.return_value = []

        mock_database.AddToDatabase.return_value = True

        data = {
            "valUserID": "1",
            "valUserName": "newuser",
            "valEmail": "newuser@example.com",
            "valHashedPassword": "password",
            "valAdmin": "0",
            "valFirstName": "New",
            "valLastName": "User",
            "valBio": "New user bio."
        }
        user = Users(data)
        response, status_code = user.Methods("POST")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "User added"})

        mock_proc_and_sec.HashAndSalt.assert_called_with("password")

        mock_database.AddToDatabase.assert_called_with(
            table="UserTable",
            entry=[
                "1", "'newuser'", "'newuser@example.com'", "'hashedpassword'",
                "'New'", "'User'", "'New user bio.'", "0"
            ]
        )

    def test_add_user_missing_fields(self):
        data = {
            "valUserName": "newuser"
        }
        user = Users(data)
        response, status_code = user.Methods("POST")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "POST method requires UserID, UserName, Email, HashedPassword, and Admin parameters"
        })

    @patch('users.Database')
    def test_update_user_success(self, mock_database):
        mock_database.SearchDatabase.return_value = []

        mock_database.ModifyDatabase.return_value = True

        data = {
            "valUserID": "1",
            "valUserName": "updateduser",
            "valEmail": "updated@example.com",
            "valFirstName": "Updated",
            "valLastName": "User",
            "valBio": "Updated bio."
        }
        user = Users(data)
        response, status_code = user.Methods("PATCH")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "User modified"})

        mock_database.ModifyDatabase.assert_called_with(
            table="UserTable",
            key="UserID",
            value="1",
            changes=[
                ("UserName", "'updateduser'"),
                ("Email", "'updated@example.com'"),
                ("FirstName", "'Updated'"),
                ("LastName", "'User'"),
                ("Bio", "'Updated bio.'")
            ]
        )

    def test_update_user_no_user_id(self):
        data = {
            "valUserName": "updateduser"
        }
        user = Users(data)
        response, status_code = user.Methods("PATCH")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "PATCH method requires UserID parameter"
        })

    @patch('users.Database')
    def test_delete_user_success(self, mock_database):
        mock_database.SearchDatabase.return_value = [{"UserID": "1"}]

        mock_database.RemoveFromDatabase.return_value = True

        data = {
            "valUserID": "1"
        }
        user = Users(data)
        response, status_code = user.Methods("DELETE")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "User deleted"})

        mock_database.RemoveFromDatabase.assert_called_with("UserTable", "UserID", "1")

    def test_delete_user_no_user_id(self):
        data = {}
        user = Users(data)
        response, status_code = user.Methods("DELETE")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "DELETE method requires UserID parameter"
        })

    @patch('users.Database')
    def test_check_for_user_exists(self, mock_database):
        mock_database.SearchDatabase.return_value = [{"UserID": "1"}]

        data = {
            "valUserID": "1"
        }
        user = Users(data)
        response, status_code = user.Methods("HEAD")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"Result": "Valid UserID"})

    @patch('users.Database')
    def test_check_for_user_not_exists(self, mock_database):
        mock_database.SearchDatabase.return_value = []

        data = {
            "valUserID": "1"
        }
        user = Users(data)
        response, status_code = user.Methods("HEAD")
        self.assertEqual(status_code, 404)
        self.assertEqual(response.json, {"Result": "Invalid UserID"})

    def test_options_method(self):
        data = {}
        user = Users(data)
        response, status_code = user.Methods("OPTIONS")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"Options": "GET, POST, DELETE, HEAD, PATCH, OPTIONS"})

if __name__ == '__main__':
    unittest.main()
