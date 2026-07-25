"""
Chat Schemas — Pydantic request/response models for the chatbot API.

These models enforce strict type validation and provide clear
API documentation via FastAPI's OpenAPI integration.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ChatRequest(BaseModel):
    """Request body for POST /chat."""
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="The user's message to the AI companion.",
        example="I've been feeling very stressed lately.",
    )


class ChatResponse(BaseModel):
    """Response body for POST /chat."""
    reply: str = Field(..., description="The AI companion's response.")
    is_emergency: bool = Field(
        default=False,
        description="True if the AI detected crisis content and the frontend should show the Emergency Help page.",
    )


class ChatHistoryItem(BaseModel):
    """A single chat exchange record from the database."""
    id: str
    user_message: str
    ai_response: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    """Response body for GET /chat/history."""
    history: List[ChatHistoryItem]
    count: int


class ClearHistoryResponse(BaseModel):
    """Response body for DELETE /chat/history."""
    success: bool
    message: str
