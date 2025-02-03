# ---- Backend ----
    FROM python:3.12 AS backend

    WORKDIR /app
    COPY backend /app
    
    # Устанавливаем Poetry и зависимости
    RUN pip install poetry
    RUN poetry install --no-root --no-dev
    
    # ---- Frontend ----
    FROM node:18 AS frontend
    
    WORKDIR /frontend
    COPY frontend /frontend
    RUN npm install && npm run build
    
    # ---- Final Image ----
    FROM python:3.12
    
    WORKDIR /app
    COPY --from=backend /app /app
    COPY --from=frontend /frontend/dist /app/frontend
    
    CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    