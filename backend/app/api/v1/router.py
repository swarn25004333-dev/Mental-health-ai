from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.chatbot import router as chatbot_router
from app.api.dashboard import router as dashboard_router
from app.api.mood import router as mood_router
from app.api.questionnaire import router as questionnaire_router
from app.api.history import router as history_router
from app.api.emergency import router as emergency_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(chatbot_router)
api_router.include_router(dashboard_router)
api_router.include_router(mood_router)
api_router.include_router(questionnaire_router)
api_router.include_router(history_router)
api_router.include_router(emergency_router)

@api_router.get("/status")
def get_status():
    return {"status": "API v1 active", "version": "1.0.0"}
