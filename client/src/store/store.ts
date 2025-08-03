import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';
import ordersReducer from './slices/ordersSlice';
import tablesReducer from './slices/tablesSlice';
import reservationsReducer from './slices/reservationsSlice';
import inventoryReducer from './slices/inventorySlice';
import feedbackReducer from './slices/feedbackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    orders: ordersReducer,
    tables: tablesReducer,
    reservations: reservationsReducer,
    inventory: inventoryReducer,
    feedback: feedbackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
