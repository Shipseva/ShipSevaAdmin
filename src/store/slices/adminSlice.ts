import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

interface AdminState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  redirectUrl: string | null;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
}

const initialState: AdminState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  redirectUrl: null,
  sidebarCollapsed: false,
  theme: "light",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<{ admin: AdminUser; token: string }>) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.hasCheckedAuth = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthChecked: (state) => {
      state.hasCheckedAuth = true;
    },
    setRedirectUrl: (state, action: PayloadAction<string | null>) => {
      state.redirectUrl = action.payload;
    },
    clearRedirectUrl: (state) => {
      state.redirectUrl = null;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.hasCheckedAuth = true;
      state.redirectUrl = null;
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  },
});

export const { 
  setAdmin, 
  setLoading, 
  setAuthChecked, 
  setRedirectUrl, 
  clearRedirectUrl, 
  toggleSidebar, 
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
  logout 
} = adminSlice.actions;
export default adminSlice.reducer;
