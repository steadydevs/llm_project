import os
import psycopg2
from langchain.tools import tool
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

def get_database_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        port=os.getenv("DB_PORT")
    )

@tool
def get_account_info(user_id: str) -> str:
    """Returns the account and profile information of the logged-in user directly from the database."""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT name, reputation, city, platforms FROM users WHERE id = %s;", (user_id,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            name, reputation, city, platforms = result
            console_list = ", ".join(platforms) if platforms else "None"
            return f"Username: {name}\nReputation: {reputation}/5.0\nLocation: {city}\nConsoles: {console_list}"
        
        return "User not found"
    except Exception as e:
        print(f"❌ [DEBUG NETPLAY] Erro crítico na ferramenta: {str(e)}")
        return f"Error accessing the database: {e}"

@tool
def search_local_games(user_id: str) -> str:
    """Searches for physical games available for trade/rent within a 10km radius of the user, excluding their own."""
    try:
        conn = get_database_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT catalog.title, catalog.platform, inventory.condition, owner.name,
            ST_Distance(owner.location, searcher.location) as distance
            FROM user_inventory AS inventory
            JOIN game_catalog AS catalog ON inventory.game_id = catalog.id
            JOIN users AS owner ON inventory.user_id = owner.id
            CROSS JOIN (SELECT location FROM users WHERE
            id='a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d') AS searcher
            WHERE inventory.status = 'AVAILABLE'
            AND owner.id != 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'
            AND ST_DWithin(owner.location, searcher.location, 10000)
            ORDER BY distance ASC;
        """, (user_id, user_id))

        games_found = cursor.fetchall()

        cursor.close()
        conn.close()

        if games_found:
            response = "Physical games available near you:\n"
            for game in games_found:
                title, platform, condition, owner, distance = game
                distance_km = round(distance / 1000, 1)
                response += f"- {title} ({platform}) | Condition: {condition} | Owner: {owner} ({distance_km}km away)\n"
            return response
        
        return "We couldn't find any physical games available near you at the moment."
    
    except Exception as e:
        print(f" [DEBUG NETPLAY] Erro crítico na ferramenta: {str(e)}")
        return f"Error during local search: {e}"
    