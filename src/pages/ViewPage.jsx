import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";

export default function ViewPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed");
        setData(json);
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!data?.expiresAt) return;

    const timer = setInterval(() => {
      const diff = new Date(data.expiresAt) - new Date();
      if (diff <= 0) {
        setError("Link expired");
        clearInterval(timer);
        return;
      }

      const sec = Math.floor(diff / 1000);
      if (sec < 60) setRemaining(`${sec}s`);
      else if (sec < 3600) setRemaining(`${Math.floor(sec / 60)}m`);
      else setRemaining(`${Math.floor(sec / 3600)}h`);
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (data.type === "text") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Shared Text</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {data.text}
          </pre>
          <p className="text-sm text-gray-500 mt-4">
            Expires in: <b>{remaining}</b>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-center">
        <h2 className="text-xl font-bold mb-4">{data.fileName}</h2>

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

        <p className="text-sm text-gray-500 mt-4">
          Expires in: <b>{remaining}</b>
        </p>
      </div>
    </div>
  );
}
