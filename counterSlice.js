import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({

  name: 'counter',

  initialState: { value: 0 },

  reducers: {

    increment: (state) => { state.value += 1; },

  },

});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './counterSlice';

export const store = configureStore({

  reducer: {

    counter: counterReducer,

  },

});
