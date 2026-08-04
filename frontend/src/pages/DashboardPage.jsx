import React, { useState, useEffect } from 'react';
import { analyticsApi, expenseApi, categoryApi } from '../api/endpoints';
import SummaryCards from '../components/dashboard/SummaryCards';
import BudgetAlertBanner from '../components/dashboard/BudgetAlertBanner';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import MonthlyBarChart from '../components/analytics/MonthlyBarChart';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { Plus, ArrowRight, Receipt, CreditCard } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { formatAmount } = useCurrency();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, pieRes, barRes, expRes, catRes] = await Promise.all([
        analyticsApi.getSummary(),
        analyticsApi.getCategoryBreakdown(),
        analyticsApi.getMonthlyTrend(6),
        expenseApi.getExpenses({ page: 0, size: 5, sortBy: 'expenseDate', sortDir: 'desc' }),
        categoryApi.getCategories(),
      ]);

      setSummary(sumRes.data);
      setPieData(pieRes.data);
      setBarData(barRes.data);
      setRecentExpenses(expRes.data.content || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load dashboard metrics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateExpense = async (data) => {
    try {
      setIsSubmitting(true);
      await expenseApi.createExpense(data);
      setToast({ type: 'success', message: 'Expense logged successfully!' });
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to log expense' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading dashboard summary..." />;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Financial Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time overview of your daily spending, active budgets, and analytics
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Log Expense
        </Button>
      </div>

      {/* Budget Warning / Critical Alerts */}
      <BudgetAlertBanner alerts={summary?.budgetAlerts} />

      {/* Metric Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Monthly Category Breakdown
            </h3>
            <span className="text-xs font-medium text-slate-500">Current Month</span>
          </div>
          <CategoryPieChart data={pieData} />
        </div>

        {/* Month-over-Month Spending Trend */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Month-over-Month Trend
            </h3>
            <span className="text-xs font-medium text-slate-500">Last 6 Months</span>
          </div>
          <MonthlyBarChart data={barData} />
        </div>
      </div>

      {/* Recent Transactions Table Preview */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500">Latest logged expenses</p>
          </div>
          <a
            href="/expenses"
            className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All Expenses <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {recentExpenses.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No recent expenses logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Notes</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: exp.categoryColor || '#4F46E5' }}
                      />
                      {exp.categoryName}
                    </td>
                    <td className="py-3 text-slate-500">{exp.expenseDate}</td>
                    <td className="py-3 text-slate-500">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {exp.notes || '-'}
                    </td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-slate-100">
                      {formatAmount(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Add Expense Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateExpense}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DashboardPage;
