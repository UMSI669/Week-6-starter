import { createSlice } from '@reduxjs/toolkit';

import { signedOut } from './authSlice';
////cmt: use redux to create a slice of the favorite movie status.
// IDs of the signed-in user's favorite movies. The movie data itself is server
// state and comes from TMDB (see services/tmdbApi.js).
const favoritesSlice = createSlice({
  name: 'favorites',
  //cmt: The initialState store the favorite ID list.
  initialState: { ids: [] },
  reducers: {
    setFavorites: (state, action) => {
      state.ids = action.payload;
    },
    toggleFavorite: (state, action) => {
      const movieId = action.payload;
      if (state.ids.includes(movieId)) {
        state.ids = state.ids.filter((id) => id !== movieId);
      } else {
        state.ids = [...state.ids, movieId];
      }
    },
  },
  //cmt: When the user signs out, the signedOut action happens, extraReducers will clear the favorite status.
  extraReducers: (builder) => {
    // Don't show the previous user's favorites after signing out.
    builder.addCase(signedOut, (state) => {
      state.ids = [];
    });
  },
});

export const { setFavorites, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
