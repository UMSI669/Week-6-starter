import { configureStore } from '@reduxjs/toolkit';

import { tmdbApi } from '../services/tmdbApi';
import authReducer from './authSlice';
import browseReducer from './browseSlice';
import favoritesReducer from './favoritesSlice';

export { signedIn, signedOut } from './authSlice';
export { setGenre, setQuery, toggleSort } from './browseSlice';
export { setFavorites, toggleFavorite } from './favoritesSlice';

// One store holds both kinds of state:
// - client state: auth, favorites and browse slices (owned by this app)
// - server state: tmdbApi, RTK Query's cache of TMDB responses
export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    browse: browseReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tmdbApi.middleware),
});
