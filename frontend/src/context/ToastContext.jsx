import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../components/Admin/ToastNotification/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random(); // unique id
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Listen for global toast events
  React.useEffect(() => {
    const handleGlobalToast = (e) => {
      const { message, type } = e.detail;
      addToast(message, type);
    };

    window.addEventListener('showToast', handleGlobalToast);
    return () => {
      window.removeEventListener('showToast', handleGlobalToast);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};