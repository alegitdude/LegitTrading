import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "./Features/Watchlist/watchlistSlice";
import chartsReducer from "./Features/Charts/chartsSlice";
import profileReducer from "./Features/Profile/profileSlice";
export const store = configureStore({
  reducer: {
    charts: chartsReducer,
    watchlist: watchlistReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
