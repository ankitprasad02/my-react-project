import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Stethoscope,
  Timer,
  Bell,
  Settings,
  LogOut,
  HeartPulse,
  Activity,
  ListOrdered,
  History,
  Shield,
  AlertCircle
} from 'lucide-react';

export function Sidebar({ role = 'admin', isOpen, onClose }) {
  const location = useLocation();
  const { doctors, appointments, notifications } = useClinic();
  const { activeDoctorId, setActiveDoctorId, switchRole } = useRole();

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  // Admin Links
  const adminLinks = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
    {
      name: 'Appointments',
      to: '/admin/appointments',
      icon: CalendarCheck,
      badge: appointments.filter((a) => a.status === 'waiting').length || null
    },
    { name: 'Patients', to: '/admin/patients', icon: Users },
    { name: 'Doctors', to: '/admin/doctors', icon: Stethoscope },
    {
      name: 'Delay Management',
      to: '/admin/delays',
      icon: Timer,
      highlight: doctors.some((d) => (d.currentDelayMinutes || 0) > 0)
    },
    {
      name: 'Notifications',
      to: '/admin/notifications',
      icon: Bell,
      badge: notifications.length || null
    },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  // Doctor Links
  const doctorLinks = [
    { name: 'Dashboard', to: '/doctor', icon: LayoutDashboard, exact: true },
    {
      name: "Today's Queue",
      to: '/doctor/queue',
      icon: ListOrdered,
      badge: appointments.filter((a) => a.doctorId === activeDoctorId && a.status === 'waiting').length || null
    },
    { name: 'Patient History', to: '/doctor/history', icon: History },
    { name: 'Notifications', to: '/doctor/notifications', icon: Bell },
    { name: 'Settings', to: '/doctor/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : doctorLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white shadow-md shadow-teal-500/20">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">PulseQ</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Queue & Delay Alert</p>
          </div>
        </div>

        {/* Role Identity Card */}
        {role === 'doctor' && (
          <div className="m-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <img
                src={currentDoctor?.avatar}
                alt={currentDoctor?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{currentDoctor?.name}</p>
                <p className="text-[10px] text-teal-700 font-medium truncate">{currentDoctor?.specialization}</p>
              </div>
            </div>
            {currentDoctor?.currentDelayMinutes > 0 && (
              <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Delayed by +{currentDoctor.currentDelayMinutes} min</span>
              </div>
            )}
          </div>
        )}

        {role === 'admin' && (
          <div className="m-3 p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-teal-950">Reception Control</p>
              <p className="text-[10px] text-teal-700">Central Clinic Admin</p>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600 group-hover:scale-110'
                    }`}
                  />
                  <span>{link.name}</span>
                </div>

                {link.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}

                {link.highlight && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Switch to Patient Portal or Logout */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          <NavLink
            to="/patient"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-colors"
          >
            <Activity className="h-4 w-4 text-slate-400" />
            <span>Open Patient Portal</span>
          </NavLink>

          <button
            onClick={() => {
              switchRole(role === 'admin' ? 'doctor' : 'admin');
              onClose?.();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Switch Role / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
