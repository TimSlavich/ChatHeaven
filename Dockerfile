# ---- Backend ----
    FROM python:3.11 AS backend

    WORKDIR /app
    COPY backend /app/backend
    COPY pyproject.toml poetry.lock /app/
    RUN pip install poetry && poetry install --no-dev
    
    # ---- Frontend ----
    FROM node:18 AS frontend
    
    WORKDIR /frontend
    COPY frontend /frontend
    RUN npm install && npm run build
    
    # ---- Final Image ----
    FROM python:3.11
    
    WORKDIR /app
    COPY --from=backend /app /app
    COPY --from=frontend /frontend/dist /app/frontend
    
    CMD ["poetry", "run", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    