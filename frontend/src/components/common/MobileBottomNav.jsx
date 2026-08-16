import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tag, PieChart, BarChart3 } from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Category', path: '/categories', icon: Tag },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const MobileBottomNav = () => {
  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 px-1.5 sm:px-3 py-1.5 flex items-center justify-around shadow-2xl rounded-3xl">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-2xl text-[9px] sm:text-[10px] font-extrabold transition-all duration-200 ${
                isActive
                  ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/40 scale-105 border border-white/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="truncate max-w-[55px] sm:max-w-none">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
