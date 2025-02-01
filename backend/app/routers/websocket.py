from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models import Chat, ChatMessage

router = APIRouter()
connected_clients = {}


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int):
    """
    WebSocket connection for real-time chat.

    :param websocket: WebSocket connection.
    :param chat_id: Chat ID to establish a connection.
    """
    chat = await Chat.get_or_none(id=chat_id).prefetch_related("user")
    if not chat:
        await websocket.close(code=1000, reason="Chat not found")
        return

    user = chat.user
    if not user:
        await websocket.close(code=1000, reason="User not found")
        return

    await websocket.accept()
    connected_clients[chat_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()

            chat = await Chat.get_or_none(id=chat_id)
            if not chat:
                await websocket.close(code=1000, reason="Chat deleted")
                break

            await ChatMessage.create(
                chat=chat, user=user, user_message=data, bot_response="Reply from AI"
            )

            if chat_id in connected_clients:
                await connected_clients[chat_id].send_text(f"Bot: Response to '{data}'")
    except WebSocketDisconnect:
        print(f"❌ WebSocket disconnected from chat {chat_id}")
    finally:
        connected_clients.pop(chat_id, None)  # Ensuring cleanup
