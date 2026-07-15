const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export function fetchVideos() {
  return request("/videos").then((payload) => payload.data);
}

export function likeVideo(id) {
  return request(`/videos/${id}/like`, { method: "POST" }).then((payload) => payload.data);
}

export function shareVideo(id, platform = "link") {
  return request(`/videos/${id}/share`, {
    method: "POST",
    body: JSON.stringify({ platform })
  }).then((payload) => payload.data);
}
