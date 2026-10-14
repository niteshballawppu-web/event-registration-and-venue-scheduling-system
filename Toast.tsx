import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDatabase();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderClass = 'border-slate-200 bg-white text-slate-800';
        let icon = <Info className="w-5 h-5 text-indigo-500 shrink-0" />;

        if (isSuccess) {
          borderClass = 'border-emerald-200 bg-emerald-50/95 text-emerald-950 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-100';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
        } else if (isWarning) {
          borderClass = 'border-amber-200 bg-amber-50/95 text-amber-950 dark:bg-amber-950/90 dark:border-amber-800 dark:text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
        } else if (isError) {
          borderClass = 'border-rose-200 bg-rose-50/95 text-rose-950 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-100';
          icon = <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-85">
                {toast.title}
              </div>
              <p className="text-sm mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
