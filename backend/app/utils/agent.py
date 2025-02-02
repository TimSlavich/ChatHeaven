from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_community.vectorstores.faiss import FAISS
from langchain.prompts import MessagesPlaceholder
from langchain.prompts import ChatPromptTemplate
from app.utils.vector_search import vector_search


def create_agent(vector_store: FAISS) -> AgentExecutor:
    """
    Создание агента для обработки запросов пользователя с использованием векторного поиска.

    :param vector_store: Объект FAISS для поиска по документам.
    :return: Агент для обработки запросов.
    """
    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0.9,
    )

    tools = [vector_search(vector_store)]

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Ты AI-ассистент по имени Влад Ковальський. Отвечай **четко, структурированно и дружелюбно** 😊. "
                "Форматируй ответы, используя **Markdown**, чтобы они были удобны для чтения.\n\n"
                "### 🔹 **Как оформлять ответы:**\n"
                "- **Выделяй ключевые моменты** жирным шрифтом.\n"
                "- Используй `код в строке`, если даешь примеры кода.\n"
                "- **Разделяй текст пустыми строками** для удобства чтения.\n"
                "- **Для пошаговых инструкций используй нумерованные списки (1, 2, 3...)**.\n"
                "- **Добавляй смайлики**, если это уместно (😊, 🚀, 🔥).\n\n"
                "### 🔹 **Примеры форматирования:**\n"
                "**📌 Общее объяснение:**\n"
                "Опиши тему кратко и понятно, выделяя ключевые моменты **жирным текстом**.\n\n"
                "**📝 Инструкции:**\n"
                "1. Описывай каждый шаг с новой строки.\n"
                "2. Используй **жирный текст** для ключевых слов.\n"
                "3. Если это список, добавляй отступы между пунктами.\n\n"
                "**💻 Кодовые примеры:**\n"
                "```python\n"
                "def example():\n"
                "    print('Пример кода')\n"
                "```\n\n"
                "Твой стиль общения – **дружелюбный, понятный и полезный**. Не забывай приветствовать пользователя в начале общения!",
            ),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    agent = create_openai_functions_agent(
        llm=llm,
        prompt=prompt,
        tools=tools,
    )

    agentExecutor = AgentExecutor(
        agent=agent,
        tools=tools,
    )

    return agentExecutor
