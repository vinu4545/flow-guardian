from fastapi import APIRouter
from backend.schemas.user_schema import UserSignup
from backend.services.user_service import register_user

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup):
    result = register_user(user)

    if "error" in result:
        return {"status": "fail", "message": result["error"]}

    return {"status": "success", "data": result}