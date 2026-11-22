import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { addDelayToTime } from '../../utils/timeCalculations';
import {
  Timer,
  AlertTriangle,
  Send,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DelayManagementPage() {
  const { doctors, appointments, applyDoctorDelay, resetDoctorDelay } = useClinic();

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDelay, setSelectedDelay] = useState(30); // 10, 15, 20, 30, 60 or custom
  const [customDelay, setCustomDelay] = useState('');
  const [reason, setReason] = useState('Unscheduled emergency clinical case');
  const [customReason, setCustomReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const effectiveDelay = selectedDelay === 'custom'
    ? parseInt(customDelay || 0, 10)
    : parseInt(selectedDelay, 10);

  const effectiveReason = reason === 'Other' ? (customReason || 'Doctor running late') : reason;

  // Pending eligible appointments for this doctor (Status not completed, cancelled, absent)
  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.doctorId === selectedDoctorId && !['completed', 'cancelled', 'absent'].includes(a.status)
    );
  }, [appointments, selectedDoctorId]);

  const completedOrCancelled = useMemo(() => {
    return appointments.filter(
      (a) => a.doctorId === selectedDoctorId && ['completed', 'cancelled', 'absent'].includes(a.status)
    );
  }, [appointments, selectedDoctorId]);

  const handleApplyClick = () => {
    if (!effectiveDelay || effectiveDelay <= 0) {
      toast.error('Please specify a delay duration greater than 0 minutes.');
      return;
    }
    if (pendingAppointments.length === 0) {
      toast.error('No pending appointments to recalculate for this doctor.');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmApply = () => {
    applyDoctorDelay(selectedDoctorId, effectiveDelay, effectiveReason);
    setShowConfirmDialog(false);
  };

  const predefinedOptions = [10, 15, 20, 30, 60];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Delay Management & Schedule Recalculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Broadcast delay announcements, propagate revised times, and trigger automated patient alerts
          </p>
        </div>

        {activeDoctor?.currentDelayMinutes > 0 && (
          <button
            onClick={() => resetDoctorDelay(activeDoctor.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset {activeDoctor.name.split(' ')[1]}'s Delay to 0</span>
          </button>
        )}
      </div>

      {/* Main Delay Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Inputs */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Timer className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Announce Schedule Delay
            </h3>
          </div>

          {/* Doctor Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Doctor on Duty
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Current Delay Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Current Status:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              activeDoctor?.currentDelayMinutes > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {activeDoctor?.currentDelayMinutes > 0
                ? `+${activeDoctor.currentDelayMinutes} mins Delayed`
                : 'Running on Schedule'}
            </span>
          </div>

          {/* Predefined Delays */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Additional Delay Minutes:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setSelectedDelay(mins);
                    setCustomDelay('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-150 border hover:scale-105 active:scale-95 ${
                    selectedDelay === mins
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedDelay('custom')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-150 border hover:scale-105 active:scale-95 ${
                  selectedDelay === 'custom'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                Custom
              </button>
            </div>

            {selectedDelay === 'custom' && (
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  max="180"
                  placeholder="Enter minutes (e.g. 45)"
                  value={customDelay}
                  onChange={(e) => setCustomDelay(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Delay
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="Unscheduled emergency clinical case">Unscheduled emergency clinical case</option>
              <option value="Complex patient procedure in progress">Complex patient procedure in progress</option>
              <option value="Critical ICU round review">Critical ICU round review</option>
              <option value="Heavy traffic transit delay">Heavy traffic transit delay</option>
              <option value="Medical staff briefing">Medical staff briefing</option>
              <option value="Other">Other reason</option>
            </select>

            {reason === 'Other' && (
              <input
                type="text"
                placeholder="Type custom reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleApplyClick}
            disabled={pendingAppointments.length === 0}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md shadow-amber-600/30 hover:shadow-amber-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Apply Delay & Notify {pendingAppointments.length} Patients</span>
          </button>
        </div>

        {/* Right: Live Recalculation Table & Impact Simulation */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recalculation Preview Card */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Schedule Recalculation Impact Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Old vs revised appointment timings calculated via serial number offsets
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {pendingAppointments.length} Pending
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {completedOrCancelled.length} Unchanged
                </span>
              </div>
            </div>

            {/* Patients list table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3.5 py-2.5">Token</th>
                    <th className="px-3.5 py-2.5">Patient Name</th>
                    <th className="px-3.5 py-2.5">Original Slot</th>
                    <th className="px-3.5 py-2.5">Projected Time</th>
                    <th className="px-3.5 py-2.5">Notification Channels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                        No pending appointments scheduled for {activeDoctor?.name} today.
                      </td>
                    </tr>
                  ) : (
                    pendingAppointments.map((app) => {
                      const totalProjected = (activeDoctor?.currentDelayMinutes || 0) + (effectiveDelay || 0);
                      const recalculated = addDelayToTime(app.originalTime, totalProjected);

                      return (
                        <tr key={app.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              #{app.serialNumber}
                            </span>
                          </td>
                          <td className="px-3.5 py-3">
                            <span className="font-bold text-slate-800">{app.patientName}</span>
                            <span className="block text-[10px] text-slate-400">{app.patientPhone}</span>
                          </td>
                          <td className="px-3.5 py-3 whitespace-nowrap text-slate-500 line-through">
                            {app.originalTime}
                          </td>
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-xs">
                                {recalculated}
                              </span>
                              <span className="text-[10px] text-amber-700 font-semibold">
                                (+{totalProjected}m)
                              </span>
                            </div>
                          </td>
                          <td className="px-3.5 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp & SMS
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Preservation Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>System Guarantee:</strong> Completed consultations, absent entries, and cancelled slots are strictly locked and never shifted. Original scheduled slot times are perpetually preserved for clinic audit reporting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before applying delay */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmApply}
        title="Confirm Delay Announcement"
        type="warning"
        confirmText={`Broadcast +${effectiveDelay}m Delay`}
        message={`Are you sure you want to add ${effectiveDelay} minutes of delay for ${activeDoctor?.name}?`}
      >
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <p className="font-bold">Summary of changes:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
            <li>{pendingAppointments.length} pending patients will have their estimated times moved forward.</li>
            <li>Cumulative delay for {activeDoctor?.name} will become +{(activeDoctor?.currentDelayMinutes || 0) + (effectiveDelay || 0)} minutes.</li>
            <li>Automated WhatsApp and SMS notification logs will be generated.</li>
          </ul>
        </div>
      </ConfirmDialog>
    </div>
  );
}
