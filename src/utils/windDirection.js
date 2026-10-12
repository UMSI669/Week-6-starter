const DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export function windDirection(degrees) {
  if (!Number.isFinite(degrees)) return '—';
  return DIRECTIONS[Math.round(((degrees % 360 + 360) % 360) / 22.5) % 16];
}
