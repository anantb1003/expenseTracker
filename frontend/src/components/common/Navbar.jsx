import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, Sparkles } from 'lucide-react';

const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 px-4 lg:px-8 py-3.5 transition-colors shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Left Mobile Menu Toggle & App Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 transition active:scale-95 border border-white/40 dark:border-white/10 shadow-sm"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Empty spacer or simple label if needed */}
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-3">
          {/* Rupee Currency Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 rounded-full px-3.5 py-1.5 text-xs font-black backdrop-blur-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>₹ INR</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 border border-white/40 dark:border-white/10 transition active:scale-95 backdrop-blur-xl shadow-sm"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/40 dark:border-white/10">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-indigo-500/30 border border-white/30 animate-float">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-black text-slate-900 dark:text-slate-100 font-heading">{user?.name || 'User'}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-2xl text-rose-500 hover:bg-rose-500/15 border border-rose-500/25 transition active:scale-95 ml-1 backdrop-blur-xl shadow-sm"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
