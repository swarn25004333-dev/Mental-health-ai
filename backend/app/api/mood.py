"""
Mood Tracker API Router — /mood endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.schemas.mood import (
    MoodLogRequest,
    MoodEntryResponse,
    TodayMoodResponse,
    MoodHistoryResponse
)
from app.services.mood_service import mood_service
from app.services.mood_history_service import mood_history_service
from app.api.chatbot import get_current_user_id
from app.core.logging import get_logger

logger = get_logger("mood_api")

router = APIRouter(prefix="/mood", tags=["Mood Tracker"])


@router.post("/log", response_model=MoodEntryResponse, summary="Log daily mood")
async def log_mood(
    request: MoodLogRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Log a new mood entry with an optional note for the authenticated user.
    """
    try:
        entry = await mood_service.log_mood(
            user_id=user_id,
            mood=request.mood,
            note=request.note
        )
        return MoodEntryResponse(**entry)
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        logger.error(f"Error logging mood for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to log mood entry.")


@router.get("/today", response_model=TodayMoodResponse, summary="Get today's mood entry")
async def get_today_mood(
    user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve today's logged mood entry if available.
    """
    try:
        result = await mood_service.get_today_mood(user_id=user_id)
        if result["has_logged_today"] and result["today_entry"]:
            return TodayMoodResponse(
                has_logged_today=True,
                today_entry=MoodEntryResponse(**result["today_entry"])
            )
        return TodayMoodResponse(has_logged_today=False, today_entry=None)
    except Exception as e:
        logger.error(f"Error fetching today's mood for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve today's mood.")


@router.get("/history", response_model=MoodHistoryResponse, summary="Get user mood history")
async def get_mood_history(
    days: Optional[int] = Query(default=None, description="Filter history by last N days (e.g. 7, 30)"),
    limit: int = Query(default=200, ge=1, le=500),
    user_id: str = Depends(get_current_user_id)
):
    """
    Fetch past mood entries for the authenticated user ordered newest first.
    Optionally filter by last N days.
    """
    try:
        records = await mood_service.get_user_mood_history(user_id=user_id, days=days, limit=limit)
        items = []
        for r in records:
            try:
                items.append(MoodEntryResponse(**r))
            except Exception as parse_err:
                logger.warning(f"Skipping malformed mood record: {parse_err}")
        return MoodHistoryResponse(history=items, count=len(items))
    except Exception as e:
        logger.error(f"Error fetching mood history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve mood history.")


@router.delete("/history/{entry_id}", summary="Delete a mood entry")
async def delete_mood_entry(
    entry_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Delete a specific mood entry owned by the user.
    """
    try:
        success = await mood_history_service.delete_mood_entry(entry_id, user_id)
        if success:
            return {"success": True, "message": "Mood entry deleted."}
        raise HTTPException(status_code=404, detail="Mood entry not found.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting mood entry {entry_id} for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete mood entry.")
