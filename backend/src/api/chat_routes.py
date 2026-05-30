from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.agents.game_agent import get_game_agent_executor

router = APIRouter()
agent_executor = get_game_agent_executor()

class ChatRequest(BaseModel):
    input: str
    user_id: str

@router.post("/chat")
async def handle_chat_message(request: ChatRequest):
    try:
        result = agent_executor.invoke({
            "input": request.input,
            "user_id": request.user_id
        })
        return {"response": result["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))