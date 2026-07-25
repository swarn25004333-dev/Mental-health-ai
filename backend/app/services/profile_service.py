from typing import Dict, Any, Optional
from app.database.db_helpers import fetch_record_by_id, update_record, insert_record

class ProfileService:
    """Service handling operations on the `profiles` database table."""

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return fetch_record_by_id("profiles", user_id)

    async def create_profile(self, user_id: str, full_name: str, avatar_url: Optional[str] = None, theme: str = "light") -> Optional[Dict[str, Any]]:
        data = {
            "id": user_id,
            "full_name": full_name,
            "avatar_url": avatar_url or "",
            "theme": theme
        }
        return insert_record("profiles", data)

    async def update_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return update_record("profiles", user_id, update_data)

profile_service = ProfileService()
