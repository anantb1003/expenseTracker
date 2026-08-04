import React, { useState, useEffect } from 'react';
import { analyticsApi, exportApi } from '../api/endpoints';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import MonthlyBarChart from '../components/analytics/MonthlyBarChart';
import DailyLineChart from '../components/analytics/DailyLineChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { BarChart3, Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const AnalyticsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const { formatAmount } = useCurrency();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [pieRes, barRes, lineRes] = await Promise.all([
        analyticsApi.getCategoryBreakdown(startDate, endDate),
        analyticsApi.getMonthlyTrend(12),
        analyticsApi.getDailyTrend(),
      ]);

      setPieData(pieRes.data || []);
      setBarData(barRes.data || []);
      setLineData(lineRes.data || []);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to fetch analytics data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const handleExport = async (format) => {
    try {
      let res;
      let filename;
      if (format === 'pdf') {
        res = await exportApi.exportPdf(startDate, endDate);
        filename = 'expenses_summary_report.pdf';
      } else if (format === 'excel') {
        res = await exportApi.exportExcel(startDate, endDate);
        filename = 'expenses_summary_report.xlsx';
      } else {
        res = await exportApi.exportCsv(startDate, endDate);
        filename = 'expenses_summary_report.csv';
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({ type: 'success', message: `${format.toUpperCase()} report generated successfully!` });
    } catch (err) {
      setToast({ type: 'error', message: `Failed to export ${format.toUpperCase()}` });
    }
  };

  if (loading) return <LoadingSpinner label="Compiling analytics & graphs..." />;

  const totalSpentInPeriod = pieData.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Analytics & Financial Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep-dive charts and downloadable PDF / Excel monthly & yearly reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-1.5" /> CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Excel (.xlsx)
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="w-4 h-4 mr-1.5" /> Export PDF Summary
          </Button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Custom Date Range:</span>
        </div>
        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-auto"
          >
            Clear Date Range
          </button>
        )}
      </div>

      {/* Summary Highlight Banner */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Period Spend</span>
          <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {formatAmount(totalSpentInPeriod)}
          </h2>
        </div>
        <div className="text-right text-xs text-slate-500">
          <span>Categories Analyzed: </span>
          <strong className="text-slate-800 dark:text-slate-200">{pieData.length} categories</strong>
        </div>
      </div>

      {/* Daily Spend Trend Line Chart */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Daily Spend Velocity
            </h3>
            <p className="text-xs text-slate-500">Day-by-day expenditure fluctuation in current month</p>
          </div>
        </div>
        <DailyLineChart data={lineData} />
      </div>

      {/* Pie Chart & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            Category Share Breakdown
          </h3>
          <CategoryPieChart data={pieData} />
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            12-Month Expenditure History
          </h3>
          <MonthlyBarChart data={barData} />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AnalyticsPage;
