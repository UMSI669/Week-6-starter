export function formatGeocodeLabel(result) {
  return [result?.name, result?.state, result?.country].filter(Boolean).join(', ');
}

export function formatCoordinates(result) {
  return { lat: Number.isFinite(result?.lat) ? result.lat.toFixed(4) : '', lon: Number.isFinite(result?.lon) ? result.lon.toFixed(4) : '' };
}
