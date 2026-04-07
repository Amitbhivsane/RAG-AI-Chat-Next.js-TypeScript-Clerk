"use client";

import ChatBox from "@/components/ChatBox";
import { Show, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white">

      <h1 className="text-xl font-bold p-4">RAG Chat</h1>

      {/* Hero */}
      <section className="text-center mt-6 max-w-2xl px-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ask Anything From Your Documents 📄
        </h2>
        <p className="text-gray-400 mt-4">
          Upload PDFs and chat with your data using AI-powered RAG system.
        </p>
      </section>

      {/* ❌ Not Logged In */}
      <Show when="signed-out">
        <div className="mt-10">
          <SignInButton>
            <button className="bg-blue-600 px-6 py-3 rounded-lg">
              Login to use Chat
            </button>
          </SignInButton>
        </div>
      </Show>

      {/* ✅ Logged In */}
      <Show when="signed-in">
        <div className="mt-10 w-full max-w-2xl px-4">
          <ChatBox />
        </div>
      </Show>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-500 text-sm">
        Built with ❤️ using Next.js + Tailwind
      </footer>

    </div>
  );
}