from fastapi import APIRouter

router = APIRouter(prefix="/emergency", tags=["Emergency Resources"])

@router.get("/resources")
def get_emergency_resources():
    return {
        "crisis_lines": [
          {"name": "National Suicide & Crisis Lifeline", "number": "988", "available": "24/7"},
          {"name": "Crisis Text Line", "text": "HOME to 741741", "available": "24/7"}
        ]
    }
