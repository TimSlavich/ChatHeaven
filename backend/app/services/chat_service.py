from app.utils.agent import create_agent
from app.utils.vector_store import create_db
from app.prompts import docA
import emoji


vector_store = create_db(docA)
agent_executor = create_agent(vector_store)


async def process_chat(message: str, chat_history: list) -> str:
    """
    Processes a chat message using the agent executor.

    :param message: User input message.
    :param chat_history: List of previous chat messages.
    :return: Formatted bot response with emoji and Markdown formatting.
    """
    response = await agent_executor.ainvoke(
        {
            "input": message,
            "chat_history": chat_history,
        }
    )

    formatted_response = (
        f"{emoji.emojize(response['output'])}\n\n"
    )

    return formatted_response
