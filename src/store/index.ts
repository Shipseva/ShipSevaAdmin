import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import { useDispatch } from "react-redux";
import { authApi, userApi, kycApi, orderApi } from "./api";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [kycApi.reducerPath]: kycApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(kycApi.middleware)
      .concat(orderApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook for dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
