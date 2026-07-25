from typing import Dict, Any, List, Optional
from app.database.db_helpers import insert_record, fetch_records_by_user

class Phq2Service:
    """Service handling operations on the `phq2_results` database table."""

    async def save_phq2_result(
        self, user_id: str, question1: int, question2: int, custom_recommendation: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        score = question1 + question2
        
        # Generate default recommendation based on PHQ-2 clinical cutoff (Score >= 3 warrants evaluation)
        if custom_recommendation:
            recommendation = custom_recommendation
        elif score >= 3:
            recommendation = "Score indicates possible depressive symptoms. A professional medical or psychological evaluation is recommended."
        else:
            recommendation = "Score indicates low risk. Continue maintaining healthy routine and self-care practices."

        data = {
            "user_id": user_id,
            "question1": question1,
            "question2": question2,
            "score": score,
            "recommendation": recommendation
        }
        return insert_record("phq2_results", data)

    async def get_user_phq2_history(self, user_id: str, limit: Optional[int] = 20) -> List[Dict[str, Any]]:
        return fetch_records_by_user("phq2_results", user_id, order_by="created_at", descending=True, limit=limit)

phq2_service = Phq2Service()
