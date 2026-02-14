import { useState } from "react";
import API_BASE from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function UploadPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("10m");
  const [oneTime, setOneTime] = useState(false);
  const [link, setLink] = useState("");

  const upload = async () => {
    try {
      if (mode === "text" && !text.trim())
        return toast.error("Enter text");
      if (mode === "file" && !file)
        return toast.error("Select file");

      const fd = new FormData();
      if (mode === "text") fd.append("text", text);
      if (mode === "file") fd.append("file", file);
      if (password) fd.append("password", password);
      fd.append("expiryOption", expiry);
      fd.append("oneTimeView", oneTime);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const generated = `${window.location.origin}/view/${data.linkId}`;
      setLink(generated);
      toast.success("Secure link created");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Copied");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Toaster />
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 LinkVault</h1>

        {/* Toggle */}
        <div className="flex border rounded overflow-hidden mb-5">
          <button
            className={`flex-1 py-2 ${
              mode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setMode("text")}
          >
            Text
          </button>
          <button
            className={`flex-1 py-2 ${
              mode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setMode("file")}
          >
            File
          </button>
        </div>

        {mode === "text" && (
          <textarea
            className="w-full border rounded p-3 mb-4"
            placeholder="Enter secure text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {mode === "file" && (
          <input
            type="file"
            className="mb-4"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        <select
          className="w-full border rounded p-3 mb-4"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        >
          <option value="10m">Expires in 10 minutes</option>
          <option value="1h">Expires in 1 hour</option>
          <option value="24h">Expires in 24 hours</option>
        </select>

        <input
          type="password"
          placeholder="Optional password"
          className="w-full border rounded p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="flex items-center gap-2 mb-5 text-sm">
          <input
            type="checkbox"
            checked={oneTime}
            onChange={(e) => setOneTime(e.target.checked)}
          />
          View only once (self-destruct)
        </label>

        <button
          onClick={upload}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Generate Secure Link
        </button>

        {link && (
          <div className="mt-5 border rounded p-4 relative bg-gray-50">
            <a href={link} className="text-blue-600 break-all">
              {link}
            </a>

            <button
              onClick={copy}
              className="absolute top-2 right-2"
            >
              📋
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
