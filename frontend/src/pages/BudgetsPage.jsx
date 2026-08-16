import React, { useState, useEffect } from 'react';
import { budgetApi, categoryApi } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { PieChart, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(''); // empty = overall budget
  const [amount, setAmount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { formatAmount } = useCurrency();

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [budRes, catRes] = await Promise.all([
        budgetApi.getBudgets(month, year),
        categoryApi.getCategories(),
      ]);
      setBudgets(budRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch budget settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    try {
      setIsSubmitting(true);
      await budgetApi.setBudget({
        categoryId: categoryId ? Number(categoryId) : null,
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
      });
      setToast({ type: 'success', message: 'Monthly budget limit updated!' });
      setIsModalOpen(false);
      setCategoryId('');
      setAmount('');
      fetchBudgets();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to update budget' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Remove this budget limit?')) return;
    try {
      await budgetApi.deleteBudget(id);
      setToast({ type: 'success', message: 'Budget limit removed' });
      fetchBudgets();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete budget' });
    }
  };

  if (loading) return <LoadingSpinner label="Loading budgets & progress..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 border border-white/60 dark:border-white/10 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Monthly Budgeting & Limits
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Track spent vs target budget per category to prevent overspending
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month/Year selector */}
          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 p-1.5 rounded-xl border border-white/30 dark:border-white/10 text-xs backdrop-blur-md shadow-sm">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1} className="dark:bg-slate-900">
                  {new Date(2000, m, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-16 bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none text-center"
            />
          </div>

          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Set Category Budget
          </Button>
        </div>
      </div>

      {/* Budget Progress Cards Grid */}
      {budgets.length === 0 ? (
        <div className="glass-panel p-8 text-center border border-white/60 dark:border-white/10 shadow-xl">
          <PieChart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 font-heading">No budgets set for this month</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Setting monthly budget targets gives you real-time alerts when reaching 80% and 100% capacity.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            Set First Budget Limit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((b) => {
            const isCritical = b.percentageUsed >= 100;
            const isWarning = b.percentageUsed >= 80 && !isCritical;

            let progressColor = 'bg-emerald-500';
            if (isCritical) progressColor = 'bg-rose-500';
            else if (isWarning) progressColor = 'bg-amber-500';

            return (
              <div key={b.id} className="glass-card p-6 relative overflow-hidden border border-white/60 dark:border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20"
                      style={{ backgroundColor: b.categoryColor || '#3B82F6' }}
                    >
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-heading">{b.categoryName}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' })} {year} Target
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteBudget(b.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Numbers Summary */}
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-heading">
                      {formatAmount(b.spentAmount)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1 font-medium">of {formatAmount(b.budgetAmount)}</span>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                      isCritical
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {(b.percentageUsed || 0).toFixed(1)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/60 dark:bg-slate-800 rounded-full overflow-hidden mb-3 p-0.5 border border-white/30 dark:border-white/10">
                  <div
                    className={`h-full ${progressColor} transition-all duration-500 rounded-full shadow-sm`}
                    style={{ width: `${Math.min(100, b.percentageUsed || 0)}%` }}
                  />
                </div>

                {/* Footer Remaining Status */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-white/30 dark:border-white/10">
                  <span>
                    Remaining:{' '}
                    <span className={`font-bold ${b.remainingAmount < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {formatAmount(b.remainingAmount)}
                    </span>
                  </span>
                  {isCritical && (
                    <span className="text-rose-500 font-bold flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Budget Exceeded!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Set Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Set Budget Target for ${new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })} ${year}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSetBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Overall Monthly Budget (All Categories)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Budget Limit Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              Save Budget Target
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BudgetsPage;
