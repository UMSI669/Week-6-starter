import { createSlice, nanoid } from '@reduxjs/toolkit';

/** @type {{ items: { id: string, name: string, lat: number, lon: number }[], selectedId: string | null }} */
const initialState = { items: [], selectedId: null };

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation: {
      prepare: ({ name, lat, lon }) => ({ payload: { id: nanoid(), name, lat, lon } }),
      /** @param {import('@reduxjs/toolkit').PayloadAction<{ id: string, name: string, lat: number, lon: number }>} action */
      reducer(state, action) {
        const { payload } = action;
        state.items.push(payload);
        state.selectedId = payload.id;
      },
    },
    deleteLocation(state, { payload: id }) {
      state.items = state.items.filter((item) => item.id !== id);
      if (state.selectedId === id) state.selectedId = state.items[0]?.id ?? null;
    },
    selectLocation(state, { payload: id }) {
      if (state.items.some((item) => item.id === id)) state.selectedId = id;
    },
  },
});

export const { addLocation, deleteLocation, selectLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
