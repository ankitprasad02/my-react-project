import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4 border border-teal-200">
        <HeartPulse className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-sm">
        The clinic management page you requested does not exist or has been relocated.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/30 hover:bg-teal-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Admin Console</span>
        </Link>
        <Link
          to="/patient"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span>Patient Portal</span>
        </Link>
      </div>
    </div>
  );
}
