import oracledb
from config import Config

# Educational sources used to setup database.py 
# 1. https://python-oracledb.readthedocs.io/en/latest/api_manual/cursor.html#
# 2. https://python-oracledb.readthedocs.io/en/latest/user_guide/sql_execution.html

class Database:
        
    #========== Called internally in database.py ==========#

    # Establishes a connection with the database.
    @staticmethod 
    def GetConnection():
        return oracledb.connect(user=Config.ORACLE_USER, password=Config.ORACLE_PASSWORD, dsn=f"{Config.ORACLE_HOST}:{Config.ORACLE_PORT}/{Config.ORACLE_SID}")

    # Conducts a selection query
    @staticmethod 
    def SelectQuery(userQuery):
        # Open connection and establish cursor
        connection = Database.GetConnection()
        cursor = connection.cursor()

        # Excutes user query
        cursor.execute(userQuery)

        # Collect all selected rows
        selectedRows = cursor.fetchall()

        # Close cursor and connection
        cursor.close()
        connection.close()

        return selectedRows

    # Alters the database (insert, delete, or modify)
    @staticmethod 
    def AlterQuery(userQuery):
        # Open connection and establish cursor
        connection = Database.GetConnection()
        cursor = connection.cursor()

        # Makes changes to database and commits changes
        cursor.execute(userQuery)
        connection.commit()


        # Close cursor and connection
        cursor.close()
        connection.close()

    #========== Called by main.py ==========#

    # Searches database
    @staticmethod 
    def SearchDatabase(table, columns=None, rows=None):
        
        # Generates columns to be searched.
        columnString = ""
        if columns:
            for c in columns:
                columnString = columnString + c + ", "
            columnString = columnString[:-2]
        else:
            columnString = "*"
        
        # Generates rows to be searched,
        if rows:
            rowString = " WHERE " + rows
        else:
            rowString = ""
        
        # Returns result from internal function
        return Database.SelectQuery(f"SELECT {columnString} FROM {table}{rowString}")

    # Inserts entry into database table.
    @staticmethod
    def AddToDatabase(table, entry):
        # Creates list of attributes for insert query.
        attributeString = ""
        for e in entry:
            attributeString = attributeString + e + ", "
        attributeString = attributeString[:-2]

        # Attempts to insert entry into table. Returns result.
        try:
            Database.AlterQuery(f"INSERT INTO {table} VALUES ({attributeString})")
            return(f"Success! Entry added to {table}.")
        except Exception as e:
            return(f"Error! Entry not added to {table}.")
    
    # Removes entry from database table.
    @staticmethod
    def RemoveFromDatabase(table, key, value):
        # Attempts to remove entry from table. Returns result.
        try:
            Database.AlterQuery(F"DELETE FROM {table} WHERE {key} = '{value}'")
            return(f"Success! Entry removed from {table}.")
        except Exception as e:
            return(f"Error! Entry not removed from {table}.")

    # Modifies existing entry in database table
    @staticmethod
    def ModifyDatabase(table, key, value, changes):
        # Creates a string of attribute changes.
        changesString = ""
        for c in changes:
            changesString = changesString + c[0] + " = " + c[1] + ", "
        changesString = changesString[:-2]

        # Attempts to update entry into table. Returns result.
        try:
            Database.AlterQuery(f"UPDATE {table} SET {changesString} WHERE {key} = {value}")
            return(f"Success! Entry updated in {table}.")
        except Exception as e:
            return(f"Error! Entry not updated in {table}.")

        
        


        

