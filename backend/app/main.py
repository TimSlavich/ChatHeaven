from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api_router
from app.core.database import register_db


def create_app() -> FastAPI:
    """Initializes FastAPI application with routers and middleware."""
    app = FastAPI(title="Chatbot API", version="1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    register_db(app)

    return app


app = create_app()
