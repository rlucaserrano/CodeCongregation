import oracledb
from config import Config

# Educational sources used to setup database.py 
# 1. https://python-oracledb.readthedocs.io/en/latest/api_manual/cursor.html#
# 2. https://python-oracledb.readthedocs.io/en/latest/user_guide/sql_execution.html

class Database:
    
    @staticmethod
    def get_connection():
        return oracledb.connect(user=Config.ORACLE_USER, password=Config.ORACLE_PASSWORD, dsn=f"{Config.ORACLE_HOST}:{Config.ORACLE_PORT}/{Config.ORACLE_SID}")

    @staticmethod
    def select_query(query, params=None):
        connection = Database.get_connection()
        cursor = connection.cursor()
        cursor.execute(query, params or ())
        results = cursor.fetchall()
        cursor.close()
        connection.close()
        return results

    @staticmethod
    def alter_query(query, params=None):
        connection = Database.get_connection()
        cursor = connection.cursor()
        cursor.execute(query, params or ())
        connection.commit()
        cursor.close()
        connection.close()

    
    @staticmethod
    def insert(table, values):
        placeholders = ', '.join([':1'] * len(values))
        query = f"INSERT INTO {table} VALUES ({placeholders})"
        Database.alter_query(query, values)

    @staticmethod
    def update(table, set_values, condition):
        set_clause = ', '.join([f"{key} = :{i+1}" for i, key in enumerate(set_values.keys())])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        Database.alter_query(query, list(set_values.values()))

    @staticmethod
    def delete(table, condition):
        query = f"DELETE FROM {table} WHERE {condition}"
        Database.alter_query(query)