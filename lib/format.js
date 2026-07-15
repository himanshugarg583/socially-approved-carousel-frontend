export function formatCount(value) {
  const number = Number(value) || 0;
  if (number < 1000) return String(number);
  const thousands = number / 1000;
  const rounded = thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
  return `${rounded}k`;
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function initials(handle) {
  return (handle || "")
    .replace(/[^a-z]/gi, "")
    .slice(0, 2)
    .toUpperCase();
}

export function shareLink(id) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/socially-approved?v=${id}`;
}
