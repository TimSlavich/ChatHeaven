from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models import Chat, ChatMessage
from app.services import process_chat
import asyncio

router = APIRouter()
connected_clients = {}

async def generate_bot_response(user_message: str, chat_history: list) -> str:
    """
    Generates a bot response using AI agent with formatted chat history.

    :param user_message: The message from the user.
    :param chat_history: The previous chat history formatted for LangChain.
    :return: AI-generated response.
    """
    return await process_chat(user_message, chat_history)

@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int):
    """
    WebSocket connection for real-time chat.

    :param websocket: WebSocket connection.
    :param chat_id: Chat ID to establish a connection.
    """
    chat = await Chat.get_or_none(id=chat_id).prefetch_related("user", "messages")
    if not chat:
        await websocket.close(code=1000, reason="Chat not found")
        return

    user = chat.user
    if not user:
        await websocket.close(code=1000, reason="User not found")
        return

    # Load existing chat history and convert it to LangChain format
    chat_history = []
    messages = await ChatMessage.filter(chat=chat).order_by("timestamp").values("user_message", "bot_response")

    for msg in messages:
        chat_history.append({"role": "user", "content": msg["user_message"]})
        chat_history.append({"role": "assistant", "content": msg["bot_response"]})

    await websocket.accept()
    connected_clients[chat_id] = websocket

    try:
        while True:
            user_message = await websocket.receive_text()

            chat = await Chat.get_or_none(id=chat_id)
            if not chat:
                await websocket.close(code=1000, reason="Chat deleted")
                break

            # Generate bot response considering chat history
            bot_response = await generate_bot_response(user_message, chat_history)

            # Save the new message in the database
            await ChatMessage.create(
                chat=chat,
                user=user,
                user_message=user_message,
                bot_response=bot_response,
            )

            # Update the chat history
            chat_history.append({"role": "user", "content": user_message})
            chat_history.append({"role": "assistant", "content": bot_response})

            # Send response to the connected client
            if chat_id in connected_clients:
                await connected_clients[chat_id].send_text(bot_response)

    except WebSocketDisconnect:
        print(f"❌ WebSocket disconnected from chat {chat_id}")
    finally:
        connected_clients.pop(chat_id, None)
