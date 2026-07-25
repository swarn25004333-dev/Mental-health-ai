"""
PHQ-2 Schemas — Pydantic models for PHQ-2 depression screening API.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Phq2SubmitRequest(BaseModel):
    """Request body for submitting a PHQ-2 assessment."""
    question1: int = Field(
        ...,
        ge=0,
        le=3,
        description="Response score for Question 1 (0-3)",
        example=1
    )
    question2: int = Field(
        ...,
        ge=0,
        le=3,
        description="Response score for Question 2 (0-3)",
        example=1
    )


class Phq2ResultResponse(BaseModel):
    """Response body for a PHQ-2 assessment result."""
    id: str
    user_id: str
    question1: int
    question2: int
    score: int
    recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True


class Phq2HistoryResponse(BaseModel):
    """Response body for PHQ-2 screening history."""
    assessments: List[Phq2ResultResponse]
    count: int
