import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-[#0780AA] text-white border-0',
          icon: 'text-white',
          text: 'text-white',
          button: 'text-white hover:text-gray-200',
          timerBar: 'bg-white'
        };
      case 'error':
        return {
          container: 'bg-red-50 border border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          button: 'text-red-600 hover:text-red-800',
          timerBar: 'bg-red-500'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-800',
          button: 'text-yellow-600 hover:text-yellow-800',
          timerBar: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          button: 'text-blue-600 hover:text-blue-800',
          timerBar: 'bg-blue-500'
        };
    }
  };

  const styles = getToastStyles();

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Toast - positioned above everything without full-screen backdrop */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-in">
        <div className={`relative overflow-hidden rounded-lg shadow-xl max-w-md min-w-[320px] ${styles.container}`}>
          {/* Main content */}
          <div className="flex items-center gap-3 px-6 py-4">
            {renderIcon()}
            <p className={`text-sm font-medium flex-1 ${styles.text}`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className={`ml-2 transition-colors ${styles.button}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Timer bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
            <div 
              className={`h-full ${styles.timerBar} animate-timer-bar`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast;
