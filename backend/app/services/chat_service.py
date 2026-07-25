"""
Chat Service — Orchestrates AI conversation + Supabase persistence.

Responsibilities:
- Retrieve a user's recent conversation history from Supabase to
  build multi-turn context for Gemini.
- Call GeminiService to generate a response.
- Persist both the user message and AI response to `chat_history`.
- Handle errors gracefully at each step independently so a DB failure
  doesn't block the AI response.

Architecture:
- Stateless: history is fetched fresh per request (last N turns).
- History format is converted from Supabase rows to Gemini SDK format.
"""

from typing import Optional, List, Dict, Any
from app.services.gemini_service import gemini_service
from app.services.chat_history_service import chat_history_service
from app.core.logging import get_logger

logger = get_logger("chat_service")

# Number of prior conversation turns to include for context
CONTEXT_TURNS = 10  # 10 pairs = 20 messages max


class ChatService:
    """
    Orchestrates the full chat pipeline:
    1. Fetch recent history → 2. Call Gemini → 3. Save to DB → 4. Return
    """

    async def process_message(
        self,
        user_id: str,
        user_message: str,
    ) -> Dict[str, Any]:
        """
        Process a user message end-to-end.

        Args:
            user_id: Authenticated user's UUID from Supabase Auth.
            user_message: The raw text message from the user.

        Returns:
            dict with:
                - reply (str): The AI's response.
                - is_emergency (bool): Whether crisis content was detected.
                - saved (bool): Whether the exchange was persisted to DB.
        """
        # Step 1: Fetch recent conversation history for context
        conversation_history = await self._build_gemini_history(user_id)

        # Step 2: Generate AI response
        try:
            result = await gemini_service.generate_response(
                user_message=user_message,
                conversation_history=conversation_history,
            )
        except Exception as e:
            logger.error(f"Gemini generation failed for user {user_id}: {str(e)}")
            raise

        ai_reply = result["reply"]
        is_emergency = result["is_emergency"]

        # Step 3: Persist the exchange to Supabase (non-blocking failure)
        saved = False
        try:
            await chat_history_service.save_chat_message(
                user_id=user_id,
                user_message=user_message,
                ai_response=ai_reply,
            )
            saved = True
            logger.info(f"Chat message saved for user {user_id}.")
        except Exception as e:
            # DB save failure is logged but does NOT break the response
            logger.error(
                f"Failed to save chat message for user {user_id}: {str(e)}. "
                "Continuing without persistence."
            )

        return {
            "reply": ai_reply,
            "is_emergency": is_emergency,
            "saved": saved,
        }

    async def _build_gemini_history(self, user_id: str) -> List[Dict]:
        """
        Fetch the last N chat records from Supabase and convert them
        into Gemini's multi-turn conversation format.

        Gemini expects: [{"role": "user"|"model", "parts": [{"text": "..."}]}]
        Note: descending=True gives newest first, so we reverse to get chronological order.
        """
        try:
            records = await chat_history_service.get_user_chat_history(
                user_id=user_id,
                limit=CONTEXT_TURNS,
            )
        except Exception as e:
            logger.warning(
                f"Could not fetch history for user {user_id}: {str(e)}. "
                "Proceeding with no context."
            )
            return []

        # Records come in newest-first, reverse for chronological order
        records = list(reversed(records))

        history = []
        for record in records:
            # User turn
            history.append({
                "role": "user",
                "parts": [{"text": record.get("user_message", "")}],
            })
            # Model turn
            history.append({
                "role": "model",
                "parts": [{"text": record.get("ai_response", "")}],
            })

        return history

    async def get_history(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve paginated chat history for a user."""
        return await chat_history_service.get_user_chat_history(user_id, limit=limit)

    async def clear_history(self, user_id: str) -> bool:
        """Delete all chat history for a user (from Supabase)."""
        try:
            client = self._get_db_client()
            if not client:
                logger.warning("DB client unavailable. Cannot clear history.")
                return False
            client.table("chat_history").delete().eq("user_id", user_id).execute()
            logger.info(f"Chat history cleared for user {user_id}.")
            return True
        except Exception as e:
            logger.error(f"Error clearing chat history for user {user_id}: {str(e)}")
            return False

    def _get_db_client(self):
        """Get Supabase client for direct operations."""
        from app.database.supabase import get_supabase_client
        return get_supabase_client()


# Singleton instance
chat_service = ChatService()
