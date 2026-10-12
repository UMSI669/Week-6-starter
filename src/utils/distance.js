const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceMiles(start, end) {
  if (!start || !end) return null;

  const latitudeDifference = toRadians(end.latitude - start.latitude);
  const longitudeDifference = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  // TODO(student): Explain how the Haversine formula estimates distance on Earth.
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(distance) {
  if (distance === null || Number.isNaN(distance)) return null;
  return distance < 10 ? `${distance.toFixed(1)} mi` : `${Math.round(distance)} mi`;
}
