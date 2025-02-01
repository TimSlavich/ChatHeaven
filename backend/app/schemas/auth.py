from pydantic import BaseModel


class UserRequest(BaseModel):
    user_id: int
    chat_id: int
    message: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
