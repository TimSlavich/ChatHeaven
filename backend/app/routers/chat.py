from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from app.models import Chat, ChatMessage, User
from app.schemas import ChatCreate
from app.routers.auth import get_current_user

router = APIRouter()

connected_clients = {}


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int):
    """WebSocket-соединение для чатов по chat_id"""
    chat = await Chat.get_or_none(id=chat_id).prefetch_related("user")
    if not chat:
        await websocket.close(code=4404, reason="Chat not found")
        return

    user = await User.get_or_none(id=chat.user_id)
    if not user:
        await websocket.close(code=4404, reason="User not found")
        return

    await websocket.accept()
    connected_clients[chat_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()

            chat = await Chat.get_or_none(id=chat_id)
            if not chat:
                await websocket.close(code=4404, reason="Chat deleted")
                break

            await ChatMessage.create(
                chat=chat, user=user, user_message=data, bot_response="Reply from AI"
            )

            if chat_id in connected_clients:
                await connected_clients[chat_id].send_text(f"Bot: Ответ на '{data}'")

    except WebSocketDisconnect:
        print(f"❌ WebSocket отключён от чата {chat_id}")
        connected_clients.pop(chat_id, None)


@router.post("/create")
async def create_chat(chat_data: ChatCreate):
    user = await User.get_or_none(id=chat_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chat = await Chat.create(user=user, name="New Chat")
    return {"chat_id": chat.id}

@router.get("/chats")
async def get_user_chats(current_user: User = Depends(get_current_user)):
    """Получает все чаты текущего пользователя"""
    chats = await Chat.filter(user_id=current_user.id).values("id", "name")
    
    return {"chats": chats}

@router.patch("/{chat_id}")
async def rename_chat(
    chat_id: int, new_name: str, current_user: User = Depends(get_current_user)
):
    """Обновляет название чата с учётом user_id"""

    chat = await Chat.get_or_none(id=chat_id)
    chat = await Chat.get_or_none(id=chat_id, user_id=current_user.id)

    if not chat:
        raise HTTPException(
            status_code=404,
            detail=f"Chat {chat_id} not found for user {current_user.id}",
        )

    chat.name = new_name
    await chat.save()

    return {
        "message": "Chat renamed successfully",
        "chat_id": chat.id,
        "new_name": chat.name,
    }


@router.delete("/{chat_id}")
async def delete_chat(chat_id: int):
    """Удаляет чат и его сообщения"""

    chat = await Chat.get_or_none(id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    await ChatMessage.filter(chat=chat).delete()
    await chat.delete()
    return {"message": "Chat deleted successfully"}
