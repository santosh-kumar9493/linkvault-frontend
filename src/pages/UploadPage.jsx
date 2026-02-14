import { useState } from "react";
import API_BASE from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function UploadPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("10m");
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
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <Toaster />

      <div className="bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-8 w-full max-w-xl transition-all">
        <h1 className="text-2xl font-bold text-center mb-6">
          🔐 LinkVault
        </h1>

        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border mb-5">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 font-medium transition ${
              mode === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("file")}
            className={`flex-1 py-2 font-medium transition ${
              mode === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            File
          </button>
        </div>

        {/* Text */}
        {mode === "text" && (
          <textarea
            className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Enter secure text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {/* Drag Drop */}
        {mode === "file" && (
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center mb-4 cursor-pointer hover:bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
          >
            <p className="text-gray-600 mb-2">
              Drag & drop file here or click
            </p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mx-auto"
            />
            {file && (
              <p className="text-sm text-green-600 mt-2">
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
          placeholder="Optional password protection"
          className="w-full border rounded-lg p-3 mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={upload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Generate Secure Link
        </button>

        {/* Result */}
        {link && (
          <div className="mt-6 bg-gray-50 border rounded-lg p-4 relative">
            <a
              href={link}
              target="_blank"
              className="text-blue-600 break-all"
            >
              {link}
            </a>

            <button
              onClick={copy}
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