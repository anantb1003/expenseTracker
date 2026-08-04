import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const BulkRecategorizeModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount = 0,
  categories = [],
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      onConfirm(Number(selectedCategory));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Re-categorize Expenses" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Reassign <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCount}</span> selected expense records to a new category:
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Category *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            required
          >
            <option value="">Select New Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={!selectedCategory} isLoading={isLoading}>
            Apply Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkRecategorizeModal;
