import React, { useState, useEffect, useCallback } from 'react';
import { expenseEndpoints, categoryEndpoints, exportEndpoints } from '../api/endpoints';
import ExpenseFilterBar from '../components/expenses/ExpenseFilterBar';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';
import CSVImportModal from '../components/expenses/CSVImportModal';
import BulkRecategorizeModal from '../components/expenses/BulkRecategorizeModal';
import ExpenseHistoryModal from '../components/expenses/ExpenseHistoryModal';

import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import { useCurrency } from '../context/CurrencyContext';

import {
  Plus,
  Upload,
  Download,
  Trash2,
  Tag,
  Edit,
  Receipt,
  FileSpreadsheet,
  FileText,
  FileCode,
  History,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

const ExpensesPage = () => {
  const { formatAmount } = useCurrency();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('local_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Pagination & Filtering state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    paymentMethod: '',
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals visibility state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [bulkRecategorizeOpen, setBulkRecategorizeOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryEndpoints.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sortBy: 'expenseDate',
        sortDir: 'desc',
        ...filters,
      };
      // Clean empty keys
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await expenseEndpoints.getExpenses(params);
      setExpenses(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load expenses' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      categoryId: '',
      minAmount: '',
      maxAmount: '',
      search: '',
      paymentMethod: '',
    });
    setPage(0);
  };

  // Checkbox Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === expenses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(expenses.map((e) => e.id));
    }
  };

  const toggleSelectExpense = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handlers for Form Modal
  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setEditingExpense(expense);
    setFormModalOpen(true);
  };

  const handleSaveExpense = async (data) => {
    try {
      if (editingExpense) {
        await expenseEndpoints.updateExpense(editingExpense.id, data);
        setToast({ type: 'success', message: 'Expense updated successfully' });
      } else {
        await expenseEndpoints.createExpense(data);
        setToast({ type: 'success', message: 'Expense added successfully' });
      }
      setFormModalOpen(false);
      fetchExpenses();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save expense' });
    }
  };

  // Delete Handlers
  const handleDeleteSingle = async () => {
    if (!deleteConfirmId) return;
    try {
      await expenseEndpoints.deleteExpense(deleteConfirmId);
      setToast({ type: 'success', message: 'Expense deleted successfully' });
      setDeleteConfirmId(null);
      fetchExpenses();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete expense' });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await expenseEndpoints.bulkDelete(selectedIds);
      setToast({ type: 'success', message: `Deleted ${selectedIds.length} expenses` });
      setSelectedIds([]);
      setBulkDeleteConfirmOpen(false);
      fetchExpenses();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete selected expenses' });
    }
  };

  const handleBulkRecategorize = async (newCategoryId) => {
    try {
      await expenseEndpoints.bulkRecategorize(selectedIds, newCategoryId);
      setToast({ type: 'success', message: `Re-categorized ${selectedIds.length} expenses` });
      setSelectedIds([]);
      setBulkRecategorizeOpen(false);
      fetchExpenses();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to re-categorize expenses' });
    }
  };

  // Export handlers
  const handleExport = async (type) => {
    try {
      let res;
      let filename = `expenses_export.${type}`;
      if (type === 'csv') res = await exportEndpoints.exportCsv(filters.startDate, filters.endDate);
      else if (type === 'excel') { res = await exportEndpoints.exportExcel(filters.startDate, filters.endDate); filename = 'expenses_export.xlsx'; }
      else if (type === 'pdf') res = await exportEndpoints.exportPdf(filters.startDate, filters.endDate);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ type: 'success', message: `Exported expenses as ${type.toUpperCase()}` });
    } catch (err) {
      setToast({ type: 'error', message: `Failed to export as ${type.toUpperCase()}` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-8 h-8 text-indigo-500" />
            Expense Management
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, filter, export, and review your complete expense activity history.
          </p>
        </div>

        {/* Top Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* History Activity Log Button */}
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-500/20 shadow-sm transition active:scale-95"
          >
            <History className="w-4 h-4 text-indigo-500" />
            <span>Activity History</span>
          </button>

          {/* Import CSV */}
          <Button variant="secondary" onClick={() => setImportModalOpen(true)} icon={Upload} size="sm">
            Import CSV
          </Button>

          {/* Add Expense */}
          <Button variant="primary" onClick={handleOpenAdd} icon={Plus} size="sm">
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Bar Component */}
      <ExpenseFilterBar
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Bulk Operations Banner if items selected */}
      {selectedIds.length > 0 && (
        <div className="clay-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-l-4 border-indigo-500 animate-slide-up">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{selectedIds.length} expense(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="xs" icon={Tag} onClick={() => setBulkRecategorizeOpen(true)}>
              Re-categorize
            </Button>
            <Button variant="danger" size="xs" icon={Trash2} onClick={() => setBulkDeleteConfirmOpen(true)}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Export Bar */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Showing {totalElements} total records
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Export:</span>
          <button onClick={() => handleExport('csv')} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition" title="Export CSV">
            <FileCode className="w-4 h-4 text-emerald-500" />
          </button>
          <button onClick={() => handleExport('excel')} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition" title="Export Excel">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
          </button>
          <button onClick={() => handleExport('pdf')} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition" title="Export PDF">
            <FileText className="w-4 h-4 text-rose-500" />
          </button>
        </div>
      </div>

      {/* Expense List / Table */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner label="Fetching expenses..." />
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No Expenses Found"
          description="No expenses match your search filters or none have been logged yet."
          actionLabel="Add Expense"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="clay-panel overflow-hidden border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-500">
                      {selectedIds.length === expenses.length && expenses.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {expenses.map((expense) => {
                  const isSelected = selectedIds.includes(expense.id);
                  return (
                    <tr
                      key={expense.id}
                      className={`hover:bg-indigo-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/80 dark:bg-indigo-950/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button onClick={() => toggleSelectExpense(expense.id)} className="text-slate-400 hover:text-indigo-500">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-500" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {expense.expenseDate}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: expense.categoryColor || '#4F46E5' }}
                          />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {expense.categoryName}
                          </span>
                          {expense.subcategoryName && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                              {expense.subcategoryName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {expense.notes || '-'}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {expense.paymentMethod}
                        </span>
                      </td>

                      {/* Amount in Rupees */}
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-slate-100">
                        {formatAmount(expense.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(expense)}
                            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Edit Expense"
                          >
                            <Edit className="w-4 h-4 text-indigo-500" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(expense.id)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 transition"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      <ExpenseFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
        categories={categories}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={() => {
          setToast({ type: 'success', message: 'CSV Imported successfully' });
          fetchExpenses();
        }}
      />

      {/* Bulk Recategorize Modal */}
      <BulkRecategorizeModal
        isOpen={bulkRecategorizeOpen}
        onClose={() => setBulkRecategorizeOpen(false)}
        onSubmit={handleBulkRecategorize}
        categories={categories}
        selectedCount={selectedIds.length}
      />

      {/* Audit History Log Modal */}
      <ExpenseHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete this expense record? This action will be logged in your activity history.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteSingle}>Delete Expense</Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal isOpen={bulkDeleteConfirmOpen} onClose={() => setBulkDeleteConfirmOpen(false)} title="Confirm Bulk Deletion" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete {selectedIds.length} selected expense(s)?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setBulkDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleBulkDelete}>Delete {selectedIds.length} Items</Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
