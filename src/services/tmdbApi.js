import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { toMovieDetails, toMoviePage } from './tmdbMappers';

// Server state: everything that comes from The Movie Database (TMDB).
// RTK Query caches each response in the Redux store and shares it between
// screens, so e.g. the genre list is fetched once and reused everywhere.
//
// Add EXPO_PUBLIC_TMDB_TOKEN (your TMDB "API Read Access Token") to .env.
const TMDB_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

export const hasTmdbToken = Boolean(TMDB_TOKEN);

// Sort options shown in the UI, mapped to TMDB's discover `sort_by` values.
export const SORT_OPTIONS = {
  rating: { label: 'Rating', sortBy: 'vote_average.desc' },
  date: { label: 'Release date', sortBy: 'primary_release_date.desc' },
};

// Ignore movies with only a handful of votes, so "top rated" means something.
const MIN_VOTE_COUNT = 300;
//cmt: use the API to fetch data, this doc is for API service only
export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3/',
    prepareHeaders: (headers) => {
      if (TMDB_TOKEN) {
        headers.set('Authorization', `Bearer ${TMDB_TOKEN}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchMovies: builder.query({
      query: (searchText) => ({
        url: 'search/movie',
        params: { query: searchText },
      }),
      transformResponse: toMoviePage,
    }),

    // Browse by genre and sort order when the user hasn't typed a search.
    discoverMovies: builder.query({
      query: ({ genreId, sort }) => ({
        url: 'discover/movie',
        params: {
          sort_by: SORT_OPTIONS[sort].sortBy,
          'vote_count.gte': MIN_VOTE_COUNT,
          'primary_release_date.lte': new Date().toISOString().slice(0, 10),
          ...(genreId ? { with_genres: genreId } : {}),
        },
      }),
      transformResponse: toMoviePage,
    }),

    trendingMovies: builder.query({
      query: () => 'trending/movie/week',
      transformResponse: toMoviePage,
    }),

    topRatedMovies: builder.query({
      query: () => 'movie/top_rated',
      transformResponse: toMoviePage,
    }),

    // Returns a list of { id, name }.
    genres: builder.query({
      query: () => 'genre/movie/list',
      transformResponse: (response) => response.genres,
      keepUnusedDataFor: 24 * 60 * 60, // genres rarely change; cache for a day
    }),

    // Details, cast, reviews and recommendations in a single request.
    movieDetails: builder.query({
      query: (id) => ({
        url: `movie/${id}`,
        params: { append_to_response: 'credits,reviews,recommendations' },
      }),
      transformResponse: toMovieDetails,
    }),
  }),
});

export const {
  useSearchMoviesQuery,
  useDiscoverMoviesQuery,
  useTrendingMoviesQuery,
  useTopRatedMoviesQuery,
  useGenresQuery,
  useMovieDetailsQuery,
} = tmdbApi;
