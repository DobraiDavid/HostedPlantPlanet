import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const showToast = useCallback((message, type = 'success', options = {}) => {
    
    // Ensure message is a string
    const safeMessage = message ? message.toString() : 'Unknown message';

    // Use direct toast methods
    switch(type) {
      case 'success':
        toast.success(safeMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          ...options
        });
        break;
      case 'error':
        toast.error(safeMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          ...options
        });
        break;
      default:
        toast(safeMessage, {
          position: "top-right",
          autoClose: 5000,
          ...options
        });
    }
    
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};