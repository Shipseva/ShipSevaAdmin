import React from 'react';
import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#363636',
    color: '#fff',
  },
};

// Success toast
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    style: {
      background: '#10B981',
      color: '#fff',
    },
  });
};

// Error toast
export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    style: {
      background: '#EF4444',
      color: '#fff',
    },
  });
};

// Info toast
export const showInfoToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    style: {
      background: '#3B82F6',
      color: '#fff',
    },
  });
};

// Warning toast
export const showWarningToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    style: {
      background: '#F59E0B',
      color: '#fff',
    },
  });
};

// Get error message from API error
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred';
};

// Get success message from API response
export const getSuccessMessage = (response: any, defaultMessage: string): string => {
  if (response?.message) {
    return response.message;
  }
  
  if (response?.data?.message) {
    return response.data.message;
  }
  
  return defaultMessage;
};
