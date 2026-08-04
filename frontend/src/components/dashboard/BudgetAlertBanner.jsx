import React from 'react';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const BudgetAlertBanner = ({ alerts = [] }) => {
  const { formatAmount } = useCurrency();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || !alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, index) => {
        const isCritical = alert.alertStatus === 'CRITICAL_100';
        return (
          <div
            key={index}
            className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all duration-300 animate-slide-down ${
              isCritical
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isCritical ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm">
                  {isCritical
                    ? `⚠️ Over Budget Limit: ${alert.categoryName}`
                    : `⚡ High Budget Alert: ${alert.categoryName}`}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  Spent <span className="font-bold">{formatAmount(alert.spentAmount)}</span> of{' '}
                  <span className="font-bold">{formatAmount(alert.budgetAmount)}</span> ({alert.percentageUsed.toFixed(1)}%)
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition"
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
