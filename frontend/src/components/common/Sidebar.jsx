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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                ExpenseFlow
              </span>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider">SMART TRACKER</div>
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
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Ultra-Professional Developer Branding Card */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 shadow-lg text-center relative overflow-hidden group">
          <div className="text-[9px] uppercase tracking-widest font-black text-indigo-400 flex items-center justify-center gap-1 mb-1">
            <Code2 className="w-3 h-3 text-indigo-400 animate-pulse" />
            Designed & Developed by
          </div>
          <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-300">
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
