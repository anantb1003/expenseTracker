import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer backdrop-blur-md';

  const variants = {
    primary: 'glass-btn-primary text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-white/30 font-black',
    secondary: 'glass-btn-secondary font-bold',
    danger: 'glass-btn-danger text-white shadow-rose-500/30 hover:shadow-rose-500/50 border border-white/30 font-black',
    outline: 'glass-btn bg-transparent text-slate-800 dark:text-slate-100 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 border border-indigo-500/40 dark:border-indigo-400/40 font-bold',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 font-bold rounded-xl',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
