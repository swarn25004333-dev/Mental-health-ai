from fastapi import APIRouter

router = APIRouter(prefix="/history", tags=["User History"])

@router.get("/chats")
def get_chat_history():
    return {"chats": []}

@router.get("/chats/{chat_id}")
def get_chat_detail(chat_id: str):
    return {"chat_id": chat_id, "messages": []}
