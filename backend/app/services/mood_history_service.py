from typing import Dict, Any, List, Optional
from app.database.db_helpers import insert_record, fetch_records_by_user, delete_record

class MoodHistoryService:
    """Service handling operations on the `mood_history` database table."""

    async def log_mood_entry(self, user_id: str, mood: str, note: Optional[str] = None) -> Optional[Dict[str, Any]]:
        data = {
            "user_id": user_id,
            "mood": mood,
            "note": note or ""
        }
        return insert_record("mood_history", data)

    async def get_user_mood_history(self, user_id: str, limit: Optional[int] = 30) -> List[Dict[str, Any]]:
        return fetch_records_by_user("mood_history", user_id, order_by="created_at", descending=True, limit=limit)

    async def delete_mood_entry(self, entry_id: str, user_id: str) -> bool:
        return delete_record("mood_history", entry_id, user_id)

mood_history_service = MoodHistoryService()
