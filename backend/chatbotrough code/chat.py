from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
import requests

query=input("<< ")

# embeddings of query

model_name = "BAAI/bge-base-en-v1.5"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': True}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

# vector database
vectorstore = QdrantVectorStore.from_existing_collection(
    
    embedding=embeddings,
    url="http://localhost:6333",
    collection_name="troubleshooting",
    
)

search_results=vectorstore.similarity_search(
    query=query,
    k=5
)


    

# Collect context from search results
context_parts = []
for result in search_results:
    context_parts.append(result.page_content)

context = "\n\n".join(context_parts)

system_prompt = f"""
You are an intelligent AI agent.
Answer the user query beautifully using only the context below.


Context:
{context}

User Question: {query}

 provide a helpful answer .
 
for example:
query: "How to reset network settings in the app"
system : "To" reset network settings, go to Settings > Network > Reset."
"""

response = requests.post(
    "https://api.sarvam.ai/v1/chat/completions",
    headers={"Authorization": "Bearer YOUR_SARVAM_API_KEY"},
    json={
        "model": "sarvam-chat-001",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
    }
)

print(response.json()['choices'][0]['message']['content'])
