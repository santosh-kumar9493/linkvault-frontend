import { useState } from "react";
import API_BASE from "../services/api";

export default function UploadPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("10m");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setLoading(true);
      setLink("");

      const formData = new FormData();
      if (mode === "text" && text) formData.append("text", text);
      if (mode === "file" && file) formData.append("file", file);
      formData.append("expiryOption", expiry);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const generated = `${window.location.origin}/view/${data.linkId}`;
      setLink(generated);
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    alert("Link copied");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6">LinkVault</h1>

        {/* Toggle */}
        <div className="flex mb-6 border rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 ${
              mode === "text" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setMode("text")}
          >
            Text
          </button>
          <button
            className={`flex-1 py-2 ${
              mode === "file" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setMode("file")}
          >
            File
          </button>
        </div>

        {mode === "text" && (
          <textarea
            placeholder="Enter text to share..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 h-32"
          />
        )}

        {mode === "file" && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
        )}

        <select
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        >
          <option value="10m">10 minutes</option>
          <option value="1h">1 hour</option>
          <option value="24h">24 hours</option>
        </select>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Generate Secure Link"}
        </button>

        {link && (
          <div className="mt-6 bg-gray-50 border rounded-lg p-4 relative">
            <p className="text-sm mb-2">Your secure link</p>

            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 break-all"
            >
              {link}
            </a>

            {/* Copy icon top-right */}
            <button
              onClick={copyLink}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              title="Copy"
            >
              📋
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
