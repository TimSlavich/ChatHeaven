from fastapi import APIRouter
from .auth import router as auth_router
from .user import router as user_router
from .chat import router as chat_router
from .websocket import router as websocket_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(user_router, prefix="/user", tags=["User"])
api_router.include_router(chat_router, prefix="/chat", tags=["Chat"])
api_router.include_router(websocket_router, prefix="/chat-ws", tags=["WebSocket"])

__all__ = ["api_router"]
