from typing import Dict, Any

class DashboardService:
    """
    Dashboard analytics aggregation placeholder.
    """
    async def get_dashboard_summary(self, user_id: str) -> Dict[str, Any]:
        return {
            "today_mood": "Calm",
            "streak_days": 5,
            "total_chat_sessions": 12,
            "phq2_status": "Low Risk"
        }

dashboard_service = DashboardService()
