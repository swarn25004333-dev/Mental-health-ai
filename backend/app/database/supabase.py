from contextvars import ContextVar
from typing import Optional
from supabase import create_client, Client, ClientOptions
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("supabase_client")

_supabase_client: Optional[Client] = None

# The API validates a Supabase access token for every protected request.  When
# this deployment does not have a service-role key, database calls must use that
# same token or Supabase RLS will (correctly) reject the operation.  A ContextVar
# keeps the token isolated to the current request/task rather than sharing it
# between concurrent requests.
_request_access_token: ContextVar[Optional[str]] = ContextVar(
    "supabase_request_access_token", default=None
)


def set_request_access_token(token: str):
    """Bind a verified Supabase access token to the current request context."""
    return _request_access_token.set(token)


def reset_request_access_token(token_context) -> None:
    """Remove the request-scoped token once FastAPI has finished the request."""
    _request_access_token.reset(token_context)

def get_supabase_client() -> Optional[Client]:
    """
    Get or initialize Supabase client for backend operations.
    Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from config.
    """
    # A service-role client is safe for server-side use and is intentionally
    # shared.  Without one, create a request-scoped client authenticated as the
    # signed-in user so the existing RLS policies can authorize the query.
    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY and not settings.SUPABASE_SERVICE_ROLE_KEY:
        access_token = _request_access_token.get()
        if access_token:
            try:
                return create_client(
                    settings.SUPABASE_URL,
                    settings.SUPABASE_ANON_KEY,
                    options=ClientOptions(
                        headers={"Authorization": f"Bearer {access_token}"}
                    ),
                )
            except Exception as e:
                logger.error(f"Failed to initialize request-scoped Supabase client: {str(e)}")
                return None

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
