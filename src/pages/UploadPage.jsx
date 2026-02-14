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
      if (mode === "file" && !file) {
        toast.error("Select a file first");
        return;
      }

      if (mode === "file" && file.size > 5 * 1024 * 1024) {
        toast.error("Max file size is 5MB");
        return;
      }

      if (mode === "text" && !text.trim()) {
        toast.error("Enter text first");
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">LinkVault</h1>

      {/* Toggle */}
      <div className="flex mb-4 border rounded overflow-hidden">
        <button
          className={`flex-1 p-2 ${
            mode === "text" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setMode("text")}
        >
          Text
        </button>
        <button
          className={`flex-1 p-2 ${
            mode === "file" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setMode("file")}
        >
          File
        </button>
      </div>

      {mode === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="w-full border p-2 mb-3"
        />
      )}

      {mode === "file" && (
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
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
        One-time view
      </label>

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Generate Link
      </button>

      {link && (
        <div className="mt-4 border p-3 break-all">
          <a href={link}>{link}</a>
        </div>
      )}
    </div>
  );
}
