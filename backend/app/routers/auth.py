from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import jwt
from app.models import User
from app.core.security import hash_password, verify_password
from app.schemas import UserCreate
from app.core.config import settings

router = APIRouter()


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Generates a JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "token_type": "bearer"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/register", status_code=201)
async def register(user_data: UserCreate):
    """
    Registers a new user.
    """
    existing_user = await User.filter(username=user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed_password = hash_password(user_data.password)
    user = await User.create(
        username=user_data.username, hashed_password=hashed_password
    )
    return {"message": "User created successfully", "user_id": user.id}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticates a user and returns an access token.
    """
    user = await User.filter(username=form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id}
