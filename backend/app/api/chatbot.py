"""
Chatbot API Router — /chatbot endpoints

Endpoints:
    POST   /chatbot/chat          — Send a message and get AI response
    GET    /chatbot/history       — Get paginated chat history
    DELETE /chatbot/history       — Clear all chat history for the user
    DELETE /chatbot/history/{id}  — Delete a single chat record

Authentication:
    All endpoints require a valid Bearer token (Supabase JWT).
    User ID is extracted from the token to scope all DB operations.

Security:
    - API key is NEVER sent to frontend; only kept in backend environment.
    - All DB queries are scoped to the authenticated user_id.
    - Supabase RLS provides an additional security layer.
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatHistoryResponse,
    ChatHistoryItem,
    ClearHistoryResponse,
)
from app.services.chat_service import chat_service
from app.services.chat_history_service import chat_history_service
from app.core.logging import get_logger
from app.core.rate_limiter import limiter, get_user_key
from app.core.config import settings
from app.database.supabase import set_request_access_token, reset_request_access_token

logger = get_logger("chatbot_api")

router = APIRouter(prefix="/chatbot", tags=["AI Chatbot"])
security = HTTPBearer(auto_error=False)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Extract and validate the user ID from the Supabase JWT Bearer token.
    """
    if not credentials or not credentials.credentials:
        logger.warning("No authorization credentials provided in request header.")
        raise HTTPException(status_code=401, detail="Authentication required.")

    token = credentials.credentials.strip()
    token_context = set_request_access_token(token)
    logger.info(f"Received auth token (length: {len(token)}, start: '{token[:10]}...')")

    try:
        # 1. Try validating via Supabase client auth API
        try:
            from app.database.supabase import get_supabase_client
            client = get_supabase_client()
            if client:
                user_response = client.auth.get_user(token)
                if user_response and user_response.user:
                    logger.info(f"Supabase auth.get_user succeeded for user_id: {user_response.user.id}")
                    yield user_response.user.id
                    return
                logger.warning("Supabase auth.get_user returned no user object.")
            else:
                logger.warning("Supabase client is not initialized.")
        except Exception as e:
            logger.warning(f"Supabase auth.get_user exception: {type(e).__name__}: {str(e)}")

        # Do not fall back to decoding the JWT payload locally: decoding does
        # not verify its signature and would allow a forged `sub` claim.  The
        # Supabase auth endpoint is the authority for token validation.
        if not settings.SUPABASE_URL or not (settings.SUPABASE_ANON_KEY or settings.SUPABASE_SERVICE_ROLE_KEY):
            raise HTTPException(status_code=503, detail="Authentication service is not configured.")
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    finally:
        reset_request_access_token(token_context)


@router.post("/chat", response_model=ChatResponse, summary="Send a message to the AI companion")
@limiter.limit(settings.RATE_LIMIT_CHAT_IP)
# Limit 1 (IP-based): max 5 requests/minute per client IP.
# Catches burst abuse regardless of whether the client is authenticated.
@limiter.limit(settings.RATE_LIMIT_CHAT_USER, key_func=get_user_key)
# Limit 2 (user-based): max 20 requests/hour per authenticated Supabase user.
# Uses the JWT `sub` claim; falls back to IP for unauthenticated requests.
# Both checks run BEFORE the Gemini API is called, protecting AI quota.
async def send_chat_message(
    request: Request,
    body: ChatRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Process a user message through the Gemini AI service.

    - Loads recent conversation history for context.
    - Generates a response using Google Gemini.
    - Saves the exchange to Supabase chat_history table.
    - Returns the AI reply and an emergency flag if crisis content is detected.

    The `is_emergency` flag signals the frontend to display the Emergency Help page.
    """
    user_message = body.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    logger.info(f"Chat request from user {user_id}: '{user_message[:60]}...' " if len(user_message) > 60 else f"Chat request from user {user_id}: '{user_message}'")

    try:
        result = await chat_service.process_message(
            user_id=user_id,
            user_message=user_message,
        )
    except RuntimeError as e:
        logger.error(f"Chat processing failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="The AI service is temporarily unavailable. Please try again shortly.",
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

    return ChatResponse(
        reply=result["reply"],
        is_emergency=result["is_emergency"],
    )


@router.get("/history", response_model=ChatHistoryResponse, summary="Get chat history")
async def get_chat_history(
    limit: int = Query(default=50, ge=1, le=200, description="Number of messages to return"),
    user_id: str = Depends(get_current_user_id),
):
    """
    Retrieve the authenticated user's chat history, ordered by newest first.
    """
    try:
        records = await chat_history_service.get_user_chat_history(
            user_id=user_id, limit=limit
        )
        # Parse records into ChatHistoryItem (handle missing fields gracefully)
        items = []
        for r in records:
            try:
                items.append(ChatHistoryItem(**r))
            except Exception as parse_err:
                logger.warning(f"Skipping malformed history record: {parse_err}")

        return ChatHistoryResponse(history=items, count=len(items))
    except Exception as e:
        logger.error(f"Error fetching chat history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat history.")


@router.delete("/history", response_model=ClearHistoryResponse, summary="Clear all chat history")
async def clear_all_chat_history(
    user_id: str = Depends(get_current_user_id),
):
    """
    Delete ALL chat history records for the authenticated user.
    This action is irreversible.
    """
    try:
        success = await chat_service.clear_history(user_id=user_id)
        if success:
            return ClearHistoryResponse(success=True, message="All chat history has been cleared.")
        return ClearHistoryResponse(success=False, message="Could not clear history. Please try again.")
    except Exception as e:
        logger.error(f"Error clearing chat history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to clear chat history.")


@router.delete("/history/{chat_id}", response_model=ClearHistoryResponse, summary="Delete a single chat record")
async def delete_single_chat(
    chat_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Delete a specific chat history record by its ID.
    The record must belong to the authenticated user.
    """
    try:
        success = await chat_history_service.delete_chat_message(
            chat_id=chat_id, user_id=user_id
        )
        if success:
            return ClearHistoryResponse(success=True, message="Chat record deleted.")
        raise HTTPException(status_code=404, detail="Chat record not found.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chat {chat_id} for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete chat record.")
