import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import locationsReducer from '../features/locations/locationsSlice';
import { openWeatherApi } from '../services/openWeatherApi';

const reducer = persistReducer({
  key: 'weatherly',
  storage: AsyncStorage,
  whitelist: ['locations'],
  blacklist: [openWeatherApi.reducerPath],
}, combineReducers({
  locations: locationsReducer,
  [openWeatherApi.reducerPath]: openWeatherApi.reducer,
}));

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
  }).concat(openWeatherApi.middleware),
});
export const persistor = persistStore(store);
