"""
Mood Schemas — Pydantic models for mood tracking API.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MoodLogRequest(BaseModel):
    """Request schema for logging a mood."""
    mood: str = Field(
        ...,
        description="Selected mood (happy, sad, stressed, calm)",
        example="happy"
    )
    note: Optional[str] = Field(
        default="",
        max_length=1000,
        description="Optional journal note accompanying the mood entry."
    )


class MoodEntryResponse(BaseModel):
    """Response schema for a single mood entry."""
    id: str
    user_id: str
    mood: str
    note: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True


class TodayMoodResponse(BaseModel):
    """Response schema for today's logged mood."""
    has_logged_today: bool
    today_entry: Optional[MoodEntryResponse] = None


class MoodHistoryResponse(BaseModel):
    """Response schema for listing mood entries."""
    history: List[MoodEntryResponse]
    count: int
