// "use client";

// interface MessageProps {
//   text: string;
//   isUser?: boolean;
// }

// export default function Message({ text, isUser = false }: MessageProps) {
//   return (
//     <div
//       className={`p-2 mb-2 rounded ${
//         isUser ? "bg-blue-200 text-right" : "bg-gray-200 text-left"
//       }`}
//     >
//       {text}
//     </div>
//   );
// }

"use client";

interface MessageProps {
  text: string;
  isUser?: boolean;
}

export default function Message({ text, isUser = false }: MessageProps) {
  return (
    <div
      className={`p-2 mb-2 rounded max-w-[80%] ${
        isUser
          ? "bg-blue-400 ml-auto text-right"
          : "bg-gray-400 mr-auto text-left"
      }`}
    >
      {text}
    </div>
  );
}