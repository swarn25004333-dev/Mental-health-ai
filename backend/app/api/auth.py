from fastapi import APIRouter, Request
from app.core.rate_limiter import limiter
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup")
@limiter.limit(settings.RATE_LIMIT_SIGNUP_IP)
# 3 signup attempts per 10 minutes per IP — prevents account farming / spam.
def signup(request: Request):
    return {"message": "Signup endpoint placeholder"}


@router.post("/login")
@limiter.limit(settings.RATE_LIMIT_LOGIN_IP)
# 5 login attempts per minute per IP — brute-force protection.
def login(request: Request):
    return {"message": "Login endpoint placeholder", "token": "placeholder-token"}


@router.get("/me")
def get_current_user():
    return {"message": "Get current user profile placeholder"}

