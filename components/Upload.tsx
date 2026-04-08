"use client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const upload = async () => {
    if (!file) {
      setStatus("❌ Please select a PDF first");
      return;
    }

    try {
      setStatus("⏳ Uploading & indexing...");
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/index", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setStatus("❌ Server returned invalid response");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setStatus(`❌ ${data.error || "Upload failed"}`);
        setLoading(false);
        return;
      }

      setStatus(`✅ Indexed ${data.count ?? 0} chunks successfully!`);
      setFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      setStatus("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />

      {file && <p className="text-sm mb-2">Selected file: {file.name}</p>}

      <button
        onClick={upload}
        disabled={!file || loading}
        className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {status && (
        <p className={`mt-2 text-sm ${status.startsWith("❌") ? "text-red-400" : "text-green-400"}`}>
          {status}
        </p>
      )}
    </div>
  );
}