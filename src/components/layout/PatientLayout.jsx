import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { HeartPulse } from 'lucide-react';

export function PatientLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-slate-50 to-slate-100 font-sans flex flex-col">
      {/* Shared Public Navigation Bar: Home, Admin, Doctor Desk, Patient Portal */}
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        <Outlet />
      </main>

      {/* Patient Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-teal-600" />
            <span className="font-semibold text-slate-700">PulseQ Healthcare System</span>
          </div>
          <p>© 2026 PulseQ Clinic Management. Real-Time Patient Delay Recalculation Engine.</p>
        </div>
      </footer>
    </div>
  );
}
