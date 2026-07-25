"""
Dashboard API Router — /dashboard summary endpoints
"""

from fastapi import APIRouter, Depends
from app.api.chatbot import get_current_user_id
from app.services.mood_service import mood_service
from app.services.chat_service import chat_service
from app.services.phq2_service import phq2_service
from app.core.logging import get_logger

logger = get_logger("dashboard_api")

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", summary="Get user dashboard summary metrics")
async def get_dashboard_summary(
    user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve real-time summary statistics for the authenticated user's dashboard.
    """
    today_mood_data = await mood_service.get_today_mood(user_id)
    chat_history = await chat_service.get_history(user_id, limit=100)
    phq2_history = await phq2_service.get_user_phq2_history(user_id, limit=5)

    latest_phq2 = phq2_history[0] if phq2_history else None

    return {
        "today_mood": today_mood_data["today_entry"]["mood"] if today_mood_data["has_logged_today"] else None,
        "has_logged_today": today_mood_data["has_logged_today"],
        "total_chat_messages": len(chat_history),
        "latest_phq2_score": latest_phq2["score"] if latest_phq2 else None,
        "latest_phq2_recommendation": latest_phq2["recommendation"] if latest_phq2 else None,
    }
