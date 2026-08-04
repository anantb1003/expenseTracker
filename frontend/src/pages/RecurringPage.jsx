import React, { useState, useEffect } from 'react';
import { recurringApi, categoryApi } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { Calendar, Plus, Play, Trash2, Repeat, Clock } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const RecurringPage = () => {
  const [recurringList, setRecurringList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    subcategoryId: '',
    amount: '',
    frequency: 'MONTHLY',
    nextDueDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { formatAmount } = useCurrency();

  const fetchRecurringData = async () => {
    try {
      setLoading(true);
      const [recRes, catRes] = await Promise.all([
        recurringApi.getRecurring(),
        categoryApi.getCategories(),
      ]);
      setRecurringList(recRes.data || []);
      setCategories(catRes.data || []);
      if (catRes.data && catRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch recurring expense rules' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringData();
  }, []);

  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount || !formData.nextDueDate) return;

    try {
      setIsSubmitting(true);
      await recurringApi.createRecurring({
        ...formData,
        categoryId: Number(formData.categoryId),
        subcategoryId: formData.subcategoryId ? Number(formData.subcategoryId) : null,
        amount: Number(formData.amount),
      });
      setToast({ type: 'success', message: 'Recurring expense schedule added!' });
      setIsModalOpen(false);
      fetchRecurringData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to add rule' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerNow = async (id) => {
    try {
      await recurringApi.triggerNow(id);
      setToast({ type: 'success', message: 'Transaction entry created & next due date advanced!' });
      fetchRecurringData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to process recurring expense' });
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (!window.confirm('Delete this recurring rule schedule?')) return;
    try {
      await recurringApi.deleteRecurring(id);
      setToast({ type: 'success', message: 'Recurring schedule removed' });
      fetchRecurringData();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete rule' });
    }
  };

  if (loading) return <LoadingSpinner label="Loading recurring schedules..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Recurring Expense Schedules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automate monthly subscriptions, rent, utility bills, and memberships
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Recurring Schedule
        </Button>
      </div>

      {/* Cards List */}
      {recurringList.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <Repeat className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No recurring costs scheduled</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add rules for recurring monthly bills like Netflix, Internet, Rent, or Gym memberships.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            Schedule First Recurring Cost
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recurringList.map((item) => (
            <div key={item.id} className="glass-card p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: item.categoryColor || '#10B981' }}
                    >
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.categoryName}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                        {item.frequency}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRecurring(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    title="Delete Recurring Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formatAmount(item.amount, item.currency)}
                  </span>
                  {item.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.notes}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>Next Due: <strong className="text-slate-800 dark:text-slate-200">{item.nextDueDate}</strong></span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleTriggerNow(item.id)} className="text-indigo-600 dark:text-indigo-400">
                  <Play className="w-3.5 h-3.5 mr-1" /> Log Entry Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Recurring Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Recurring Cost Schedule" maxWidth="max-w-md">
        <form onSubmit={handleCreateRecurring} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Frequency *</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Due Date *</label>
            <input
              type="date"
              required
              value={formData.nextDueDate}
              onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Description</label>
            <input
              type="text"
              placeholder="e.g. Netflix Ultra HD Plan"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>Schedule Rule</Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default RecurringPage;
