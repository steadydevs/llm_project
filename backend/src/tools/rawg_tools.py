import os
import httpx
from langchain.tools import tool
from dotenv import load_dotenv

load_dotenv()

RAWG_BASE_URL = "https://api.rawg.io/api"

def get_rawg_api_key():
    api_key = os.getenv("RAWG_API_KEY")

    if not api_key:
        raise RuntimeError("RAWG_API_KEY não está configurada.")
    return api_key

# Use esta ferramenta sempre que o usuário pedir detalhes sobre jogos de videogame, datas de lançamento, plataformas disponíveis ou notas de avaliação. Requer o nome do jogo.

@tool
def search_rawg_games(query: str):
    """Searches for video games in the RAWG database by title, platform, and other details."""
    
    print(f"[RAWG] Buscando RAWG para: {query}", flush=True)

    params = {
        "search": query,
        "key": get_rawg_api_key(),
        "page_size": 5
    }
    response = httpx.get(f"{RAWG_BASE_URL}/games"
                         ,params=params
                         ,timeout=10)
    response.raise_for_status()
    data = response.json()

    results = data.get("results", [])
    if not results:
        return "Nenhum jogo encontrado na API RAWG para essa busca."
    
    output = "[RAWG API] RAWG games found:\n"
    for item in results:
        name = item.get("name")
        released = item.get("released", "desconhecido")
        rating = item.get("rating", "N/A")
        platforms = ", ".join([p["platform"]["name"] for p in item.get("platforms", []) if p.get("platform")]) or "N/A"
        output += f"- {name} | Released: {released} | Rating: {rating} | Platforms: {platforms}\n"

    return output
