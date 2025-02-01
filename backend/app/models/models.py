from tortoise.models import Model
from tortoise import fields


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    hashed_password = fields.CharField(max_length=128)


class Chat(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User", related_name="chats")
    name = fields.CharField(max_length=100)


class ChatMessage(Model):
    id = fields.IntField(pk=True)
    chat = fields.ForeignKeyField("models.Chat", related_name="messages")
    user = fields.ForeignKeyField("models.User", related_name="messages")
    user_message = fields.TextField()
    bot_response = fields.TextField()
    timestamp = fields.DatetimeField(auto_now_add=True)
