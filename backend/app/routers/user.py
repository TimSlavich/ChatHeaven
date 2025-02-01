from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from app.models import User
from app.core.security import hash_password, verify_password
from app.services import get_current_user

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Retrieves the authenticated user's details.
    """
    return {"username": current_user.username}


@router.put("/change-password", status_code=204)
async def change_password(
    request: dict, current_user: User = Depends(get_current_user)
):
    """
    Changes the user's password.
    """
    current_password = request.get("current_password")
    new_password = request.get("new_password")

    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Both passwords are required")

    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(status_code=403, detail="Current password is incorrect")

    current_user.hashed_password = hash_password(new_password)
    await current_user.save()
