from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from app.routers.auth import router as auth_router
from app.routers.chat import router as chat_router

from .config import settings


def create_app() -> FastAPI:
    """Создает и настраивает приложение FastAPI."""
    app = FastAPI(
        title="Chatbot API",
        description="API для взаимодействия с ботом",
        version="1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
    app.include_router(chat_router, prefix="/chat", tags=["Chat"])

    register_db(app)

    return app


def register_db(app: FastAPI):
    """Регистрирует конфигурацию базы данных."""
    register_tortoise(
        app,
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )


app = create_app()


@app.get("/")
def read_root():
    return {"message": "Chatbot API is running!"}
