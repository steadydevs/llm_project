from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.chat_routes import router as chat_router

app = FastAPI(title="NetPlay P2P Matcher API", version="1.0.0")


origins =[
    "https://llm-project-tau.vercel.app/", 
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "NetPlay API is up and running!"}