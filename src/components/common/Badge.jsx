import React from 'react';

export function StatusBadge({ status, className = '' }) {
  const normalized = (status || '').toLowerCase();

  const statusConfig = {
    'completed': {
      label: 'Completed',
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      dot: 'bg-teal-500'
    },
    'in-consultation': {
      label: 'In Consultation',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/30',
      dot: 'bg-emerald-500 animate-pulse'
    },
    'waiting': {
      label: 'Waiting in Clinic',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500'
    },
    'scheduled': {
      label: 'Scheduled',
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500'
    },
    'cancelled': {
      label: 'Cancelled',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500'
    },
    'absent': {
      label: 'Absent',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400'
    },
    'delayed': {
      label: 'Delayed',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500'
    },
    'available': {
      label: 'Available',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500'
    },
    'on break': {
      label: 'On Break',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500'
    }
  };

  const config = statusConfig[normalized] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority = 'Normal' }) {
  const isHigh = priority.toLowerCase() === 'high';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${
      isHigh 
        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
        : 'bg-slate-100 text-slate-600 border border-slate-200'
    }`}>
      {priority}
    </span>
  );
}
