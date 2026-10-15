import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { WEATHER_CACHE_SECONDS, WEATHER_UNITS } from '../config/weather';
export { WEATHER_CACHE_SECONDS } from '../config/weather';
export const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY?.trim() ?? '';
export const MISSING_KEY_MESSAGE = 'Add EXPO_PUBLIC_OPENWEATHER_API_KEY to your local .env file, then restart Expo to load weather and city search.';

const baseQuery = fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org' });

export const openWeatherApi = createApi({
  reducerPath: 'openWeatherApi',
  baseQuery: (args, api, extraOptions) => API_KEY
    ? baseQuery(args, api, extraOptions)
    : { error: { status: 'CUSTOM_ERROR', error: MISSING_KEY_MESSAGE } },
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    getCurrentWeather: builder.query({
      query: ({ lat, lon }) => ({
        url: '/data/2.5/weather',
        params: { lat, lon, appid: API_KEY, units: WEATHER_UNITS },
      }),
      keepUnusedDataFor: WEATHER_CACHE_SECONDS,
    }),
    searchCities: builder.query({
      query: (query) => ({
        url: '/geo/1.0/direct',
        params: { q: query.trim(), limit: 5, appid: API_KEY },
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetCurrentWeatherQuery, useLazySearchCitiesQuery } = openWeatherApi;
