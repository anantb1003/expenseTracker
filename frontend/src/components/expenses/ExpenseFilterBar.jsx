import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

const ExpenseFilterBar = ({
  filters,
  onChange,
  onReset,
  categories = [],
}) => {
  return (
    <div className="glass-panel p-4 mb-6 space-y-4 border border-white/60 dark:border-white/10 shadow-xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/30 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-slate-200 font-heading">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Filter & Search Expenses
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Keyword */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notes, title, category..."
            value={filters.search || filters.searchKeyword || ''}
            onChange={(e) => {
              onChange('search', e.target.value);
            }}
            className="w-full pl-9 pr-3 py-2.5 glass-input text-xs"
          />
        </div>

        {/* Category Select */}
        <div>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => onChange('categoryId', e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2.5 glass-input text-xs cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Start */}
        <div>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full px-3 py-2.5 glass-input text-xs cursor-pointer"
          />
        </div>

        {/* Date Range End */}
        <div>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="w-full px-3 py-2.5 glass-input text-xs cursor-pointer"
          />
        </div>

        {/* Payment Method */}
        <div>
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => onChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2.5 glass-input text-xs cursor-pointer"
          >
            <option value="">All Payment Methods</option>
            <option value="UPI">UPI / GPay / PhonePe</option>
            <option value="CARD">Credit / Debit Card</option>
            <option value="CASH">Cash</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
