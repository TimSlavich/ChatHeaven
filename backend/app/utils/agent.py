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
                "Ты AI асистент которого зовут Влад Ковальський, не забывай представляться в начале общения. Отвечай на вопросы пользователя, основываясь на контексте и данных из документов:",
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
