import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [needPassword, setNeedPassword] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      headers: password ? { "x-link-password": password } : {},
    });

    if (res.status === 401) return setNeedPassword(true);

    const json = await res.json();
    if (!res.ok) return setError(json.error);

    setNeedPassword(false);
    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  // Expired
  if (error === "Link expired")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            🔒 Link Expired
          </h1>
          <p className="text-gray-600 mb-4">
            This secure content is no longer available.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create New Link
          </a>
        </div>
      </div>
    );

  // Password screen
  if (needPassword)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-xl p-8 w-80">
          <h2 className="text-lg font-semibold mb-3">
            🔐 Password Required
          </h2>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full border rounded-lg p-2 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={load}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Unlock
          </button>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  // Text preview
  if (data.type === "text")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-xl p-6 max-w-xl w-full">
          <pre className="whitespace-pre-wrap">{data.text}</pre>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              Expires:{" "}
              {new Date(data.expiresAt).toLocaleString()}
            </p>
            <p>Views: {data.views}</p>
          </div>
        </div>
      </div>
    );

  // File preview
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl w-full text-center">
        <h2 className="font-semibold mb-3">{data.fileName}</h2>

        <iframe
          src={data.previewUrl}
          className="w-full h-96 border rounded mb-4"
          title="preview"
        />

        <a
          href={data.downloadUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Download
        </a>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            Expires:{" "}
            {new Date(data.expiresAt).toLocaleString()}
          </p>
          <p>Views: {data.views}</p>
        </div>
      </div>
    </div>
  );
}
