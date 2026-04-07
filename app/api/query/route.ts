// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { CustomEmbeddings } from "@/lib/embeddings";

// export async function POST(req: NextRequest) {
//   try {
//     const { question } = await req.json();

//     // 1️⃣ Embed the question
//     const embeddingsClient = new CustomEmbeddings(process.env.OPENROUTER_API_KEY!);
//     const queryVector = await embeddingsClient.embedQuery(question);

//     // 2️⃣ Get vector search results from MongoDB
//     const collection = await connectDB();

//     const results = await collection
//   .aggregate([
//     {
//       $search: {
//         index: process.env.VECTOR_INDEX_NAME,
//         knnBeta: {
//           vector: queryVector,
//           path: "embedding",
//           k: 5,
//         },
//       },
//     },
//     {
//       $project: {
//         text: 1,
//         score: { $meta: "searchScore" },
//       },
//     },
//   ])
//   .toArray();

  

//     if (!results.length) {
//       return NextResponse.json({ answer: "No relevant results found." });
//     }

//     // 3️⃣ Combine top chunks
//     const combinedText = results.map(r => r.text).join("\n");

//     // 4️⃣ Send combinedText + question to LLM for a coherent answer
//   const prompt = `
// You are a helpful AI assistant.

// Answer the question ONLY using the given context.
// Give a short, clear, and direct answer.

// If the answer is not found, say "Not found in document".

// Context:
// ${combinedText}

// Question: ${question}

// Answer (in 2-3 lines):
// `;

// const llmRes = await fetch("https://openrouter.ai/api/v1/completions", {
//   method: "POST",
//   headers: {
//     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     model: "nvidia/nemotron-3-super-120b-a12b:free",
//     input: prompt,
//     max_tokens: 500,
//   }),
// });

// const llmData = await llmRes.json();
// const answer = llmData?.output?.[0]?.content?.[0]?.text || combinedText;

//     return NextResponse.json({ answer });
//   } catch (err) {
//     console.error("Query Error:", err);
//     return NextResponse.json({ error: (err as Error).message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CustomEmbeddings } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ answer: "Question is required" });
    }

    // 1️⃣ Embed question
    const embeddingsClient = new CustomEmbeddings(
      process.env.OPENROUTER_API_KEY!
    );
    const queryVector = await embeddingsClient.embedQuery(question);

    const collection = await connectDB();

    // 2️⃣ Vector search
    const results = await collection
      .aggregate([
        {
          $search: {
            index: process.env.VECTOR_INDEX_NAME,
            knnBeta: {
              vector: queryVector,
              path: "embedding",
              k: 5,
            },
          },
        },
        {
          $project: {
            text: 1,
            score: { $meta: "searchScore" },
          },
        },
      ])
      .toArray();

    if (!results.length) {
      return NextResponse.json({ answer: "No relevant results found." });
    }

    // ✅ 3️⃣ Filter low-quality chunks
    const filtered = results.filter((r) => r.score > 0.7);

    // fallback if all filtered out
    const topResults = filtered.length ? filtered.slice(0, 3) : results.slice(0, 3);

    // ✅ 4️⃣ Clean + limit context
    const combinedText = topResults
      .map((r, i) => `Chunk ${i + 1}:\n${r.text.slice(0, 300)}`)
      .join("\n\n");

    // ✅ 5️⃣ Strong prompt
    const prompt = `
You are a helpful AI assistant.

Answer ONLY from the context below.
Give a short, clear answer in 2-3 lines.
Do NOT copy the full text.

If answer is not found, say "Not found in document".

Context:
${combinedText}

Question: ${question}

Answer:
`;

    // ✅ 6️⃣ Call LLM (fixed format)
    const llmRes = await fetch("https://openrouter.ai/api/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        prompt: prompt,   // ✅ FIXED (was "input")
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const llmData = await llmRes.json();

    // ✅ 7️⃣ Correct parsing
    const answer =
      llmData?.choices?.[0]?.text ||
      llmData?.choices?.[0]?.message?.content ||
      "No answer generated";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Query Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}