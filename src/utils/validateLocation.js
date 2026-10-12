export function validateLocation({ name, lat, lon }) {
  const errors = {};
  const trimmedName = name.trim();
  if (!trimmedName) errors.name = 'Enter a location name.';
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!lat.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.lat = 'Enter a latitude between -90 and 90.';
  }
  if (!lon.trim() || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.lon = 'Enter a longitude between -180 and 180.';
  }
  return { errors, valid: Object.keys(errors).length === 0, value: { name: trimmedName, lat: latitude, lon: longitude } };
}
