"""
Mood Service — Business logic for mood tracking and retrieval.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
from app.services.mood_history_service import mood_history_service
from app.core.logging import get_logger

logger = get_logger("mood_service")

VALID_MOODS = {"happy", "sad", "stressed", "calm", "anxious", "tired"}


class MoodService:
    """Business logic for logging and retrieving user mood entries."""

    async def log_mood(
        self,
        user_id: str,
        mood: str,
        note: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Log a new mood entry for the user into Supabase mood_history.
        """
        mood_clean = mood.strip().lower()
        if mood_clean not in VALID_MOODS:
            raise ValueError(f"Invalid mood '{mood}'. Must be one of: {', '.join(VALID_MOODS)}")

        entry = await mood_history_service.log_mood_entry(
            user_id=user_id,
            mood=mood_clean,
            note=note
        )

        logger.info(f"Logged mood '{mood_clean}' for user {user_id}")
        return entry or {
            "id": "temp-id",
            "user_id": user_id,
            "mood": mood_clean,
            "note": note or "",
            "created_at": datetime.now(timezone.utc).isoformat()
        }

    async def get_today_mood(self, user_id: str) -> Dict[str, Any]:
        """
        Check if the user has logged a mood today and return the latest entry.
        """
        history = await mood_history_service.get_user_mood_history(user_id, limit=10)
        if not history:
            return {"has_logged_today": False, "today_entry": None}

        today_date = datetime.now(timezone.utc).date()

        for entry in history:
            created_at_str = entry.get("created_at")
            if created_at_str:
                try:
                    if isinstance(created_at_str, str):
                        entry_dt = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                    elif isinstance(created_at_str, datetime):
                        entry_dt = created_at_str
                    else:
                        continue

                    if entry_dt.date() == today_date:
                        return {
                            "has_logged_today": True,
                            "today_entry": entry
                        }
                except Exception as e:
                    logger.warning(f"Failed to parse created_at for entry {entry.get('id')}: {e}")

        return {"has_logged_today": False, "today_entry": None}

    async def get_user_mood_history(
        self,
        user_id: str,
        days: Optional[int] = None,
        limit: int = 200
    ) -> List[Dict[str, Any]]:
        """
        Retrieve user mood history ordered by date descending.
        Optionally filter entries within the last N days.
        """
        records = await mood_history_service.get_user_mood_history(user_id, limit=limit)
        if not days or days <= 0:
            return records

        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        filtered = []

        for entry in records:
            created_at_str = entry.get("created_at")
            if not created_at_str:
                filtered.append(entry)
                continue

            try:
                if isinstance(created_at_str, str):
                    dt = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                elif isinstance(created_at_str, datetime):
                    dt = created_at_str
                else:
                    dt = None

                if dt and dt >= cutoff_date:
                    filtered.append(entry)
            except Exception:
                filtered.append(entry)

        return filtered


mood_service = MoodService()
