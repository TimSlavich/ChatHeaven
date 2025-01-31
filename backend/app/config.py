from envparse import env

env.read_envfile()


class Settings:
    DATABASE_URL: str = env.str(
        "DATABASE_URL",
        default="postgres://bot_user:bot_password@localhost:5432/chatbot",
    )
    SECRET_KEY: str = env.str("SECRET_KEY", default="supersecretkey")
    ALGORITHM: str = env.str("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = env.int(
        "ACCESS_TOKEN_EXPIRE_MINUTES", default=30
    )


settings = Settings()
