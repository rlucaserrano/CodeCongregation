import oracledb
from config import Config

class Database:
    # Establishes a connection with the database.
    @staticmethod 
    def GetConnection():
        try:
            return oracledb.connect(
                user=Config.ORACLE_USER,
                password=Config.ORACLE_PASSWORD,
                dsn=f"{Config.ORACLE_HOST}:{Config.ORACLE_PORT}/{Config.ORACLE_SID}"
            )
        except oracledb.DatabaseError as e:
            print(f"Database connection error: {str(e)}")
            raise e

    # Conducts a selection query.
    @staticmethod 
    def SelectQuery(userQuery):
        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute(userQuery)
        selectedRows = cursor.fetchall()
        cursor.close()
        connection.close()
        return selectedRows

    # Alters the database (insert, delete, or modify).
    @staticmethod 
    def AlterQuery(userQuery):
        connection = Database.GetConnection()
        cursor = connection.cursor()
        cursor.execute(userQuery)
        connection.commit()
        cursor.close()
        connection.close()

    # Searches the database.
    @staticmethod 
    def SearchDatabase(table, columns=None, rows=None):
        columnString = ", ".join(columns) if columns else "*"
        rowString = f" WHERE {rows}" if rows else ""
        return Database.SelectQuery(f"SELECT {columnString} FROM {table}{rowString}")

    # Inserts an entry into a database table.
    @staticmethod
    def AddToDatabase(table, entry):
        attributeString = ", ".join(entry)
        try:
            Database.AlterQuery(f"INSERT INTO {table} VALUES ({attributeString})")
            return True
        except Exception as e:
            print(f"Error adding to database: {e}")
            return False
    
    # Removes an entry from a database table.
    @staticmethod
    def RemoveFromDatabase(table, key, value):
        try:
            Database.AlterQuery(f"DELETE FROM {table} WHERE {key} = '{value}'")
            return True
        except Exception as e:
            print(f"Error removing from database: {e}")
            return False

    # Modifies an existing entry in a database table.
    @staticmethod
    def ModifyDatabase(table, key, value, changes):
        changesString = ", ".join([f"{col} = {val}" for col, val in changes])
        try:
            Database.AlterQuery(f"UPDATE {table} SET {changesString} WHERE {key} = {value}")
            return True
        except Exception as e:
            print(f"Error updating database: {e}")
            return False
