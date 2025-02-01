from tortoise.models import Model
from tortoise import fields
from app.models.chat import Chat
from app.models.user import User

class ChatMessage(Model):
    """
    Represents messages exchanged in a chat session.
    """
    id = fields.IntField(pk=True)
    chat = fields.ForeignKeyField("models.Chat", related_name="messages")
    user = fields.ForeignKeyField("models.User", related_name="messages")
    user_message = fields.TextField()
    bot_response = fields.TextField()
    timestamp = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "chat_messages"
