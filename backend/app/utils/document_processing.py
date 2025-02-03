from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


def get_documents_from_file(filename: str) -> list[Document]:
    """
    Reads text from a file and splits it into documents.

    :param filename: Name of the file containing the text.
    :return: List of documents.
    """

    with open(filename, encoding="UTF-8") as file:
        text = file.read()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=350,
            chunk_overlap=20,
        )

        documents = splitter.create_documents([text])

        return documents
