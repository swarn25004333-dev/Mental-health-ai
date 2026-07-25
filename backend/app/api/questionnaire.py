"""
Questionnaire API Router — /questionnaire endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.phq2 import Phq2SubmitRequest, Phq2ResultResponse, Phq2HistoryResponse
from app.services.phq2_service import phq2_service
from app.api.chatbot import get_current_user_id
from app.core.logging import get_logger

logger = get_logger("questionnaire_api")

router = APIRouter(prefix="/questionnaire", tags=["Questionnaire & Assessments"])


@router.post("/phq-2", response_model=Phq2ResultResponse, summary="Submit PHQ-2 Screening")
async def submit_phq2(
    request: Phq2SubmitRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Process and save a user's PHQ-2 assessment score and generate clinical recommendation.
    """
    try:
        result = await phq2_service.save_phq2_result(
            user_id=user_id,
            question1=request.question1,
            question2=request.question2
        )
        if not result:
            raise HTTPException(status_code=500, detail="Failed to save assessment result.")
        return Phq2ResultResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting PHQ-2 for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process PHQ-2 submission.")


@router.get("/phq-2/history", response_model=Phq2HistoryResponse, summary="Get PHQ-2 Assessment History")
async def get_phq2_history(
    user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve all past PHQ-2 assessments for the authenticated user.
    """
    try:
        records = await phq2_service.get_user_phq2_history(user_id=user_id)
        items = []
        for r in records:
            try:
                items.append(Phq2ResultResponse(**r))
            except Exception as parse_err:
                logger.warning(f"Skipping malformed PHQ2 record: {parse_err}")
        return Phq2HistoryResponse(assessments=items, count=len(items))
    except Exception as e:
        logger.error(f"Error fetching PHQ-2 history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve PHQ-2 history.")
