import { useState } from "react";
import API_BASE from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function UploadPage() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [link, setLink] = useState("");

  const upload = async () => {
    try {
      if (mode === "file" && file && file.size > 5 * 1024 * 1024) {
        toast.error("Max file size is 5MB");
        return;
      }

      const fd = new FormData();
      if (mode === "text") fd.append("text", text);
      if (mode === "file") fd.append("file", file);
      if (password) fd.append("password", password);
      fd.append("oneTimeView", oneTime);
      fd.append("expiryOption", "10m");

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const generated = `${window.location.origin}/view/${data.linkId}`;
      setLink(generated);
      toast.success("Secure link created");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">LinkVault</h1>

      <div className="flex mb-4">
        <button
          className="flex-1 border p-2"
          onClick={() => setMode("text")}
        >
          Text
        </button>
        <button
          className="flex-1 border p-2"
          onClick={() => setMode("file")}
        >
          File
        </button>
      </div>

      {mode === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 mb-3"
          placeholder="Enter text..."
        />
      )}

      {mode === "file" && (
        <div className="mb-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="text-xs text-gray-500 mt-1">
            Max file size: 5MB
          </p>
        </div>
      )}

      <input
        type="password"
        placeholder="Optional password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-3"
      />

      <label className="block mb-3">
        <input
          type="checkbox"
          checked={oneTime}
          onChange={(e) => setOneTime(e.target.checked)}
        />{" "}
        One-time view (self-destruct)
      </label>

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Link
      </button>

      {link && (
        <div className="mt-4 border p-3 relative">
          <a href={link} className="text-blue-600 break-all">
            {link}
          </a>

          <button
            onClick={copyLink}
            className="absolute top-2 right-2"
            title="Copy"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}
