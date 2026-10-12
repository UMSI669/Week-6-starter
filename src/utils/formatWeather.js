import { WEATHER_UNITS } from '../config/weather';

export function formatNumber(value, unit = '', decimals = 0) {
  return Number.isFinite(value) ? `${value.toFixed(decimals)}${unit}` : '—';
}
export function formatTemperature(value) {
  return formatNumber(value, WEATHER_UNITS === 'metric' ? '°C' : WEATHER_UNITS === 'imperial' ? '°F' : ' K');
}
export function formatWindSpeed(value) {
  return formatNumber(value, WEATHER_UNITS === 'imperial' ? ' mph' : ' m/s', 1);
}
