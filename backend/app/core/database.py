from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from app.core.config import settings


def register_db(app: FastAPI):
    """Registers the database configuration using Tortoise ORM."""
    register_tortoise(
        app,
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )
