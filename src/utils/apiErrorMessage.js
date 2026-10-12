export function apiErrorMessage(error) {
  if (!error) return '';
  if (error.status === 401) return 'Your OpenWeather key is invalid or not activated yet. New keys can take a while to activate.';
  if (error.status === 429) return 'OpenWeather is rate limited. Try again in a minute.';
  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') return 'Unable to connect. Check your internet connection and try again.';
  if (error.status === 'CUSTOM_ERROR') return error.error;
  return 'Unable to load OpenWeather data. Please try again later.';
}
