from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


def get_documents_from_file(filename: str) -> list[Document]:
    """
    Чтение текста из файла и разбиение на документы.

    :param filename: Имя файла с текстом.
    :return: Список документов.
    """

    with open(filename, encoding="UTF-8") as file:
        text = file.read()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=350,
            chunk_overlap=20,
        )

        documents = splitter.create_documents([text])

        return documents

docA = get_documents_from_file("app/prompts/A.md")