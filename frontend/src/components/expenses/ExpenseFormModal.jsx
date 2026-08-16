import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const FALLBACK_CATEGORIES = [
  { 
    id: 1, name: '💪 Gym & Fitness Diet', color: '#F97316',
    subcategories: [
      { id: 10, name: '🏋️ Gym Membership & Trainer' },
      { id: 11, name: '🥛 Whey Protein & Supplements' },
      { id: 12, name: '🥗 Fitness Diet & Meal Prep' },
      { id: 13, name: '👟 Workout Gear & Activewear' }
    ] 
  },
  { 
    id: 2, name: '🛒 Groceries & Supermarket', color: '#10B981',
    subcategories: [
      { id: 20, name: '🏪 Supermarket & D-Mart' },
      { id: 21, name: '🍎 Fruits & Fresh Vegetables' },
      { id: 22, name: '🥛 Dairy, Milk & Bakery' }
    ] 
  },
  { 
    id: 3, name: '🍔 Dining & Restaurants', color: '#EF4444',
    subcategories: [
      { id: 30, name: '🍕 Restaurants & Fast Food' },
      { id: 31, name: '🛵 Zomato & Swiggy Delivery' },
      { id: 32, name: '☕ Coffee & Evening Tea' }
    ] 
  },
  { 
    id: 4, name: '🛍️ Shopping & Apparel', color: '#8B5CF6',
    subcategories: [
      { id: 40, name: '👕 Clothes, Shoes & Fashion' },
      { id: 41, name: '📱 Electronics & Gadgets' },
      { id: 42, name: '🏠 Home Accessories' }
    ] 
  },
  { 
    id: 5, name: '💡 Bills & Utilities', color: '#3B82F6',
    subcategories: [
      { id: 50, name: '⚡ Electricity & Gas Bill' },
      { id: 51, name: '📶 Mobile Recharge & Wi-Fi' },
      { id: 52, name: '💧 Water & Society Maintenance' }
    ] 
  },
  { 
    id: 6, name: '⛽ Fuel & Transportation', color: '#F59E0B',
    subcategories: [
      { id: 60, name: '⛽ Petrol & Diesel Refill' },
      { id: 61, name: '🚖 Uber / Ola & Cab' },
      { id: 62, name: '🛣️ Toll, Fastag & Bus' }
    ] 
  },
  { 
    id: 7, name: '🎬 Entertainment & OTT', color: '#EC4899',
    subcategories: [
      { id: 70, name: '🎟️ Cinema & Movie Tickets' },
      { id: 71, name: '🍿 Netflix, Prime & Spotify' }
    ] 
  },
  { 
    id: 8, name: '🩺 Medical & Health', color: '#06B6D4',
    subcategories: [
      { id: 80, name: '💊 Medicines & Medical Store' },
      { id: 81, name: '🩺 Doctor & Diagnostic Tests' }
    ] 
  }
];

const getCachedCategories = () => {
  try {
    const saved = localStorage.getItem('local_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return FALLBACK_CATEGORIES;
};

const ExpenseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) => {
  // Resolve active category list from props -> local cache -> fallback
  const activeCategories = (categories && Array.isArray(categories) && categories.length > 0)
    ? categories
    : getCachedCategories();

  const [formData, setFormData] = useState({
    categoryId: '',
    subcategoryId: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: '',
    receiptUrl: '',
    isRecurring: false,
    recurrenceRule: 'MONTHLY',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryId: initialData.categoryId ? String(initialData.categoryId) : (activeCategories[0]?.id ? String(activeCategories[0].id) : ''),
        subcategoryId: initialData.subcategoryId ? String(initialData.subcategoryId) : '',
        amount: initialData.amount || '',
        expenseDate: initialData.expenseDate || new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        notes: initialData.notes || '',
        receiptUrl: initialData.receiptUrl || '',
        isRecurring: initialData.isRecurring || false,
        recurrenceRule: initialData.recurrenceRule || 'MONTHLY',
      });
    } else {
      setFormData({
        categoryId: activeCategories.length > 0 ? String(activeCategories[0].id) : '',
        subcategoryId: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        notes: '',
        receiptUrl: '',
        isRecurring: false,
        recurrenceRule: 'MONTHLY',
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories]);

  const selectedCategoryObj = activeCategories.find((c) => String(c.id) === String(formData.categoryId));

  const validate = () => {
    const errs = {};
    if (!formData.categoryId) errs.categoryId = 'Category is required';
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid positive amount required';
    if (!formData.expenseDate) errs.expenseDate = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const catObj = activeCategories.find((c) => String(c.id) === String(formData.categoryId));

    onSubmit({
      ...formData,
      categoryId: Number(formData.categoryId),
      categoryName: catObj ? catObj.name : 'General',
      categoryColor: catObj ? (catObj.color || '#4F46E5') : '#4F46E5',
      subcategoryId: formData.subcategoryId ? Number(formData.subcategoryId) : null,
      amount: Number(formData.amount),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense Record' : 'Log New Expense'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
              className="w-full px-3 py-2 glass-input text-sm cursor-pointer"
            >
              <option value="">Select Category</option>
              {activeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-rose-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subcategory
            </label>
            <select
              value={formData.subcategoryId}
              onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
              disabled={!selectedCategoryObj || !selectedCategoryObj.subcategories?.length}
              className="w-full px-3 py-2 clay-input text-sm disabled:opacity-50 cursor-pointer"
            >
              <option value="">None / Select Subcategory</option>
              {selectedCategoryObj?.subcategories?.map((s, idx) => {
                const subId = typeof s === 'object' && s?.id !== undefined ? s.id : s;
                const subName = typeof s === 'object' && s?.name !== undefined ? s.name : s;
                return (
                  <option key={subId || idx} value={subId}>
                    {subName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-3 py-2 clay-input text-sm font-semibold"
              />
            </div>
            {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expense Date *
            </label>
            <input
              type="date"
              required
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="w-full px-3 py-2 glass-input text-sm cursor-pointer"
            />
            {errors.expenseDate && <p className="text-rose-500 text-xs mt-1">{errors.expenseDate}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 clay-input text-sm cursor-pointer"
          >
            <option value="UPI">UPI / GPay / PhonePe / Paytm</option>
            <option value="CARD">Credit / Debit Card</option>
            <option value="CASH">Cash</option>
            <option value="NET_BANKING">Net Banking / NEFT</option>
          </select>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes / Description
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Team dinner at Italian bistro or D-Mart groceries"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 clay-input text-sm"
          />
        </div>

        {/* Optional Receipt URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Receipt Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/receipt.jpg"
            value={formData.receiptUrl}
            onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Recurring Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            Mark as Recurring Expense
          </label>

          {formData.isRecurring && (
            <div className="mt-3 pl-6">
              <label className="block text-xs font-medium text-slate-500 mb-1">Recurrence Frequency</label>
              <select
                value={formData.recurrenceRule}
                onChange={(e) => setFormData({ ...formData, recurrenceRule: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
            {initialData ? 'Update Expense' : 'Create Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;
