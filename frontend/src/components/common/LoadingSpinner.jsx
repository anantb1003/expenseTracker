import React from 'react';
import { Wallet } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading ExpenseFlow...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-indigo-500">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-glow" />

      {/* Loading Card */}
      <div className="relative z-10 flex flex-col items-center p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-4 max-w-sm w-full mx-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 animate-bounce">
          <Wallet className="w-7 h-7 text-white" />
        </div>

        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />

        <div className="space-y-1">
          <h3 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            ExpenseFlow
          </h3>
          <p className="text-xs text-slate-400 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
