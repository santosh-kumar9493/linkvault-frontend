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
      if (mode === "file" && !file) return toast.error("Select file");
      if (mode === "text" && !text.trim())
        return toast.error("Enter text");

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
      toast.success("Link created");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Copied");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">LinkVault</h1>

      <div className="flex mb-4 border">
        <button className="flex-1" onClick={() => setMode("text")}>
          Text
        </button>
        <button className="flex-1" onClick={() => setMode("file")}>
          File
        </button>
      </div>

      {mode === "text" && (
        <textarea
          className="w-full border p-2 mb-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {mode === "file" && (
        <input
          type="file"
          className="mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}

      <select
        className="w-full border p-2 mb-3"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      >
        <option value="10m">10 minutes</option>
        <option value="1h">1 hour</option>
        <option value="24h">24 hours</option>
      </select>

      <input
        type="password"
        placeholder="Optional password"
        className="w-full border p-2 mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Generate Link
      </button>

      {link && (
        <div className="mt-4 border p-3 relative">
          <a href={link}>{link}</a>
          <button
            onClick={copy}
            className="absolute top-2 right-2"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}
