import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'teal', // 'teal', 'blue', 'amber', 'emerald', 'rose', 'purple'
  trend,
  onClick
}) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50/70',
      border: 'border-teal-100 hover:border-teal-300',
      iconBg: 'bg-teal-600 text-white shadow-teal-600/20',
      valueColor: 'text-teal-950',
      accent: 'text-teal-600',
      barBg: 'bg-teal-600'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/20',
      valueColor: 'text-emerald-950',
      accent: 'text-emerald-600',
      barBg: 'bg-emerald-600'
    },
    blue: {
      bg: 'bg-sky-50/70',
      border: 'border-sky-100 hover:border-sky-300',
      iconBg: 'bg-sky-600 text-white shadow-sky-600/20',
      valueColor: 'text-sky-950',
      accent: 'text-sky-600',
      barBg: 'bg-sky-600'
    },
    amber: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      valueColor: 'text-amber-950',
      accent: 'text-amber-600',
      barBg: 'bg-amber-500'
    },
    rose: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-500 text-white shadow-rose-500/20',
      valueColor: 'text-rose-950',
      accent: 'text-rose-600',
      barBg: 'bg-rose-500'
    },
    purple: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-100 hover:border-purple-300',
      iconBg: 'bg-purple-500 text-white shadow-purple-500/20',
      valueColor: 'text-purple-950',
      accent: 'text-purple-600',
      barBg: 'bg-purple-500'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 border ${scheme.border} shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2 flex-wrap">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${scheme.valueColor}`}>
              {value}
            </span>
            {trend && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>

        <div className={`rounded-xl p-2.5 sm:p-3 shadow-md ${scheme.iconBg} group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 flex-shrink-0`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      {/* Dynamic progress bar animation on hover */}
      <div className={`mt-3 sm:mt-4 h-1.5 w-full rounded-full ${scheme.bg} overflow-hidden`}>
        <div className={`h-full w-2/3 group-hover:w-full ${scheme.barBg} rounded-full transition-all duration-500 ease-out`} />
      </div>
    </div>
  );
}
