import fetch from "node-fetch";

export class CustomEmbeddings {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
        input: texts,
      }),
    });
    const data = await res.json();
    if (!data.data) throw new Error("Embedding error");
    return data.data.map((e: any) => e.embedding);
  }

  async embedQuery(text: string): Promise<number[]> {
    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
        input: text,
      }),
    });
    const data = await res.json();
    if (!data.data) throw new Error("Embedding error");
    return data.data[0].embedding;
  }
}