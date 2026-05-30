from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat_routes import router as chat_router


app = FastAPI(title="NetPlay P2P Matcher API", version="1.0.0")

origins = [
    "https://llm-project-tau.vercel.app",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"], 
)

@app.middleware("http")
async def debug_cors(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"DEBUG: Requisição vindo de: {origin}")
    response = await call_next(request)
    return response

@app.get("/")
def read_root():
    return {"message": "NetPlay API is up and running!"}

app.include_router(chat_router, prefix="/api")
