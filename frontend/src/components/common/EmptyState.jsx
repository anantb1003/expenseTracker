import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data available', description = 'There are no records to display at the moment.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
