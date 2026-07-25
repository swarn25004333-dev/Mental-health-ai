from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.rate_limiter import limiter, rate_limit_exceeded_handler
from app.middleware import RequestLoggingMiddleware
from app.api.v1.router import api_router

# Setup Logging
setup_logging()
logger = get_logger("main")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── Rate Limiting (slowapi) ─────────────────────────────────────────────────
# Attach the limiter instance to app.state — slowapi reads it from here.
# The custom exception handler returns HTTP 429 with a Retry-After header.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging Middleware
app.add_middleware(RequestLoggingMiddleware)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail}
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )

# Root & Health Endpoints
@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "api_version": settings.API_V1_STR
    }
