import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [needPassword, setNeedPassword] = useState(false);
  const [error, setError] = useState("");

  const load = async (pwd = password) => {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      headers: pwd ? { "x-link-password": pwd } : {},
    });

    if (res.status === 401) {
      setNeedPassword(true);
      return;
    }

    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed");
      return;
    }

    setNeedPassword(false);
    setData(json);
  };

  useEffect(() => {
    load("");
  }, []);

  if (error === "Link expired")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-xl">Link Expired</h1>
      </div>
    );

  if (needPassword)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow rounded p-6 w-80">
          <h2 className="font-semibold mb-3">🔐 Password Required</h2>
          <input
            type="password"
            className="w-full border p-2 rounded mb-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => load(password)}
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

  if (data.type === "text")
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow rounded p-6 max-w-xl w-full">
          <pre>{data.text}</pre>
          <p className="mt-4 text-sm text-gray-500">
            Expires: {new Date(data.expiresAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Views: {data.views}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow rounded p-6 max-w-2xl w-full text-center">
        <h2 className="mb-3 font-semibold">{data.fileName}</h2>

        <iframe
          src={data.previewUrl}
          className="w-full h-96 border mb-4"
          title="preview"
        />

        <a
          href={data.downloadUrl}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Download
        </a>

        <p className="mt-4 text-sm text-gray-500">
          Expires: {new Date(data.expiresAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">Views: {data.views}</p>
      </div>
    </div>
  );
}
