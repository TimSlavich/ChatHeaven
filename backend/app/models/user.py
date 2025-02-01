from tortoise.models import Model
from tortoise import fields

class User(Model):
    """
    Represents a registered user in the system.
    """
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    hashed_password = fields.CharField(max_length=128)

    class Meta:
        table = "users"
