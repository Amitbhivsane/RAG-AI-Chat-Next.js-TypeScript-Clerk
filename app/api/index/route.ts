// import { NextRequest, NextResponse } from "next/server";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// import { connectDB } from "@/lib/mongodb";
// import { CustomEmbeddings } from "@/lib/embeddings";
// import fs from "fs";
// import { splitter } from "@/lib/splitter";


// export async function POST(req: NextRequest) {
//   try {
//     const arrayBuffer = await req.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const tempFilePath = "./temp-upload.pdf";
//     fs.writeFileSync(tempFilePath, buffer);

//     const loader = new PDFLoader(tempFilePath);
//     const docs = await loader.load();

//     if (!docs.length || !docs[0].pageContent)
//       return NextResponse.json({ error: "PDF has no text" }, { status: 400 });

//     const splitDocs = await splitter.splitDocuments(docs);
//     const texts = splitDocs.map((d) => d.pageContent);

//     const embeddingsClient = new CustomEmbeddings(process.env.OPENROUTER_API_KEY!);
//     const vectors = await embeddingsClient.embedDocuments(texts);

//     const collection = await connectDB();

//     // Clear previous docs for dynamic PDF replacement
//     await collection.deleteMany({});

//     const data = splitDocs.map((doc, i) => ({
//       text: doc.pageContent,
//       embedding: vectors[i],
//       metadata: doc.metadata || {},
//       createdAt: new Date(),
//     }));

//     await collection.insertMany(data);

//     fs.unlinkSync(tempFilePath);

//     return NextResponse.json({ success: true, count: data.length });
//   } catch (err) {
//     console.error("PDF Indexing Error:", err);
//     return NextResponse.json({ error: (err as Error).message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { connectDB } from "@/lib/mongodb";
import { CustomEmbeddings } from "@/lib/embeddings";
import fs from "fs";
import { splitter } from "@/lib/splitter";

export async function POST(req: NextRequest) {
  try {
    // ✅ FIX: read FormData properly
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempFilePath = "./temp-upload.pdf";
    fs.writeFileSync(tempFilePath, buffer);

    // 📄 Load PDF
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    console.log("Docs:", docs.length);

    if (!docs.length || !docs[0].pageContent) {
      return NextResponse.json({ error: "PDF has no text" }, { status: 400 });
    }

    // ✂️ Split
    const splitDocs = await splitter.splitDocuments(docs);

    const texts = splitDocs.map((d) => d.pageContent);

    console.log("Chunks:", texts.length);

    if (!texts.length) {
      return NextResponse.json({ error: "No chunks created" }, { status: 400 });
    }

    // 🤖 Embeddings
    const embeddingsClient = new CustomEmbeddings(
      process.env.OPENROUTER_API_KEY!
    );

    const vectors = await embeddingsClient.embedDocuments(texts);

    // 🗂 DB
    const collection = await connectDB();

    await collection.deleteMany({}); // optional

    const data = splitDocs.map((doc, i) => ({
      text: doc.pageContent,
      embedding: vectors[i],
      metadata: doc.metadata || {},
      createdAt: new Date(),
    }));

    await collection.insertMany(data);

    // 🧹 cleanup
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({
      success: true,
      count: data.length,
    });

  } catch (err) {
    console.error("PDF Indexing Error:", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}