import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info'
  isLoading = false,
  children
}) {
  const iconConfig = {
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500'
    },
    danger: {
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500'
    },
    info: {
      icon: Info,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      btnColor: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500'
    }
  };

  const currentIcon = iconConfig[type] || iconConfig.warning;
  const IconComponent = currentIcon.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border ${currentIcon.color} flex-shrink-0`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {children && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            {children}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentIcon.btnColor} disabled:opacity-50`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
