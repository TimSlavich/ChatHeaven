from tortoise.models import Model
from tortoise import fields
from app.models.user import User

class Chat(Model):
    """
    Represents a chat session created by a user.
    """
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="chats")
    name = fields.CharField(max_length=100)

    class Meta:
        table = "chats"
