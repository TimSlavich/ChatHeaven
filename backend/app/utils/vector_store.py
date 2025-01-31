from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores.faiss import FAISS
from langchain_core.documents import Document
from envparse import env

env.read_envfile(".env")


def create_db(docs: list[Document]) -> FAISS:
    """
    Создание базы данных векторных представлений на основе документов.

    :param docs: Список документов.
    :return: Объект FAISS с векторными представлениями.
    """

    api_key = env.str("OPENAI_API_KEY", default=None)

    embedding = OpenAIEmbeddings(openai_api_key=api_key)
    vector_store = FAISS.from_documents(docs, embedding=embedding)

    return vector_store
