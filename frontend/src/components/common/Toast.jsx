import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-indigo-500 text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 mr-2" />,
    error: <AlertCircle className="w-5 h-5 mr-2" />,
    info: <Info className="w-5 h-5 mr-2" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center px-4 py-3 rounded-xl shadow-xl ${bgColors[type]} transition-all duration-300 transform translate-y-0`}>
      {icons[type]}
      <span className="text-sm font-medium pr-4">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
