"""
Gemini Service — Google Gemini AI Integration

Handles all interactions with the Google Gemini API.
Loads the system prompt from the prompts directory and manages
multi-turn conversation history for context-aware responses.

Architecture:
- Uses google-genai SDK (google.genai)
- Maintains per-request conversation history passed from the caller
- Detects the [EMERGENCY_REDIRECT] crisis token in responses
- Never exposes the API key; runs entirely server-side
"""

import os
from pathlib import Path
from typing import Optional
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("gemini_service")

# Crisis detection token — defined in the system prompt
EMERGENCY_TOKEN = "[EMERGENCY_REDIRECT]"

# Path to the system prompt file
PROMPT_FILE = Path(__file__).parent.parent / "prompts" / "mental_health_prompt.txt"


def _load_system_prompt() -> str:
    """Load the mental health system prompt from disk."""
    try:
        return PROMPT_FILE.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        logger.error(f"System prompt file not found at {PROMPT_FILE}")
        return (
            "You are a compassionate AI mental health companion. "
            "You are NOT a doctor or therapist. Always encourage professional help."
        )


class GeminiService:
    """
    Google Gemini AI service for mental health conversations.

    Responsibilities:
    - Initialize the Gemini client with the API key from environment variables.
    - Load and inject the system prompt into every conversation.
    - Generate context-aware AI responses.
    - Detect crisis signals and return an emergency flag.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        self.model_name = getattr(settings, "GEMINI_MODEL_NAME", "gemini-flash-latest") or "gemini-flash-latest"
        self.system_prompt = _load_system_prompt()
        self._initialize_client()

    def _initialize_client(self):
        """Initialize the Google Gemini client."""
        if not self.api_key:
            logger.warning(
                "GEMINI_API_KEY is not set. Gemini service will return placeholder responses."
            )
            return

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.client = genai
            logger.info(f"Gemini client initialized successfully with model: {self.model_name}")
        except ImportError:
            logger.error(
                "google-generativeai package not installed. "
                "Run: pip install google-generativeai"
            )
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")

    async def generate_response(
        self,
        user_message: str,
        conversation_history: Optional[list] = None,
    ) -> dict:
        """
        Generate an AI response for the given user message.
        """
        if not self.client:
            logger.warning("Gemini client not available. Returning placeholder response.")
            return {
                "reply": (
                    "I'm here to support you. However, the AI service is currently being configured. "
                    "Please try again shortly. If you're in crisis, please call 988 or emergency services."
                ),
                "is_emergency": False,
                "raw_reply": "",
            }

        import google.generativeai as genai

        history = conversation_history or []

        # Candidate models to try in order (configured model first, then known working fallbacks)
        candidate_models = [self.model_name]
        for fallback in ["gemini-flash-latest", "gemini-3.6-flash", "gemini-flash-lite-latest"]:
            if fallback not in candidate_models:
                candidate_models.append(fallback)

        last_exception = None

        for model_candidate in candidate_models:
            try:
                model = genai.GenerativeModel(
                    model_name=model_candidate,
                    system_instruction=self.system_prompt,
                )
                chat = model.start_chat(history=history)

                logger.info(f"Sending message to Gemini model '{model_candidate}': '{user_message[:60]}...'")
                response = chat.send_message(user_message)
                raw_reply = response.text

                is_emergency = EMERGENCY_TOKEN in raw_reply
                clean_reply = raw_reply.replace(EMERGENCY_TOKEN, "").strip()

                logger.info(
                    f"Gemini response generated via '{model_candidate}'. Emergency flag: {is_emergency}. "
                    f"Length: {len(clean_reply)} chars."
                )

                return {
                    "reply": clean_reply,
                    "is_emergency": is_emergency,
                    "raw_reply": raw_reply,
                }
            except Exception as e:
                last_exception = e
                logger.warning(
                    f"Gemini model '{model_candidate}' failed: {type(e).__name__}: {str(e)[:150]}. "
                    "Trying next candidate model..."
                )

        err_msg = str(last_exception) if last_exception else "Unknown error"
        logger.error(f"All Gemini candidate models failed. Last error: {err_msg}", exc_info=True)
        raise RuntimeError(f"AI service error ({type(last_exception).__name__}): {err_msg}")


# Singleton instance
gemini_service = GeminiService()
