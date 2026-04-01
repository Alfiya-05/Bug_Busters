import axios from "axios";

// In dev, Vite proxies /api → http://localhost:3000 (see vite.config.js)
export const api = axios.create({
  baseURL: "/",
  timeout: 60000
});

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/api/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function fetchAnalysis() {
  const { data } = await api.get("/api/analyze");
  return data;
}

export async function generateInsights(summary) {
  const { data } = await api.post("/api/insights", { summary });
  return data;
}

