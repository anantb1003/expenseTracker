import React, { useState } from 'react';
import { Code2, Mail, Check, Sparkles, Heart } from 'lucide-react';

const DeveloperFooter = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('anantb1003@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full relative z-10 pt-6 pb-4 px-4 flex justify-center">
      <div className="group relative inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-800/90 shadow-[0_8px_32px_0_rgba(79,70,229,0.15)] backdrop-blur-xl hover:border-indigo-500/40 hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.3)] transition-all duration-300">
        
        {/* Animated Avatar / Icon Badge */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        {/* Text Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
              Designed & Developed by
            </span>
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse hidden sm:inline" />
          </div>
          <a
            href="mailto:anantb1003@gmail.com"
            className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300 hover:from-indigo-300 hover:to-pink-300 transition-all"
          >
            Anant Bawaskar
          </a>
        </div>

        {/* Email Pill Badge */}
        <button
          onClick={handleCopyEmail}
          title="Click to copy email"
          className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-[11px] font-mono font-medium transition-all duration-200 active:scale-95 ml-1"
        >
          <Mail className="w-3 h-3" />
          <span>anantb1003@gmail.com</span>
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-sans font-bold shadow-lg animate-bounce">
              Copied!
            </span>
          )}
        </button>
      </div>
    </footer>
  );
};

export default DeveloperFooter;
