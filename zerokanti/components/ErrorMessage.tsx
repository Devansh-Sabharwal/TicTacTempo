// components/ErrorMessage.tsx
import React, { useEffect, useState } from 'react';

interface ErrorMessageProps {
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  duration = 5000,
  onDismiss 
}) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-xl flex items-center animate-fade-in-up">
        <span className="mr-2">{message}</span>
        <button 
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="ml-2 p-1 rounded-full hover:bg-red-600 transition-colors"
          aria-label="Dismiss error"
        >
          <span className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;