import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_BASE}/content/${id}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed");
        return;
      }
      setData(json);
    };

    load();
  }, [id]);

  if (error === "Link expired")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 shadow rounded text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-3">
            Link Expired
          </h1>
          <p className="text-gray-600 mb-4">
            This secure link is no longer available.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Create New Link
          </a>
        </div>
      </div>
    );

  if (error) return <div className="p-6">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  if (data.type === "text")
    return <pre className="p-6">{data.text}</pre>;

  return (
    <div className="p-6">
      <iframe
        src={data.previewUrl}
        className="w-full h-96 mb-3 border"
        title="preview"
      />
      <a
        href={data.downloadUrl}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download
      </a>
      <p className="mt-3 text-sm text-gray-500">
        Views: {data.views}
      </p>
    </div>
  );
}
