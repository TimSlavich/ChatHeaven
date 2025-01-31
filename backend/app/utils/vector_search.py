from langchain_community.vectorstores.faiss import FAISS
from langchain.tools.retriever import create_retriever_tool
from langchain.tools import Tool


def vector_search(vector_store: FAISS) -> Tool:
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    retriever_tools = create_retriever_tool(
        retriever,
        "VectorSearch",
        "Используй этот инструмент, когда нужно найти данные из документов.",
    )

    return retriever_tools
