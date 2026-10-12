import { createSlice } from '@reduxjs/toolkit';
//cmt: use the redux to create a slice of the search query
// The search screen's filters. Kept in Redux (not component state) so they
// survive switching tabs and can be set from other screens, e.g. Explore.
const browseSlice = createSlice({
  name: 'browse',
  initialState: {
    query: '',
    genreId: null, // null means "All"
    sort: 'rating', // a key of SORT_OPTIONS in services/tmdbApi.js
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setGenre: (state, action) => {
      state.genreId = action.payload;
    },
    toggleSort: (state) => {
      state.sort = state.sort === 'rating' ? 'date' : 'rating';
    },
  },
});

export const { setQuery, setGenre, toggleSort } = browseSlice.actions;
export default browseSlice.reducer;
