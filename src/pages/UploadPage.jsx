import { useState } from "react";
import API_BASE from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function UploadPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
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

  // Drag handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <Toaster />

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 LinkVault</h1>

        {/* Mode Toggle */}
        <div className="flex border rounded-lg overflow-hidden mb-5">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 ${
              mode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("file")}
            className={`flex-1 py-2 ${
              mode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            File
          </button>
        </div>

        {/* TEXT */}
        {mode === "text" && (
          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            rows={4}
            placeholder="Enter secure text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {/* FILE + DRAG DROP */}
        {mode === "file" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <p className="text-gray-600 mb-2">
              Drag & drop file here or click below
            </p>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mx-auto"
            />

            {file && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                {file.name}
              </p>
            )}
          </div>
        )}

        {/* Expiry */}
        <select
          className="w-full border rounded-lg p-3 mb-4"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        >
          <option value="10m">Expires in 10 minutes</option>
          <option value="1h">Expires in 1 hour</option>
          <option value="24h">Expires in 24 hours</option>
        </select>

        {/* Password */}
        <input
          type="password"
          placeholder="Optional password"
          className="w-full border rounded-lg p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* One-time */}
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Generate Secure Link
        </button>

        {link && (
          <div className="mt-6 bg-gray-50 border rounded-xl p-4 shadow-inner relative">
            <p className="text-xs text-gray-500 mb-1">Your Secure Link</p>

            <div className="bg-white border rounded-lg p-3 break-all text-blue-600 font-medium">
              {link}
            </div>

            <button
              onClick={copy}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
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
