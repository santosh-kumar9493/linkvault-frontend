import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/content/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed");
        }
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);

  // Countdown
  useEffect(() => {
    if (!data?.expiresAt) return;

    const interval = setInterval(() => {
      const expiry = new Date(data.expiresAt);
      const now = new Date();
      const sec = Math.max(0, Math.floor((expiry - now) / 1000));

      if (sec === 0) {
        setError("Link expired");
        clearInterval(interval);
        return;
      }

      if (sec < 60) setRemaining(`${sec} sec`);
      else if (sec < 3600) setRemaining(`${Math.floor(sec / 60)} min`);
      else setRemaining(`${Math.floor(sec / 3600)} hr`);
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const expiryDate = new Date(data.expiresAt);

  // TEXT VIEW
  if (data.type === "text") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Shared Text</h2>

          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {data.text}
          </pre>

          <button
            onClick={() => navigator.clipboard.writeText(data.text)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Copy
          </button>

          <p className="text-sm mt-4 text-gray-600">
            Expires in: <b>{remaining}</b>
          </p>

          <p className="text-xs text-gray-400">
            ({expiryDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })})
          </p>
        </div>
      </div>
    );
  }

  // FILE VIEW
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl text-center">
        <h2 className="text-xl font-bold mb-4">{data.fileName}</h2>

        {/* Preview (works for PDF, images, txt, some browsers) */}
        <iframe
          src={data.previewUrl}
          title="preview"
          className="w-full h-96 border rounded mb-4"
        />

        <a
          href={data.downloadUrl}
          className="bg-blue-600 text-white px-5 py-2 rounded inline-block"
        >
          Download
        </a>

        <p className="text-sm mt-4 text-gray-600">
          Expires in: <b>{remaining}</b>
        </p>

        <p className="text-xs text-gray-400">
          ({expiryDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })})
        </p>
      </div>
    </div>
  );
}
