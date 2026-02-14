import { useState } from "react";
import API_BASE from "../services/api";

export default function UploadPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("10m");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);
      formData.append("expiryOption", expiry);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Build frontend link using returned linkId
      const link = `${window.location.origin}/view/${data.linkId}`;
      setGeneratedLink(link);
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-xl font-bold mb-6 text-center">LinkVault</h1>

        <textarea
          placeholder="Enter text to share..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <select
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        >
          <option value="10s">10 seconds (dev)</option>
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

        {generatedLink && (
          <div className="mt-6 text-center">
            <p className="text-sm mb-2">Your secure link:</p>
            <a
              href={generatedLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 break-all"
            >
              {generatedLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
