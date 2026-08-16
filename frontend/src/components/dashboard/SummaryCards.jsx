import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { TrendingUp, Calendar, Clock, PieChart, Sparkles } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  const { formatAmount } = useCurrency();

  const cards = [
    {
      title: "Spent Today",
      value: formatAmount(summary?.spentToday || 0),
      icon: Clock,
      gradient: "from-blue-600 via-indigo-600 to-cyan-500",
      glow: "glow-indigo",
      bgColor: "bg-indigo-50 dark:bg-indigo-500/25 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40",
    },
    {
      title: "Spent This Week",
      value: formatAmount(summary?.spentThisWeek || 0),
      icon: Calendar,
      gradient: "from-purple-600 via-pink-600 to-indigo-500",
      glow: "glow-purple",
      bgColor: "bg-purple-50 dark:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/40",
    },
    {
      title: "Spent This Month",
      value: formatAmount(summary?.spentThisMonth || 0),
      icon: TrendingUp,
      gradient: "from-emerald-600 via-teal-600 to-cyan-500",
      glow: "glow-emerald",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40",
    },
    {
      title: "Top Spending Category",
      value: summary?.topCategoryName || "None",
      subtitle: summary?.topCategoryAmount ? `${formatAmount(summary.topCategoryAmount)} spent` : "No expenses",
      icon: PieChart,
      gradient: "from-amber-500 via-orange-600 to-rose-500",
      glow: "glow-cyan",
      bgColor: "bg-amber-50 dark:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-slide-up">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card p-4 sm:p-6 relative overflow-hidden group cursor-pointer border border-white/60 dark:border-white/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${card.glow}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-full min-w-0 overflow-hidden">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse flex-shrink-0" />
                  <span className="truncate">{card.title}</span>
                </span>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2 tracking-tight font-heading leading-tight truncate">
                  {card.value}
                </h3>
                {card.subtitle && (
                  <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-1 truncate">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 sm:p-3.5 rounded-2xl ${card.bgColor} shadow-xl border border-white/40 dark:border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 backdrop-blur-xl flex-shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            {/* Glowing Accent Bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
