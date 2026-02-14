import { useState } from "react";
import { uploadContent } from "../services/api";

export default function UploadPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!text && !file) {
      alert("Enter text or select file");
      return;
    }

    const formData = new FormData();

    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    formData.append("expiryOption", expiry || "10s");

    try {
      setLoading(true);
      const res = await uploadContent(formData);
      const id = res.link.split("/").pop();
      const frontendBase = window.location.origin;
      const link = `${frontendBase}/view/${response.linkId}`;
      setLink(link);
    } catch (err) {
        setLink("");
        alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">LinkVault</h1>

        <textarea
          placeholder="Enter text to share..."
          className="w-full border rounded-lg p-3 mb-4 h-32"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="text-center mb-4">OR</div>

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label className="block mb-2 font-medium">Auto delete after</label>

        <select
          className="w-full border rounded-lg p-3 mb-6"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        >
          <option value="10s">10 seconds (dev)</option>
          <option value="10m">10 minutes</option>
          <option value="1h">1 hour</option>
          <option value="24h">24 hours</option>
        </select>

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Generate Secure Link"}
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center">
        Content is private and accessible only via the generated link.
        </p>


        {link && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm mb-2">Your secure link:</p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 break-all"
            >
              {link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
