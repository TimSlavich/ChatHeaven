# ---- Backend ----
FROM python:3.12 AS backend

WORKDIR /app
COPY backend /app

# Устанавливаем Poetry глобально
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

# Копируем backend и frontend из билд-стадий
COPY --from=backend /app /app
COPY --from=backend /root/.local /root/.local
ENV PATH="/root/.local/bin:$PATH"

COPY --from=frontend /frontend/dist /app/frontend

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
