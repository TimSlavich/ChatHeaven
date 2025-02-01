from fastapi import APIRouter, HTTPException, Depends
from app.models import User, Chat, ChatMessage
from app.schemas import ChatCreate
from app.services import get_current_user

router = APIRouter()


@router.post("/create", status_code=201)
async def create_chat(
    chat_data: ChatCreate, current_user: User = Depends(get_current_user)
):
    """
    Creates a new chat for the authenticated user.

    :param chat_data: Chat creation data.
    :param current_user: Authenticated user.
    :return: Created chat ID.
    """
    chat = await Chat.create(user=current_user, name=chat_data.name or "New Chat")
    return {"chat_id": chat.id}


@router.get("/chats")
async def get_user_chats(current_user: User = Depends(get_current_user)):
    """
    Retrieves all chats of the authenticated user.

    :param current_user: Authenticated user.
    :return: List of user chats.
    """
    chats = await Chat.filter(user=current_user).values("id", "name")
    return {"chats": chats}


@router.patch("/{chat_id}")
async def rename_chat(
    chat_id: int, new_name: str, current_user: User = Depends(get_current_user)
):
    """
    Renames a chat if the user is the owner.

    :param chat_id: Chat ID.
    :param new_name: New chat name.
    :param current_user: Authenticated user.
    :return: Confirmation message.
    """
    chat = await Chat.get_or_none(id=chat_id, user=current_user)

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


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: int, current_user: User = Depends(get_current_user)):
    """
    Deletes a chat along with its messages if the user is the owner.

    :param chat_id: Chat ID.
    :param current_user: Authenticated user.
    """
    chat = await Chat.get_or_none(id=chat_id, user=current_user)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or access denied")

    await ChatMessage.filter(chat=chat).delete()
    await chat.delete()
