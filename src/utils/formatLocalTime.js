export function formatLocalTime(unix, timezone, includeDate = false) {
  if (!Number.isFinite(unix) || !Number.isFinite(timezone)) return '—';
  const date = new Date((unix + timezone) * 1000);
  if (!Number.isFinite(date.getTime())) return '—';
  const pad = (value) => String(value).padStart(2, '0');
  const time = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
  return includeDate ? `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${time}` : time;
}
