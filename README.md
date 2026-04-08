RAG AI Chat – Next.js + TypeScript + Clerk

An AI-powered Retrieval-Augmented Generation (RAG) application built with Next.js, TypeScript, and Clerk that allows users to upload documents and chat with them using modern AI.

✨ Features
    🔐 Authentication with Clerk
    
    Secure login/signup
    
    User session management
    
    Chat access only after login
    
📄 Document-based Q&A (RAG)
    
    Upload PDFs or text files
    
    Extract and chunk content

    Generate embeddings
    
    Retrieve relevant context for accurate answers

🤖 AI Chat Interface
    
    Ask questions in natural language
    
    Context-aware responses
    
    Clean and responsive UI

🧠 Vector Search

    Efficient similarity search using embeddings
    Configurable top_k retrieval

🗂 MongoDB Integration
 
  Store documents and embeddings
  
  Scalable backend with MongoDB Atlas

🏗 Tech Stack

    Frontend: Next.js (App Router) + Tailwind CSS
    
    Backend: Next.js API Routes
    
    Language: TypeScript
  
    Auth: Clerk

    Database: MongoDB Atlas

    AI / RAG: Embeddings + Vector Search

⚙️ How It Works
  Upload Document
        File is processed and split into chunks (chunkSize, chunkOverlap)
    Embedding Generation
        Each chunk is converted into vector embeddings
  Storage
    Stored in MongoDB with vector index
  User Query
      Query is embedded and matched against stored vectors
    
  Retrieval (top_k)
    Most relevant chunks are selected
 AI Response
Context + query → LLM → final answer
 
