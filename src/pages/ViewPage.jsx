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

    setData(json);
  };

  useEffect(() => {
    load();
  }, []);

  if (needPassword)
    return (
      <div className="p-6">
        <h2>Password Required</h2>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={load}>Unlock</button>
      </div>
    );

  if (error === "Link expired")
    return <div className="p-6">Link Expired</div>;

  if (!data) return <div className="p-6">Loading...</div>;

  if (data.type === "text")
    return <pre className="p-6">{data.text}</pre>;

  return (
    <div className="p-6">
      <iframe
        src={data.previewUrl}
        className="w-full h-96 border"
        title="preview"
      />
      <a href={data.downloadUrl}>Download</a>
      <p>Expires: {new Date(data.expiresAt).toLocaleString()}</p>
      <p>Views: {data.views}</p>
    </div>
  );
}
