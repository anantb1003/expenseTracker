import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  PieChart, 
  Calendar, 
  BarChart3, 
  Settings,
  Wallet,
  X,
  Code2
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Categories', path: '/categories', icon: Tag },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Recurring Costs', path: '/recurring', icon: Calendar },
  { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass-panel bg-white/75 dark:bg-slate-900/70 border-r border-white/50 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/30 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/30 animate-float">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 dark:from-white dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent font-heading">
                ExpenseFlow
              </span>
              <div className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> NEXT-GEN GLASS
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold text-sm transition-all duration-300 relative ${
                    isActive
                      ? 'glass-btn-primary text-white scale-[1.02] shadow-indigo-500/40 border border-white/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-white/30 dark:hover:border-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Ultra-Professional Developer Branding Card */}
        <div className="p-4 m-4 rounded-2xl glass-card bg-slate-900/90 dark:bg-slate-950/90 border border-indigo-500/40 shadow-2xl text-center relative overflow-hidden group">
          <div className="text-[9px] uppercase tracking-widest font-black text-indigo-400 flex items-center justify-center gap-1 mb-1">
            <Code2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Designed & Developed by
          </div>
          <div className="text-sm font-black text-gradient-metallic font-heading">
            Anant Bawaskar
          </div>
          <a
            href="mailto:anantb1003@gmail.com"
            className="text-[10px] font-mono text-indigo-300 hover:text-white hover:underline block mt-0.5"
          >
            anantb1003@gmail.com
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
