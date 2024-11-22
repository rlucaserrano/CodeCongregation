import oracledb
import psycopg2
from psycopg2 import sql
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
        # try:
        #     connection = psycopg2.connect(
        #     dbname=Config.POSTGRES_DB,
        #     user=Config.POSTGRES_USER,
        #     password=Config.POSTGRES_PASSWORD,
        #     host=Config.POSTGRES_HOST,
        #     port=Config.POSTGRES_PORT
        # )
        #     print(f"Connected to the PostgreSQL database at {Config.POSTGRES_HOST}:{Config.POSTGRES_PORT}/{Config.POSTGRES_DB}")
        # except Exception as e:
           # print(f"Failed to connect to PostgreSQL: {e}")
         #   raise
        # except Exception as e:
        #     print(f"Error connecting to the PostgreSQL database: {e}")
        #     raise

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
        print(userQuery)
        cursor.execute(userQuery)
        connection.commit()



        # Close cursor and connection
        cursor.close()
        connection.close()

    #========== Called by main.py ==========#

    # Searches database
    @staticmethod 
    def SearchDatabase(table, columns=None, rows=None, order=None, distinct=None):
        
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
        
        distinctString = ""
        if distinct is not None:
            distinctString = "DISTINCT "

        orderString = ""
        if order is not None:
            orderString = f" ORDER BY {order[0]} {order[1]}"
        # Returns result from internal function
        print(f"SELECT {distinctString}{columnString} FROM {table}{rowString}{orderString}")
        return Database.SelectQuery(f"SELECT {distinctString}{columnString} FROM {table}{rowString}{orderString}")

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
            return(True)
        except Exception as e:
            errorMessage = str(e)
            return(False)
    
    # Removes entry from database table.
    @staticmethod
    def RemoveFromDatabase(table, key1, value1, key2=None, value2=None):
       
        if (key2 is None):
        # Attempts to remove entry from table. Returns result.
            try:
                Database.AlterQuery(F"DELETE FROM {table} WHERE {key1} = '{value1}'")
                return(True)
            except Exception as e:
                return(False)
        else:
            try:
                Database.AlterQuery(F"DELETE FROM {table} WHERE {key1} = '{value1}' AND {key2} = '{value2}'")
                return(True)
            except Exception as e:
                return(False)


    # Modifies existing entry in database table
    @staticmethod
    def ModifyDatabase(table, key1, value1, changes, key2=None, value2=None):
        # Creates a string of attribute changes.
        changesString = ""
        for c in changes:
            changesString = changesString + c[0] + " = " + c[1] + ", "
        changesString = changesString[:-2]

        # Attempts to update entry into table. Returns result.
        if (key2 is None):
            try:
                Database.AlterQuery(f"UPDATE {table} SET {changesString} WHERE {key1} = '{value1}'")
                return(True)
            except Exception as e:
                return(False)
        else:
            try:
                Database.AlterQuery(f"UPDATE {table} SET {changesString} WHERE {key1} = '{value1}' AND {key2} = '{value2}'")
                return(True)
            except Exception as e:
                return(False)
    
    @staticmethod
    def TestConnection():
        try:
            connection = Database.GetConnection()
            print("Database connection successful.")
            connection.close()
        except Exception as e:
            print("Database connection failed:", e)
            raise e
        
        

