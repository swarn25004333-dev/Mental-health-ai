from typing import Dict, Any, List, Optional
from app.database.db_helpers import insert_record, fetch_records_by_user, delete_record

class ChatHistoryService:
    """Service handling operations on the `chat_history` database table."""

    async def save_chat_message(self, user_id: str, user_message: str, ai_response: str) -> Optional[Dict[str, Any]]:
        data = {
            "user_id": user_id,
            "user_message": user_message,
            "ai_response": ai_response
        }
        return insert_record("chat_history", data)

    async def get_user_chat_history(self, user_id: str, limit: Optional[int] = 50) -> List[Dict[str, Any]]:
        return fetch_records_by_user("chat_history", user_id, order_by="created_at", descending=True, limit=limit)

    async def delete_chat_message(self, chat_id: str, user_id: str) -> bool:
        return delete_record("chat_history", chat_id, user_id)

chat_history_service = ChatHistoryService()
