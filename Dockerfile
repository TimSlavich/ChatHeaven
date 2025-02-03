# ---- Backend ----
FROM python:3.12 AS backend

WORKDIR /app
COPY backend /app
COPY backend/pyproject.toml backend/poetry.lock /app/

# Устанавливаем Poetry
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-root

# ---- Frontend ----
FROM node:lts AS frontend

WORKDIR /frontend
COPY frontend /frontend
RUN npm install && npm run build

# ---- Final Image ----
FROM python:3.12

WORKDIR /app

# Копируем backend
COPY --from=backend /app /app

# Устанавливаем Poetry
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-root

# Копируем frontend
COPY --from=frontend /frontend/dist /app/frontend

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

