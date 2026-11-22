import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import {
  Search,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Bell,
  Stethoscope,
  MapPin,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export function PatientPortalPage() {
  const [searchParams] = useSearchParams();
  const queryParamId = searchParams.get('id');

  const { appointments, doctors, notifications, updateAppointmentStatus } = useClinic();
  const { patientLookupQuery, setPatientLookupQuery } = useRole();

  const [inputQuery, setInputQuery] = useState(queryParamId || patientLookupQuery || 'APT-1003');
  const [searchedAppointment, setSearchedAppointment] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Search function: by appointment ID or phone number
  const handleSearch = (queryToUse = inputQuery) => {
    const cleanQuery = (queryToUse || '').trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanQuery) {
      toast.error('Please enter an Appointment ID or phone number.');
      return;
    }

    const found = appointments.find((a) => {
      const cleanId = (a.id || '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const cleanPhone = (a.patientPhone || '').replace(/[^0-9]/g, '');
      const cleanToken = a.serialNumber?.toString();

      return (
        cleanId === cleanQuery ||
        cleanPhone.endsWith(cleanQuery) ||
        cleanPhone === cleanQuery ||
        cleanToken === cleanQuery
      );
    });

    setSearchedAppointment(found || null);
    setHasSearched(true);

    if (!found) {
      toast.error('No matching appointment found. Try a sample token below.');
    }
  };

  useEffect(() => {
    if (queryParamId) {
      setInputQuery(queryParamId);
      handleSearch(queryParamId);
    } else if (inputQuery) {
      handleSearch(inputQuery);
    }
  }, [queryParamId, appointments]);

  // Derive metrics if appointment found
  let doctor = null;
  let patientsAhead = 0;
  let estimatedWaitMinutes = 0;
  let isDelayed = false;
  let patientNotifications = [];

  if (searchedAppointment) {
    doctor = doctors.find((d) => d.id === searchedAppointment.doctorId) || doctors[0];
    isDelayed = (searchedAppointment.delayMinutes || 0) > 0;

    // Calculate patients ahead in the queue:
    // Only pending appointments for the same doctor with smaller serialNumber
    const aheadList = appointments.filter(
      (a) =>
        a.doctorId === searchedAppointment.doctorId &&
        !['completed', 'cancelled', 'absent'].includes(a.status) &&
        a.serialNumber < searchedAppointment.serialNumber
    );
    patientsAhead = aheadList.length;
    estimatedWaitMinutes = patientsAhead * (doctor?.consultationDuration || 15);

    // Notifications for this patient
    patientNotifications = notifications.filter(
      (n) =>
        n.appointmentId === searchedAppointment.id ||
        (n.patientPhone && searchedAppointment.patientPhone && n.patientPhone.replace(/\D/g, '') === searchedAppointment.patientPhone.replace(/\D/g, ''))
    );
  }

  const handleSelfCheckIn = () => {
    if (searchedAppointment) {
      updateAppointmentStatus(searchedAppointment.id, 'waiting');
      toast.success("Welcome! You have checked in at PulseQ Clinic.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Box */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-teal-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            Live Queue & Delay Tracking
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Track Your Doctor Consultation
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/80">
            Enter your Appointment Token ID or Registered Mobile Number to view real-time timing updates.
          </p>

          {/* Search Bar Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="pt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="e.g. APT-1003 or 9717012345"
                className="w-full rounded-2xl bg-white text-slate-800 py-3 pl-10 pr-4 text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-teal-500 hover:bg-teal-400 text-teal-950 text-sm font-extrabold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Track Now</span>
            </button>
          </form>

          {/* Quick Demo Patients for instant review */}
          <div className="pt-4 text-xs text-teal-200/90 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-white/80">Quick Demo:</span>
            {appointments.slice(0, 5).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setInputQuery(app.id);
                  handleSearch(app.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                  searchedAppointment?.id === app.id
                    ? 'bg-white text-teal-900 shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Token #{app.serialNumber} ({app.patientName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* When appointment is found */}
      {searchedAppointment ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Prominent Notification Banner when appointment timings change */}
          {isDelayed && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-5 text-white shadow-lg shadow-amber-500/20 space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-black tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                      Schedule Revised
                    </span>
                    <span className="text-xs font-bold text-amber-100">
                      +{searchedAppointment.delayMinutes} Min Delay Announced
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mt-1">
                    Your appointment timing has been updated to {searchedAppointment.estimatedTime}
                  </h3>
                  <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
                    Reason: {searchedAppointment.lastDelayAnnouncement?.reason || 'Doctor emergency in progress'}.
                    Original slot was {searchedAppointment.originalTime}. Please adjust your arrival time accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Core Appointment Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
            {/* Header with Token & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white font-black text-2xl shadow-lg shadow-teal-600/30">
                  #{searchedAppointment.serialNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {searchedAppointment.patientName}
                    </h3>
                    <PriorityBadge priority={searchedAppointment.priority} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Appointment ID: <span className="font-mono font-bold text-slate-700">{searchedAppointment.id}</span> • {searchedAppointment.patientPhone}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <StatusBadge status={searchedAppointment.status} />
                <span className="text-xs text-slate-400 mt-1">
                  Date: {searchedAppointment.date}
                </span>
              </div>
            </div>

            {/* Time Comparison Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Scheduled Slot */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Original Slot Time</span>
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {searchedAppointment.originalTime}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Calculated at token booking via clinic slot formula
                </p>
              </div>

              {/* Revised Estimated Time */}
              <div className={`rounded-2xl border p-5 ${
                isDelayed
                  ? 'border-amber-300 bg-amber-50/70 ring-1 ring-amber-400/30'
                  : 'border-teal-200 bg-teal-50/50'
              }`}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
                  {isDelayed ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800 font-bold">Revised Estimated Time</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span className="text-teal-800 font-bold">Estimated Time</span>
                    </>
                  )}
                </div>
                <div className={`text-2xl font-black ${isDelayed ? 'text-amber-900' : 'text-teal-900'}`}>
                  {searchedAppointment.estimatedTime}
                </div>
                <p className={`text-xs mt-1 ${isDelayed ? 'text-amber-700 font-medium' : 'text-teal-700'}`}>
                  {isDelayed ? `Adjusted by +${searchedAppointment.delayMinutes} min delay` : 'On schedule with no clinic delays'}
                </p>
              </div>
            </div>

            {/* Live Queue Position & Wait Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Patients Ahead of You
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {searchedAppointment.status === 'completed'
                    ? '0'
                    : searchedAppointment.status === 'in-consultation'
                    ? '0 (Inside Room)'
                    : `${patientsAhead} patient${patientsAhead !== 1 ? 's' : ''}`}
                </span>
                <span className="text-[11px] text-slate-500">In this doctor's queue</span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Estimated Waiting Time
                </span>
                <span className="text-2xl font-black text-teal-800 mt-1 block">
                  {searchedAppointment.status === 'completed'
                    ? '0 min'
                    : searchedAppointment.status === 'in-consultation'
                    ? 'In Progress'
                    : `~${estimatedWaitMinutes} min`}
                </span>
                <span className="text-[11px] text-slate-500">Based on consultation pace</span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Clinic Check-in
                </span>
                <div className="mt-1">
                  {searchedAppointment.status === 'waiting' || searchedAppointment.checkedIn ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      Arrived at Clinic
                    </span>
                  ) : (
                    <button
                      onClick={handleSelfCheckIn}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-150"
                    >
                      I have arrived
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Notifies receptionist</span>
              </div>
            </div>

            {/* Doctor Info Card */}
            {doctor && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50/40 to-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-300 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
                      Assigned Specialist
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{doctor.name}</h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {doctor.specialization} • {doctor.qualification}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{doctor.roomNumber}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Slot Pace: {doctor.consultationDuration} min / patient
                  </span>
                </div>
              </div>
            )}

            {/* Notification History Specific to Patient */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-teal-600" />
                  SMS & WhatsApp Notification History ({patientNotifications.length})
                </h4>
              </div>

              {patientNotifications.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center">
                  No automated alerts dispatched for this appointment yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {patientNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          n.type === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {n.type} • {n.category}
                        </span>
                        <span className="text-slate-400">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Appointment Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We could not find an appointment with that reference. Please check your token number or contact the clinic reception.
          </p>
        </div>
      ) : null}
    </div>
  );
}
