import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { Settings, User, DollarSign, Moon, Sun, Shield, CheckCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useCurrency();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || selectedCurrency);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateProfile({ name, currency });
      setSelectedCurrency(currency);
      setToast({ type: 'success', message: 'Profile & currency settings saved successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile settings' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Application Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize currency display, user profile details, and UI theme
        </p>
      </div>

      {/* Profile Settings Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">User Profile</h3>
            <p className="text-xs text-slate-500">Update account credentials and base currency</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address (Account Identifier)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {availableCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            Save Profile Settings
          </Button>
        </form>
      </div>

      {/* Visual Theme Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Appearance & Theme</h3>
            <p className="text-xs text-slate-500">Switch between sleek Dark Mode and clean Light Mode</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Current Active Mode: <span className="text-indigo-600 dark:text-indigo-400 capitalize">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Glassmorphic styling automatically adapts to dark backgrounds.</p>
          </div>

          <Button variant="outline" size="md" onClick={toggleTheme}>
            {isDark ? <Sun className="w-4 h-4 mr-2 text-amber-400" /> : <Moon className="w-4 h-4 mr-2" />}
            Toggle Theme
          </Button>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="glass-panel p-6 flex items-center gap-4">
        <Shield className="w-8 h-8 text-emerald-500 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">JWT Token Security Active</h4>
          <p className="text-xs text-slate-500">
            All REST API requests are encrypted and authorized using BCrypt password hashing and JWT Bearer headers.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SettingsPage;
