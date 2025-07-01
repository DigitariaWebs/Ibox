import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';

// Language slice for managing app language
const languageSlice = createSlice({
  name: 'language',
  initialState: {
    value: 'en',
  },
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'fr'>) => {
      state.value = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

// Sample counter slice for testing
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['language'],
};

const rootReducer = {
  counter: counterSlice.reducer,
  language: languageSlice.reducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  return {
    counter: rootReducer.counter(state?.counter, action),
    language: rootReducer.language(state?.language, action),
  };
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export const language = languageSlice.reducer;
export const counter = counterSlice.reducer; 