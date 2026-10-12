import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    favoriteCityIds: [],
    recentlyViewedCityIds: [],
  },
  reducers: {
    toggleFavorite(state, action) {
      const cityId = action.payload;

      state.favoriteCityIds = state.favoriteCityIds.includes(cityId)
        ? state.favoriteCityIds.filter((id) => id !== cityId)
        : [...state.favoriteCityIds, cityId];
    },
    addRecentlyViewed(state, action) {
      const cityId = action.payload;

      state.recentlyViewedCityIds = [
        cityId,
        ...state.recentlyViewedCityIds.filter((id) => id !== cityId),
      ];
    },
  },
});

export const { addRecentlyViewed, toggleFavorite } = weatherSlice.actions;

export const selectFavoriteCityIds = (state) => state.weather.favoriteCityIds;
export const selectRecentlyViewedCityIds = (state) =>
  state.weather.recentlyViewedCityIds;

export default weatherSlice.reducer;
