import React from 'react';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const BudgetAlertBanner = ({ alerts = [] }) => {
  const { formatAmount } = useCurrency();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || !alerts || !Array.isArray(alerts) || alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, index) => {
        if (!alert) return null;
        const isCritical = alert.alertStatus === 'CRITICAL_100';
        const pct = typeof alert.percentageUsed === 'number' ? alert.percentageUsed.toFixed(1) : '0';

        return (
          <div
            key={index}
            className={`p-3.5 sm:p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-lg transition-all duration-300 animate-slide-down ${
              isCritical
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-200'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3 w-full">
              <div
                className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                  isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isCritical ? <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5" /> : <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <div className="w-full">
                <h4 className="font-extrabold text-xs sm:text-sm tracking-tight leading-snug">
                  {isCritical
                    ? `⚠️ Over Budget: ${alert.categoryName || 'Category'}`
                    : `⚡ High Budget Alert: ${alert.categoryName || 'Category'}`}
                </h4>
                <p className="text-[11px] sm:text-xs opacity-90 mt-0.5 font-medium leading-normal">
                  Spent <span className="font-extrabold">{formatAmount(alert.spentAmount || 0)}</span> of{' '}
                  <span className="font-extrabold">{formatAmount(alert.budgetAmount || 0)}</span> ({pct}%)
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition flex-shrink-0"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetAlertBanner;
