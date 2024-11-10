import unittest
from unittest.mock import patch, MagicMock
from flask import jsonify
from group_resources import GroupResources
import sys
import os

# Add the directory containing 'database.py' and 'proc_and_sec.py' to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class GroupResourcesTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_initialization(self):
        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10",
            "valResourceName": "Test Resource",
            "valWebsiteURL": "http://example.com",
            "valResourceCategory": "Category1",
            "valDescription": "Test Description",
            "valPublicShare": "1",
            "valDateAdded": "2023-10-05",
            "valDisplayOrder": "1",
            "Order": ["ResourceName", "ASC"],
            "Distinct": "GroupID",
            "switch": "GET"
        }
        resource = GroupResources(data)
        self.assertEqual(resource.valGroupID, "1")
        self.assertEqual(resource.valGroupResourceID, "10")
        self.assertEqual(resource.valResourceName, "Test Resource")
        self.assertEqual(resource.valWebsiteURL, "http://example.com")
        self.assertEqual(resource.valResourceCategory, "Category1")
        self.assertEqual(resource.valResourceDescription, "Test Description")
        self.assertEqual(resource.valPublicShare, "1")
        self.assertEqual(resource.valDateAdded, "2023-10-05")
        self.assertEqual(resource.valDisplayOrder, "1")
        self.assertEqual(resource.order, ["ResourceName", "ASC"])
        self.assertEqual(resource.distinct, "GroupID")
        self.assertEqual(resource.switch, "GET")

    @patch('group_resources.ProcAndSec')
    def test_process_valid_input(self, mock_proc_and_sec):
        mock_proc_and_sec.CheckValidString.return_value = True
        mock_proc_and_sec.CheckWebsiteURLFormat.return_value = True

        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10",
            "valResourceName": "Test Resource",
            "valWebsiteURL": "http://example.com",
            "valResourceCategory": "Category1",
            "valDescription": "Test Description",
            "valPublicShare": "1",
            "valDateAdded": "2023-10-05",
            "valDisplayOrder": "1",
        }
        resource = GroupResources(data)
        result = resource.Process()
        self.assertIsNone(result)
        self.assertTrue(mock_proc_and_sec.CheckValidString.called)
        self.assertTrue(mock_proc_and_sec.CheckWebsiteURLFormat.called)

    @patch('group_resources.Database')
    def test_get_resource_success(self, mock_database):
        mock_database.SearchDatabase.return_value = [
            {"GroupID": "1", "GroupResourceID": "10", "ResourceName": "Test Resource"}
        ]

        data = {
            "valGroupID": "1",
            "colGroupID": True,
            "colGroupResourceID": True,
            "colResourceName": True,
            "switch": "GET"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("GET")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, [
            {"GroupID": "1", "GroupResourceID": "10", "ResourceName": "Test Resource"}
        ])

        mock_database.SearchDatabase.assert_called_with(
            table="MGOLAN.GroupResources",
            columns=["GroupID", "GroupResourceID", "ResourceName"],
            rows="GroupID = '1'",
            order=None,
            distinct=None
        )

    def test_get_resource_missing_group_id(self):
        data = {
            "switch": "GET"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("GET")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "POST method does not take column parameters"
        })

    @patch('group_resources.Database')
    @patch('group_resources.ProcAndSec')
    def test_add_resource_success(self, mock_proc_and_sec, mock_database):
        mock_proc_and_sec.CheckValidString.return_value = True
        mock_proc_and_sec.CheckWebsiteURLFormat.return_value = True

        mock_database.SearchDatabase.return_value = []

        mock_database.AddToDatabase.return_value = True

        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10",
            "valResourceName": "New Resource",
            "valWebsiteURL": "http://example.com",
            "valResourceCategory": "Category1",
            "valPublicShare": "1",
            "valDateAdded": "2023-10-05",
            "valDisplayOrder": "1",
            "valDescription": "Resource Description"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("POST")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "Resource added"})

        mock_database.AddToDatabase.assert_called_with(
            table="MGOLAN.GroupResources",
            entry=[
                "1",
                "10",
                "'New Resource'",
                "'http://example.com'",
                "'Category1'",
                "'Resource Description'",
                "1",
                "2023-10-05",
                "1"
            ]
        )

    def test_add_resource_missing_fields(self):
        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10",
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("POST")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "POST method requires GroupID, GroupResourceID, ResourceName, WebsiteURL, ResourceCategory, PublicShare, DateAdded, and DisplayOrder parameters"
        })

    @patch('group_resources.Database')
    def test_update_resource_success(self, mock_database):
        mock_database.SearchDatabase.return_value = []

        mock_database.ModifyDatabase.return_value = True

        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10",
            "valResourceName": "Updated Resource",
            "valWebsiteURL": "http://updated.com",
            "valResourceCategory": "Category2",
            "valDescription": "Updated Description"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("PATCH")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "Resource modified"})

        mock_database.ModifyDatabase.assert_called_with(
            table="MGOLAN.GroupResources",
            key1="GroupID",
            value1="1",
            key2="GroupResourceID",
            value2="10",
            changes=[
                ("ResourceName", "'Updated Resource'"),
                ("WebsiteURL", "'http://updated.com'"),
                ("ResourceCategory", "'Category2'"),
                ("ResourceDescription", "'Updated Description'")
            ]
        )

    def test_update_resource_missing_ids(self):
        data = {
            "valResourceName": "Updated Resource"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("PATCH")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "PATCH method requires GroupID and GroupResourceID parameters"
        })

    @patch('group_resources.Database')
    def test_delete_resource_success(self, mock_database):
        mock_database.SearchDatabase.return_value = [{"GroupID": "1", "GroupResourceID": "10"}]

        mock_database.RemoveFromDatabase.return_value = True

        data = {
            "valGroupID": "1",
            "valGroupResourceID": "10"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("DELETE")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, {"SUCCESS": "Resource deleted"})

        mock_database.RemoveFromDatabase.assert_called_with(
            table="MGOLAN.GroupResources",
            key1="GroupID",
            value1="1",
            key2="GroupResourceID",
            value2="10"
        )

    def test_delete_resource_missing_ids(self):
        data = {
            "valGroupID": "1"
        }
        resource = GroupResources(data)
        response, status_code = resource.Methods("DELETE")
        self.assertEqual(status_code, 400)
        self.assertEqual(response.json, {
            "ERROR": "DELETE method requires GroupID and GroupResourceID parameters"
        })

if __name__ == '__main__':
    unittest.main()
