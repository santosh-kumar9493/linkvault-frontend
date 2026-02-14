import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";

export default function ViewPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/content/${id}`);
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to load");

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!data) return null;

  // TEXT VIEW
  if (data.type === "text") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Shared Text</h2>

          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {data.text}
          </pre>
        </div>
      </div>
    );
  }

  // FILE VIEW
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl text-center">
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
      </div>
    </div>
  );
}
