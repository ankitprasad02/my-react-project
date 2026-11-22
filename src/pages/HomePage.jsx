import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { useClinic } from '../context/ClinicContext';
import {
  HeartPulse,
  Shield,
  Stethoscope,
  User,
  Timer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  Users,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Activity,
  Zap,
  RotateCcw
} from 'lucide-react';

export function HomePage() {
  const { doctors, appointments, resetToDefaultData } = useClinic();

  // Mini live simulator state on the landing page
  const [simulatedDelay, setSimulatedDelay] = useState(20);

  // Derive stats
  const totalAppointments = appointments.length;
  const waitingPatients = appointments.filter((a) => a.status === 'waiting').length;
  const completedPatients = appointments.filter((a) => a.status === 'completed').length;
  const activeDelayedDoctors = doctors.filter((d) => (d.currentDelayMinutes || 0) > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Bar: Home, Admin, Doctor Desk, Patient Portal */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-teal-50/70 via-slate-50 to-white">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
            {/* Pill Tag with subtle hover bounce */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide shadow-xs hover:bg-teal-100/80 hover:scale-105 transition-all duration-200 cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Real-Time Doctor Appointment & Delay Notification System</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Eliminate Waiting Room Crowds with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
                Dynamic Delay Sync
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Automated serial-based OPD slot scheduling. When a doctor gets delayed by 15 or 30 minutes, all pending patient appointment times recalculate instantly with automated SMS and WhatsApp broadcast alerts.
            </p>

            {/* Primary Action Buttons: Admin, Doctor Desk, Patient Portal */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <Link
                to="/admin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>

              <Link
                to="/doctor"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Desk</span>
              </Link>

              <Link
                to="/patient"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-extrabold shadow-sm border border-slate-200 hover:border-teal-400 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Patient Portal</span>
              </Link>
            </div>
          </div>

          {/* Live Interactive Delay Recalculation Preview Card */}
          <div className="mt-12 lg:mt-16 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-slate-900 font-extrabold shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Live Clinic Recalculation Simulator</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Interactive Demo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Dr. Rajesh Sharma • OPD Suite 102 (Slot duration: 15 min)
                  </p>
                </div>
              </div>

              {/* Delay Selector with tactile hover buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-xs text-slate-300 font-semibold">Test Delay:</span>
                {[0, 15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSimulatedDelay(mins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-150 ${
                      simulatedDelay === mins
                        ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {mins === 0 ? 'On Time' : `+${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Recalculation Comparison Row */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Token #1 (Completed - Protected) */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-lg group-hover:bg-teal-200 transition-colors">
                      Token #1
                    </span>
                    <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      Completed
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">Aarav Sharma</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Original: 10:00 AM</p>
                  <p className="text-teal-800 font-black mt-1">Locked: 10:00 AM</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">Never modified</p>
                </div>

                {/* Token #2 (In Consultation) */}
                <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/60 text-xs ring-1 ring-emerald-400/30 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      Token #2
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded animate-pulse">
                      In Room
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">Sunita Verma</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Slot: 10:15 AM</p>
                  <p className="text-emerald-900 font-black mt-1">Now Consulting</p>
                  <p className="text-[10px] text-emerald-700 mt-1 font-semibold">In examination</p>
                </div>

                {/* Token #3 (Waiting - Shifted by Delay) */}
                <div className={`p-3.5 rounded-2xl border text-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group ${
                  simulatedDelay > 0
                    ? 'border-amber-300 bg-amber-50/80 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg group-hover:bg-amber-200 transition-colors">
                      Token #3
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Waiting
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">Rohan Gupta</p>
                  <p className="text-slate-400 line-through text-[11px] mt-0.5">Slot: 10:30 AM</p>
                  <p className="text-amber-900 font-black mt-1 text-sm">
                    Est: {simulatedDelay === 0 ? '10:30 AM' : simulatedDelay === 15 ? '10:45 AM' : simulatedDelay === 30 ? '11:00 AM' : '11:15 AM'}
                  </p>
                  <p className="text-[10px] text-amber-700 font-extrabold mt-1">
                    {simulatedDelay > 0 ? `+${simulatedDelay}m SMS sent` : 'On schedule'}
                  </p>
                </div>

                {/* Token #4 (Scheduled - Shifted by Delay) */}
                <div className={`p-3.5 rounded-2xl border text-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group ${
                  simulatedDelay > 0
                    ? 'border-amber-300 bg-amber-50/80 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg group-hover:bg-amber-200 transition-colors">
                      Token #4
                    </span>
                    <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                      Scheduled
                    </span>
                  </div>
                  <p className="font-extrabold text-slate-900">Ananya Iyer</p>
                  <p className="text-slate-400 line-through text-[11px] mt-0.5">Slot: 10:45 AM</p>
                  <p className="text-amber-900 font-black mt-1 text-sm">
                    Est: {simulatedDelay === 0 ? '10:45 AM' : simulatedDelay === 15 ? '11:00 AM' : simulatedDelay === 30 ? '11:15 AM' : '11:30 AM'}
                  </p>
                  <p className="text-[10px] text-amber-700 font-extrabold mt-1">
                    {simulatedDelay > 0 ? `+${simulatedDelay}m WhatsApp sent` : 'On schedule'}
                  </p>
                </div>
              </div>

              {/* Notification Message Preview */}
              {simulatedDelay > 0 ? (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-start gap-3 shadow-xs">
                  <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-950 leading-relaxed">
                    <strong>Simulated WhatsApp Broadcast to Pending Patients:</strong> &ldquo;Dear Rohan Gupta, Dr. Rajesh Sharma is running {simulatedDelay} mins delayed due to emergency clinical procedures. Your revised estimated consultation time is {simulatedDelay === 15 ? '10:45 AM' : simulatedDelay === 30 ? '11:00 AM' : '11:15 AM'} (Token #3).&rdquo;
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-teal-950 font-bold">All OPD consultation tokens running exactly on schedule.</span>
                  <Link to="/admin/delays" className="font-extrabold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1">
                    <span>Open Delay Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Role Interfaces Showcase with Lift Hover Effects */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase tracking-wider text-teal-600 mb-2">
              Three Dedicated Interfaces
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Built for Hospital Staff, Doctors & Patients
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Hover and select an interface below to explore full interactive workflows with realistic Indian healthcare dummy data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Admin Console */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-teal-400 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                    Receptionist & Operations
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-2 group-hover:text-teal-700 transition-colors">Admin Dashboard</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Oversee total clinic traffic, book slots with auto-generated serials, register patients, announce doctor delays, and track Recharts analytics.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>Real-time queue monitoring & search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>Dynamic delay recalculator engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>Simulated WhatsApp & SMS notification logs</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  to="/admin"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md shadow-teal-700/20 group-hover:shadow-teal-700/40 group-hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  <span>Open Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Doctor Desk */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-400 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Clinical Practitioner
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-2 group-hover:text-emerald-700 transition-colors">Doctor Desk</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Designed for active consultation rooms. View now-serving patient vitals, call next token, mark consultations completed/absent, and pause queue.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>In-room patient vitals & chief symptoms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Instant consultation finish & completion SMS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>One-click delay announcement (+10 to +60m)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  to="/doctor"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/40 group-hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  <span>Open Doctor Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: Patient Portal */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-sky-400 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded">
                    Patient Tracking
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-2 group-hover:text-sky-700 transition-colors">Patient Portal</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Mobile-friendly patient view. Enter Appointment ID or phone to view live token rank, revised timings, estimated wait time, and self check-in.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Track queue position (&ldquo;2 ahead of you&rdquo;)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Prominent amber delay announcement banner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>Self-service &ldquo;I have arrived&rdquo; check-in</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  to="/patient"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-md shadow-sky-600/20 group-hover:shadow-sky-600/40 group-hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  <span>Open Patient Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Clinic Stats Ticker with Hover Glows */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 cursor-default">
              <p className="text-3xl sm:text-4xl font-black text-teal-400">
                {doctors.length}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Specialists on Duty
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 cursor-default">
              <p className="text-3xl sm:text-4xl font-black text-white">
                {totalAppointments}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Appointments Today
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 cursor-default">
              <p className="text-3xl sm:text-4xl font-black text-amber-400">
                {waitingPatients}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Patients in Lounge
              </p>
            </div>
            <div className="p-4 rounded-2xl hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 cursor-default">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                {completedPatients}
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                Consultations Done
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 4-Step Diagram with Hover Lift */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase tracking-wider text-teal-600 mb-2">
              Automated Operations Workflow
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How the Real-Time Notification Engine Operates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-default group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800 font-black text-sm border border-teal-200 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                01
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">Token Slot Booking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tokens are sequentially computed from clinic opening times using the formula: Opening Time + (Serial - 1) × Duration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-default group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800 font-black text-sm border border-teal-200 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                02
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">Arrival & Patient Check-in</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients self check-in via mobile or at reception desk. Queue position and waiting counts reflect instantly on all consoles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-default group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-black text-sm border border-amber-200 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                03
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">Unscheduled Delay Added</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctor or receptionist announces a delay in minutes. Completed and cancelled slots remain completely locked.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-default group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-black text-sm border border-emerald-200 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                04
              </span>
              <h4 className="font-extrabold text-slate-900 text-sm">Instant Alert Broadcast</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recalculated estimated appointment times are updated in state, and WhatsApp/SMS alerts are dispatched to all pending patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs group-hover:rotate-6 transition-transform">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">PulseQ Healthcare System</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <Link to="/admin" className="hover:text-teal-700 hover:scale-105 transition-all">Admin Console</Link>
            <span>•</span>
            <Link to="/doctor" className="hover:text-teal-700 hover:scale-105 transition-all">Doctor Desk</Link>
            <span>•</span>
            <Link to="/patient" className="hover:text-teal-700 hover:scale-105 transition-all">Patient Portal</Link>
          </div>

          <p>© 2026 PulseQ Clinic Management. Final Year B.Tech Computer Science Demonstration Project.</p>
        </div>
      </footer>
    </div>
  );
}
