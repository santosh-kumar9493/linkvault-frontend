const API_BASE = "https://linkvault-backend-production-f489.up.railway.app";

export const uploadContent = async (formData) => {
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
};
