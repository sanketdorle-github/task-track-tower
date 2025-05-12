
import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './slices/boardsSlice';
import tasksReducer from './slices/tasksSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    tasks: tasksReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
