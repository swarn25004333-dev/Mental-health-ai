from typing import Optional
from supabase import create_client, Client
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("supabase_client")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Get or initialize Supabase client for backend operations.
    Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from config.
    """
    global _supabase_client
    if _supabase_client is None:
        supabase_url = settings.SUPABASE_URL
        supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY

        if supabase_url and supabase_key:
            try:
                _supabase_client = create_client(supabase_url, supabase_key)
                logger.info("Supabase client successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {str(e)}")
                return None
        else:
            logger.warning("Supabase credentials not configured in environment variables.")
            return None

    return _supabase_client
