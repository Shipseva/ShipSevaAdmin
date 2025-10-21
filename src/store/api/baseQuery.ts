import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "@/store/slices/adminSlice";
import { showSuccessToast, showErrorToast, getErrorMessage, getSuccessMessage } from "@/utils/toast";

// Combined base query that handles 401 errors globally and shows toasts
export const createBaseQuery = (baseUrl: string, excludeAuthApis = false) => {
  return fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as any).admin?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    fetchFn: async (...args) => {
      const response = await fetch(...args);
      
      // Check for 401 Unauthorized
      if (response.status === 401) {
        console.log('🚨 401 Unauthorized - Auto logout triggered');
        
        // Only auto-logout if not from auth APIs
        if (!excludeAuthApis) {
          // Dispatch logout action
          if (typeof window !== 'undefined') {
            // Import store dynamically to avoid circular dependency
            import('@/store').then(({ store }) => {
              store.dispatch(logout());
            });
          }
        }
      }
      
      return response;
    },
  });
};

// Enhanced base query with both 401 handling and toast notifications
export const createBaseQueryWithToasts = (baseUrl: string, excludeAuthApis = false) => {
  const baseQuery = createBaseQuery(baseUrl, excludeAuthApis);
  
  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Show toasts based on result
    if (typeof window !== 'undefined' && result.error) {
      const errorMessage = getErrorMessage(result.error);
      showErrorToast(errorMessage);
    } else if (typeof window !== 'undefined' && result.data) {
      // Only show success toast for mutations, not queries
      if (args.method && args.method !== 'GET') {
        const successMessage = getSuccessMessage(result.data, 'Operation completed successfully');
        showSuccessToast(successMessage);
      }
    }
    
    return result;
  };
};
