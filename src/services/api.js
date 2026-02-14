const API_BASE = import.meta.env.VITE_API_BASE;

export default API_BASE;


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
