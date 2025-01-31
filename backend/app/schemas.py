from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int


class UserRegister(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str


class ChatCreate(BaseModel):
    user_id: int
    name: str | None = None


class UserRequest(BaseModel):
    user_id: int
    chat_id: int
    message: str
