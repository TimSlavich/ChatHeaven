from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores.faiss import FAISS
from langchain_core.documents import Document
from envparse import env

env.read_envfile(".env")


def create_db(docs: list[Document]) -> FAISS:
    """
    Creates a vector representation database based on documents.

    :param docs: List of documents.
    :return: FAISS object with vector representations.
    """

    api_key = env.str("OPENAI_API_KEY", default=None)

    embedding = OpenAIEmbeddings(openai_api_key=api_key)
    vector_store = FAISS.from_documents(docs, embedding=embedding)

    return vector_store
