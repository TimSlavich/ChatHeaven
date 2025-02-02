# ChatHeaven

**ChatHeaven** — это современный чат с поддержкой WebSocket, FastAPI, Tortoise ORM и PostgreSQL.

![ChatHeaven Screenshot](https://imgur.com/gallery/chatheaven-XgGqFCO)

---

## 🚀 Функционал

- 📡 **WebSocket (FastAPI)** — мгновенные сообщения в чате.
- 🤖 **AI-поддержка** — ответы от бота через `LangChain`.
- 🔐 **JWT-аутентификация** — безопасность пользователей.
- 📝 **История чатов** — хранение сообщений в **PostgreSQL** через **Tortoise ORM**.
- 🎨 **Настраиваемый UI** — светлая/темная тема.

---

## 📥 Установка и запуск

### 1️⃣ Клонируем репозиторий
```sh
git clone https://github.com/TimSlavich/ChatHeaven.git
cd ChatHeaven
```

---

## ⚡ Запуск фронтенда (React + Vite)

📌 Перейдите в папку **frontend** и установите зависимости:
```sh
cd frontend
npm install
```

### **Настраиваем `.env` файл (фронтенд)**
Создайте `.env` в **frontend/** и добавьте:
```sh
VITE_API_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000/ws
```

### **Запускаем фронтенд**
```sh
npm run dev
```
🔹 Открой `http://localhost:5173` в браузере.

---

## 🖥️ Запуск бэкенда (FastAPI + Uvicorn)

📌 Перейдите в папку **backend** и установите зависимости через Poetry:
```sh
cd backend
poetry install
```

### **Настраиваем `.env` файл (бэкенд)**
Создайте `.env` в **backend/** и добавьте:
```ini
DATABASE_URL=postgres://user:password@localhost:5432/chatdb
SECRET_KEY=your-secret-key
```
📌 **Обновите параметры базы данных, если необходимо.**

### **Применяем миграции и запускаем сервер**
```sh
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
🔹 API будет доступно по `http://127.0.0.1:8000/docs`

---

## 📡 WebSocket API (Чаты в реальном времени)

### **Как работает WebSocket в FastAPI**
1. **Клиент подключается** к `ws://127.0.0.1:8000/ws/{chat_id}`.
2. **Чат загружается** (история сообщений достается из базы данных).
3. **Пользователь отправляет сообщение**, оно обрабатывается `LangChain AI`.
4. **Бот генерирует ответ** и отправляет его пользователю.
5. **История обновляется** в PostgreSQL.

---

## 🛠️ Технологии

### **Фронтенд (React)**
- ⚡ **Vite** — быстрая сборка
- 🎨 **TailwindCSS** — стилизация UI
- 🔥 **ShadCN/UI** — UI-компоненты
- 🌐 **WebSockets** — реальное время

### **Бэкенд (FastAPI)**
- 🚀 **FastAPI** — производительный Python-бэкенд
- 🔥 **Uvicorn** — ASGI-сервер
- 🗄️ **Tortoise ORM** — управление PostgreSQL
- 🛡 **JWT-аутентификация** — безопасность пользователей
- 🤖 **LangChain** — AI-чатбот

---

## ❓ FAQ

**❔ WebSocket не работает?**  
➡️ Проверьте, что **бэкенд** запущен (`uvicorn app.main:app --reload`).  
➡️ Убедитесь, что **VITE_WS_URL** указывает на правильный адрес (`ws://127.0.0.1:8000/ws`).  

**❔ Как запустить в продакшене?**  
1. **Бэкенд**:  
```sh
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
2. **Фронтенд**:  
```sh
npm run build
npm run preview
```

---

## 👨‍💻 Автор
[TimSlavich](https://github.com/TimSlavich)

💡 **PR-ы и улучшения приветствуются!** 🚀

