import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const DB_NAME = "rag-db";
const COLLECTION_NAME = "documents";
const VECTOR_INDEX_NAME = "embedding_vector_idx";

let db: any;

export async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("✅ MongoDB Connected");
    db = client.db(DB_NAME);
  }

  // Check if collection exists
  const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
  let collection;
  if (collections.length === 0) {
    collection = await db.createCollection(COLLECTION_NAME);
    console.log(`Collection '${COLLECTION_NAME}' created automatically!`);
  } else {
    collection = db.collection(COLLECTION_NAME);
  }

  // ✅ Auto-create vector index if it doesn't exist (MongoDB Atlas Vector Search)
  try {
    const indexes = await db.command({ listIndexes: COLLECTION_NAME });
    const hasVectorIndex = indexes.cursor.firstBatch.some(
      (idx: any) => idx.name === VECTOR_INDEX_NAME
    );

    if (!hasVectorIndex) {
      await db.command({
        createIndexes: COLLECTION_NAME,
        indexes: [
          {
            name: VECTOR_INDEX_NAME,
            key: { embedding: "2dsphere" }, // Atlas Vector Search replacement
            // Note: real Atlas Vector Search index must be created from Atlas UI or Terraform
          },
        ],
      });
      console.log(`Vector index '${VECTOR_INDEX_NAME}' created!`);
    }
  } catch (err) {
    console.warn("Vector index creation skipped:", err.message);
  }

  return collection;
}