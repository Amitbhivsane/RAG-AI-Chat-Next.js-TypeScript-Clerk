// "use client";
// import { useState } from "react";

// export default function Upload() {
//   const [file, setFile] = useState<File | null>(null);

//   const upload = async () => {
//     if (!file) return alert("Select a PDF first!");

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch("/api/index", { method: "POST", body: file });
//     const data = await res.json();

//     alert(`Indexed ${data.count} chunks!`);
//   };

//   return (
//     <div className="p-4">
//       <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
//       <button onClick={upload} className="bg-green-500 text-white p-2 ml-2">
//         Upload
//       </button>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const upload = async () => {
    if (!file) {
      setStatus("❌ Please select a PDF first");
      return;
    }

    try {
      setStatus("⏳ Uploading & indexing...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/index", {
        method: "POST",
        body: formData, // ✅ FIXED (you were sending file directly)
      });

      const data = await res.json();

      setStatus(`✅ Indexed ${data.count} chunks successfully!`);
    } catch (error) {
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        className="bg-green-500 text-white p-2 ml-2 rounded"
      >
        Upload
      </button>

      {/* ✅ STATUS MESSAGE */}
      {status && (
        <p className="mt-2 text-sm text-white">{status}</p>
      )}
    </div>
  );
}