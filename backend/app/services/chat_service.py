from app.utils.agent import create_agent
from app.utils.vector_store import create_db
from app.utils.document_processing import get_documents_from_file
from app.prompts import docA

vector_store = create_db(docA)
agent_executor = create_agent(vector_store)


async def process_chat(message: str, chat_history: list) -> str:
    response = await agent_executor.ainvoke(
        {
            "input": message,
            "chat_history": chat_history,
        }
    )
    return response["output"]
