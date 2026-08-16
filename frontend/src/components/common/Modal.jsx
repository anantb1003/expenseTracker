import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full ${maxWidth} glass-panel bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden transform transition-all duration-200 animate-scale-in`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 dark:border-white/10">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
