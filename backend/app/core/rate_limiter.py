"""
rate_limiter.py — Centralized rate limiting configuration (slowapi)

Architecture:
    - Uses slowapi, built on top of the `limits` library.
    - Default storage: in-memory (MemoryStorage). Resets on process restart.
    - Production upgrade: replace MemoryStorage with RedisStorage by changing
      one line in _create_limiter() — no other code changes needed.

Key functions:
    - `get_client_ip`: Standard key function — identifies clients by IP address.
      Handles X-Forwarded-For (reverse-proxy / nginx) and direct connections.
    - `get_user_key`: Per-user key function — extracts the Supabase JWT sub
      claim from the Authorization header WITHOUT fully verifying the token.
      Rate limiting is a light-weight pre-check; full JWT auth still runs in
      get_current_user_id() inside each route handler.

Usage in routes:
    from app.core.rate_limiter import limiter

    @router.post("/chat")
    @limiter.limit("5/minute")                          # IP-based
    @limiter.limit("20/hour", key_func=get_user_key)    # user-based
    async def send_chat_message(request: Request, ...):
        ...

Registering on the FastAPI app (in main.py):
    from slowapi import _rate_limit_exceeded_handler
    from slowapi.errors import RateLimitExceeded
    from app.core.rate_limiter import limiter

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
"""

import base64
import json
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.logging import get_logger

logger = get_logger("rate_limiter")


def get_client_ip(request: Request) -> str:
    """
    Key function: resolve client IP for IP-based rate limiting.

    Checks X-Forwarded-For first (set by nginx / load balancers in production),
    then falls back to the direct TCP connection address.
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For can be a comma-separated list; use the first (client) IP
        client_ip = forwarded_for.split(",")[0].strip()
    else:
        client_ip = get_remote_address(request)
    return client_ip


def get_user_key(request: Request) -> str:
    """
    Key function: resolve per-user rate limit key from the Supabase JWT.

    Decodes the JWT payload (without signature verification — this is intentional;
    full cryptographic auth still happens inside get_current_user_id()).
    Returns the `sub` claim (Supabase user UUID) if available, otherwise falls
    back to the client IP so unauthenticated requests are still limited.

    This must NOT raise exceptions — slowapi calls it before the route handler.
    """
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[len("Bearer "):].strip()
        try:
            parts = token.split(".")
            if len(parts) == 3:
                payload_b64 = parts[1]
                # Pad to valid base64 length
                payload_b64 += "=" * (-len(payload_b64) % 4)
                payload = json.loads(base64.urlsafe_b64decode(payload_b64))
                user_id = payload.get("sub")
                if user_id:
                    return f"user:{user_id}"
        except Exception:
            # Malformed token — fall through to IP key
            pass

    # No valid token found — use IP as fallback key
    return f"ip:{get_client_ip(request)}"


# ---------------------------------------------------------------------------
# Limiter singleton
#
# Storage: MemoryStorage (in-process, no Redis required for development).
#
# To switch to Redis in production, replace the line below with:
#   from limits.storage import RedisStorage
#   limiter = Limiter(
#       key_func=get_client_ip,
#       storage_uri="redis://localhost:6379",   # or your REDIS_URL env var
#   )
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_client_ip)


from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """
    Custom exception handler for HTTP 429 Too Many Requests.
    Returns JSON response with clear error structure and Retry-After header.
    """
    logger.warning(f"Rate limit exceeded on {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "Rate limit exceeded. Too many requests.",
            "detail": f"Limit exceeded: {exc.detail}"
        },
        headers={"Retry-After": "60"}
    )

