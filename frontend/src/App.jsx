import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import MobileBottomNav from './components/common/MobileBottomNav';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import RecurringPage from './pages/RecurringPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <LoadingSpinner label="Authenticating session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Background Ambient Glowing Orbs */}
      <div className="glass-bg-orbs">
        <div className="glass-orb w-[36rem] h-[36rem] bg-indigo-600/30 dark:bg-indigo-600/35 top-[-15%] left-[-10%] animate-float-slow" />
        <div className="glass-orb w-[40rem] h-[40rem] bg-purple-600/25 dark:bg-purple-600/30 bottom-[-15%] right-[-10%] animate-pulse-glow" />
        <div className="glass-orb w-96 h-96 bg-cyan-400/25 dark:bg-cyan-500/25 top-[35%] left-[25%] animate-float" />
        <div className="glass-orb w-80 h-80 bg-rose-400/20 dark:bg-rose-500/20 top-[15%] right-[20%] animate-float-slow" />
        <div className="glass-orb w-72 h-72 bg-amber-400/15 dark:bg-amber-500/15 bottom-[20%] left-[15%] animate-pulse" />
      </div>

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/recurring" element={<RecurringPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {/* Mobile Touch Bottom Nav Bar */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/*" element={<ProtectedLayout />} />
              </Routes>
            </Router>
          </CurrencyProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
