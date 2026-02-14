import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../services/api";
import toast from "react-hot-toast";

export default function ViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/content/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-center">Loading...</div>;

  const copyText = async () => {
    await navigator.clipboard.writeText(data.text);
    toast.success("Copied");
  };

  // TEXT VIEW
  if (data.type === "text")
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 max-w-xl w-full relative">
          <p className="text-xs text-gray-500 mb-2">Secure Text</p>

          <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
            {data.text}
          </div>

          <button
            onClick={copyText}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
            title="Copy"
          >
            📋
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              Expires: {new Date(data.expiresAt).toLocaleString()}
            </p>
            <p>Views: {data.views}</p>
          </div>
        </div>
      </div>
    );

  // FILE VIEW
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl w-full text-center">
        <h2 className="font-semibold mb-3">{data.fileName}</h2>

        <iframe
          src={data.previewUrl}
          className="w-full h-96 border rounded mb-4"
          title="preview"
        />

        <a
          href={data.downloadUrl}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Download
        </a>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            Expires: {new Date(data.expiresAt).toLocaleString()}
          </p>
          <p>Views: {data.views}</p>
        </div>
      </div>
    </div>
  );
}
