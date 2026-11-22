import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  Bell,
  Clock,
  RotateCcw,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Activity,
  HeartPulse,
  Home,
  Shield,
  Stethoscope,
  User
} from 'lucide-react';
import { getFormattedToday } from '../../utils/timeCalculations';

export function Navbar({ onMobileMenuToggle, isMobileMenuOpen, title }) {
  const { doctors, appointments, notifications, resetToDefaultData } = useClinic();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  // Count active delays
  const delayedDoctors = doctors.filter((d) => (d.currentDelayMinutes || 0) > 0);

  // Latest 5 notifications
  const recentNotifs = notifications.slice(0, 5);

  const mainNavLinks = [
    { name: 'Admin', to: '/admin', icon: Shield, exact: false },
    { name: 'Doctor Desk', to: '/doctor', icon: Stethoscope, exact: false },
    { name: 'Patient Portal', to: '/patient', icon: User, exact: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md transition-shadow">
      {/* Left: Mobile menu button & page title / breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="rounded-xl p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/" className="flex lg:hidden items-center gap-2 flex-shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight group-hover:text-teal-700 transition-colors">PulseQ</span>
          </Link>

          <div className="hidden sm:block min-w-0">
            <h1 className="text-xs md:text-sm lg:text-base font-extrabold text-slate-900 tracking-tight truncate">
              {title || "Doctor Appointment & Queue System"}
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-medium truncate">
              {getFormattedToday()} • Real-Time Synchronization Active
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Links: Home, Admin, Doctor Desk, Patient Portal */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 shadow-inner">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-2.5 lg:px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
              isActive && location.pathname === '/'
                ? 'bg-white text-teal-800 shadow-xs scale-100 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:scale-105 active:scale-95'
            }`
          }
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Home</span>
        </NavLink>
        {mainNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-white text-teal-800 shadow-xs scale-100 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:scale-105 active:scale-95'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Right controls: Delay Alert badge, Reset Data, Notifications, Role Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Active delay status banner pill */}
        {delayedDoctors.length > 0 && (
          <Link
            to="/admin/delays"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all shadow-xs animate-pulse-slow"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {delayedDoctors[0].name.split(' ')[1]}: +{delayedDoctors[0].currentDelayMinutes}m Delay
            </span>
          </Link>
        )}

        {/* Reset Demo Data Button */}
        <button
          onClick={resetToDefaultData}
          title="Reset all appointments & delay state to initial demo data"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden lg:inline text-[11px]">Reset Demo</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
            title="Recent notifications"
          >
            <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 p-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Live Notification Broadcasts
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {notifications.length} total
                  </span>
                </div>

                <div className="mt-2 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {recentNotifs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No notifications logged yet.</p>
                  ) : (
                    recentNotifs.map((n) => (
                      <div key={n.id} className="py-2.5 text-left text-xs hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            n.type === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                          }`}>
                            {n.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-[11px]">{n.patientName} ({n.patientPhone})</p>
                        <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Global Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
