// "use client";
// import { useState } from "react";
// import Upload from "./Upload";

// export default function ChatBox() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

//   const ask = async () => {
//     if (!question) return;

//     setMessages([...messages, { text: question, isUser: true }]);
//     const res = await fetch("/api/query", { method: "POST", body: JSON.stringify({ question }) });
//     const data = await res.json();

//     setMessages((prev) => [...prev, { text: data.answer, isUser: false }]);
//     setQuestion("");
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <Upload />

//       <div className="flex gap-2 mb-4 mt-4">
//         <input className="border p-2 flex-1" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question..." />
//         <button className="bg-blue-500 text-white p-2 rounded" onClick={ask}>Ask</button>
//       </div>

//       <div className="space-y-2">
//         {messages.map((msg, i) => (
//           <div key={i} className={`p-2 rounded ${msg.isUser ? "bg-blue-100" : "bg-gray-100"}`}>
//             {msg.text}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import Upload from "./Upload";
// import Message from "./Message";

// export default function ChatBox() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState<
//     { text: string; isUser: boolean }[]
//   >([]);
//   const [loading, setLoading] = useState(false);

//   const ask = async () => {
//     if (!question) return;

//     const userMessage = { text: question, isUser: true };
//     setMessages((prev) => [...prev, userMessage]);

//     setLoading(true);

//     try {
//       const res = await fetch("/api/query", {
//         method: "POST",
//         body: JSON.stringify({ question }),
//       });

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         { text: data.answer, isUser: false },
//       ]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { text: "❌ Error getting response", isUser: false },
//       ]);
//     }

//     setLoading(false);
//     setQuestion("");
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <Upload />

//       {/* INPUT */}
//       <div className="flex gap-2 mb-4 mt-4">
//         <input
//           className="border p-2 flex-1"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask a question..."
//         />

//         <button
//           className="bg-blue-500 text-white p-2 rounded"
//           onClick={ask}
//         >
//           Ask
//         </button>
//       </div>

//       {/* LOADING */}
//       {loading && <p className="text-gray-500">⏳ Thinking...</p>}

//       {/* CHAT */}
//       <div className="space-y-2">
//         {messages.map((msg, i) => (
//           <Message key={i} text={msg.text} isUser={msg.isUser} />
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Upload from "./Upload";
import Message from "./Message";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);

 const ask = async () => {
  if (!question) return;

  const userMessage = { text: question, isUser: true };

  setLoading(true);

  try {
    const res = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    const botMessage = { text: data.answer, isUser: false };

    // ✅ ADD BOTH TOGETHER (Question first, then Answer)
    setMessages((prev) => [
      userMessage,
      botMessage,
      ...prev,
    ]);
  } catch (error) {
    setMessages((prev) => [
      userMessage,
      { text: "❌ Error getting response", isUser: false },
      ...prev,
    ]);
  }

  setLoading(false);
  setQuestion("");
};

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Upload />

      {/* INPUT */}
      <div className="flex gap-2 mb-4 mt-4">
        <input
          className="border p-2 flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={ask}
        >
          Ask
        </button>
      </div>

      {loading && <p className="text-white">⏳ Thinking...</p>}

      {/* ✅ Latest message FIRST */}
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
    </div>
  );
}