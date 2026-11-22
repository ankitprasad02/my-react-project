import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import {
  HeartPulse,
  Shield,
  Stethoscope,
  User,
  Home,
  Menu,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { RoleSwitcher } from '../common/RoleSwitcher';

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { doctors, appointments, resetToDefaultData } = useClinic();
  const location = useLocation();

  const delayedDoctors = doctors.filter((d) => (d.currentDelayMinutes || 0) > 0);

  const navLinks = [
    {
      name: 'Home',
      to: '/',
      icon: Home,
      exact: true
    },
    {
      name: 'Admin',
      to: '/admin',
      icon: Shield,
      badge: 'Reception'
    },
    {
      name: 'Doctor Desk',
      to: '/doctor',
      icon: Stethoscope,
      badge: 'Consultation'
    },
    {
      name: 'Patient Portal',
      to: '/patient',
      icon: User,
      badge: 'Live Queue'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand with hover scale */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 text-white shadow-md shadow-teal-600/25 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-teal-700 transition-colors">
                  PulseQ
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-100 transition-colors">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Smart Queue & Delay Engine</p>
            </div>
          </Link>

          {/* Center Navigation Links: Home, Admin, Doctor Desk, Patient Portal */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 scale-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:scale-[1.03] active:scale-95'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:scale-110'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Active delay status banner if any doctor has a delay */}
            {delayedDoctors.length > 0 && (
              <Link
                to="/patient"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Delay Active (+{delayedDoctors[0].currentDelayMinutes}m)</span>
              </Link>
            )}

            {/* Quick Demo Reset */}
            <button
              onClick={resetToDefaultData}
              title="Reset sample demonstration data"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">Reset Demo</span>
            </button>

            {/* Global Role Switcher */}
            <RoleSwitcher />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-xl p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Direct Portals
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                    : 'text-slate-700 hover:bg-slate-100 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                resetToDefaultData();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-50 font-bold active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
            <span className="text-slate-400 text-[11px] font-semibold">{appointments.length} Total Appointments</span>
          </div>
        </div>
      )}
    </header>
  );
}
