import React, { useState, useEffect } from 'react';
import { categoryApi } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { Tag, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';

const CategoriesPage = () => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [icon, setIcon] = useState('Tag');
  const [subcategoriesInput, setSubcategoriesInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch categories' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setColor('#4F46E5');
    setIcon('Tag');
    setSubcategoriesInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setColor(cat.color || '#4F46E5');
    setIcon(cat.icon || 'Tag');
    setSubcategoriesInput(cat.subcategories ? cat.subcategories.map((s) => s.name).join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subList = subcategoriesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, { name, color, icon, subcategories: subList });
        setToast({ type: 'success', message: 'Category updated' });
      } else {
        await categoryApi.createCategory({ name, color, icon, subcategories: subList });
        setToast({ type: 'success', message: 'Custom category created' });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Action failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete custom category?')) return;
    try {
      await categoryApi.deleteCategory(id);
      setToast({ type: 'success', message: 'Category deleted' });
      fetchCategories();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete category' });
    }
  };

  if (loading) return <LoadingSpinner label="Loading categories..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 clay-panel p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Predefined default categories and custom user-defined categories
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Custom Category
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="clay-card p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: cat.color || '#4F46E5' }}
                  >
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cat.name}</h3>
                    {cat.isDefault ? (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Default Category
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-indigo-500">Custom Category</span>
                    )}
                  </div>
                </div>

                {!cat.isDefault && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Subcategories Tags */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Subcategories
                </p>
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No subcategories defined</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Custom Category' : 'Create Custom Category'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gym & Fitness"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Badge Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0"
              />
              <span className="text-xs font-mono text-slate-500">{color}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subcategories (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Membership, Personal Trainer, Protein Supplements"
              value={subcategoriesInput}
              onChange={(e) => setSubcategoriesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CategoriesPage;
