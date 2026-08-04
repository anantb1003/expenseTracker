import React, { useState, useEffect } from 'react';
import { expenseEndpoints } from '../../api/endpoints';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { History, PlusCircle, Edit3, Trash2, Layers, UploadCloud, Clock } from 'lucide-react';

const getActionBadge = (actionType) => {
  switch (actionType) {
    case 'CREATE':
      return {
        label: 'ADDED',
        icon: PlusCircle,
        className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      };
    case 'UPDATE':
      return {
        label: 'UPDATED',
        icon: Edit3,
        className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      };
    case 'DELETE':
      return {
        label: 'DELETED',
        icon: Trash2,
        className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      };
    case 'BULK_DELETE':
    case 'BULK_RECATEGORIZE':
      return {
        label: 'BULK ACTION',
        icon: Layers,
        className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      };
    case 'IMPORT':
      return {
        label: 'CSV IMPORT',
        icon: UploadCloud,
        className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      };
    default:
      return {
        label: actionType,
        icon: History,
        className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      };
  }
};

const formatTimestamp = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ExpenseHistoryModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await expenseEndpoints.getHistory(pageNum, 15);
      setLogs(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load expense audit history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory(0);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Activity History Log" maxWidth="max-w-3xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Complete audit trail of all added, modified, deleted, and imported expenses.
        </p>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner label="Loading history logs..." />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No Activity History"
            description="No expense activity has been recorded yet."
            icon={History}
          />
        ) : (
          <div className="relative border-l-2 border-indigo-500/20 dark:border-indigo-500/30 ml-4 space-y-6 py-2">
            {logs.map((log) => {
              const badge = getActionBadge(log.actionType);
              const BadgeIcon = badge.icon;

              return (
                <div key={log.id} className="relative pl-6 group animate-slide-up">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BadgeIcon className="w-4 h-4 text-indigo-400" />
                  </div>

                  {/* Log Content Card */}
                  <div className="glass-panel p-4 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl hover:border-indigo-500/40 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge.className}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {log.details}
                    </p>

                    {log.expenseId && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
                        Record Reference ID: #{log.expenseId}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              disabled={page === 0 || loading}
              onClick={() => fetchHistory(page - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 transition"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1 || loading}
              onClick={() => fetchHistory(page + 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExpenseHistoryModal;
