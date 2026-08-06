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
      bgColor: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Spent This Week",
      value: formatAmount(summary?.spentThisWeek || 0),
      icon: Calendar,
      gradient: "from-purple-600 via-pink-600 to-indigo-500",
      glow: "glow-indigo",
      bgColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Spent This Month",
      value: formatAmount(summary?.spentThisMonth || 0),
      icon: TrendingUp,
      gradient: "from-emerald-600 via-teal-600 to-cyan-500",
      glow: "glow-emerald",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Top Spending Category",
      value: summary?.topCategoryName || "None",
      subtitle: summary?.topCategoryAmount ? `${formatAmount(summary.topCategoryAmount)} spent` : "No expenses",
      icon: PieChart,
      gradient: "from-amber-500 via-orange-600 to-rose-500",
      glow: "glow-indigo",
      bgColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`clay-card p-6 relative overflow-hidden group cursor-pointer border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:-translate-y-2 ${card.glow}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  {card.title}
                </span>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                  {card.value}
                </h3>
                {card.subtitle && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3.5 rounded-2xl ${card.bgColor} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 animate-float`}>
                <Icon className="w-6 h-6" />
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
