import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useClinic } from '../../context/ClinicContext';
import { addDelayToTime } from '../../utils/timeCalculations';
import {
  Timer,
  AlertTriangle,
  Send,
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DelayModal({ isOpen, onClose, preselectedDoctorId = null }) {
  const { doctors, appointments, applyDoctorDelay, resetDoctorDelay } = useClinic();

  const [selectedDoctorId, setSelectedDoctorId] = useState(
    preselectedDoctorId || doctors[0]?.id || ''
  );
  const [selectedDelay, setSelectedDelay] = useState(20); // 10, 15, 20, 30, 60 or custom
  const [customDelay, setCustomDelay] = useState('');
  const [reason, setReason] = useState('Emergency clinical procedure');
  const [customReason, setCustomReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Effective delay minutes
  const effectiveDelay = selectedDelay === 'custom'
    ? parseInt(customDelay || 0, 10)
    : parseInt(selectedDelay, 10);

  const effectiveReason = reason === 'Other' ? (customReason || 'Unscheduled clinic delay') : reason;

  // Pending eligible appointments for this doctor (Status not completed, cancelled, absent)
  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.doctorId === selectedDoctorId && !['completed', 'cancelled', 'absent'].includes(a.status)
    );
  }, [appointments, selectedDoctorId]);

  // Handle predefined delay click
  const handlePredefinedClick = (mins) => {
    setSelectedDelay(mins);
    setCustomDelay('');
  };

  const handleApplyClick = () => {
    if (!effectiveDelay || effectiveDelay <= 0) {
      toast.error('Please select or specify a delay duration greater than 0 minutes.');
      return;
    }
    if (pendingAppointments.length === 0) {
      toast.error('There are no active pending appointments to recalculate for this doctor.');
      return;
    }
    // Open confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmApply = () => {
    applyDoctorDelay(selectedDoctorId, effectiveDelay, effectiveReason);
    setShowConfirmDialog(false);
    onClose();
  };

  const handleReset = () => {
    resetDoctorDelay(selectedDoctorId);
    onClose();
  };

  const predefinedOptions = [10, 15, 20, 30, 60];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Announce Consultation Delay"
        subtitle="Automatically recalculate patient appointment schedules and dispatch live alerts"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-5">
          {/* Doctor Selection & Current Delay Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consulting Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Current Cumulative Delay
                </span>
                <span className={`text-base font-extrabold ${
                  activeDoctor?.currentDelayMinutes > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {activeDoctor?.currentDelayMinutes > 0
                    ? `+${activeDoctor.currentDelayMinutes} mins delay`
                    : 'On Schedule (0 mins)'}
                </span>
              </div>
              {activeDoctor?.currentDelayMinutes > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  Reset to On-Time
                </button>
              )}
            </div>
          </div>

          {/* Predefined Delay Buttons & Custom Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Additional Delay to Add:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {predefinedOptions.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handlePredefinedClick(mins)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedDelay === mins
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedDelay('custom')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  selectedDelay === 'custom'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Custom
              </button>
            </div>

            {selectedDelay === 'custom' && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="240"
                  placeholder="Enter minutes (e.g. 45)"
                  value={customDelay}
                  onChange={(e) => setCustomDelay(e.target.value)}
                  className="w-48 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-xs text-slate-500">minutes</span>
              </div>
            )}
          </div>

          {/* Reason for Delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Delay
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Emergency clinical procedure">Emergency clinical procedure</option>
                <option value="Complex patient case taking longer">Complex patient case taking longer</option>
                <option value="In-patient rounds in ICU">In-patient rounds in ICU</option>
                <option value="Traffic congestion in transit">Traffic congestion in transit</option>
                <option value="Scheduled doctor briefing">Scheduled doctor briefing</option>
                <option value="Other">Other (Custom reason)</option>
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specify Reason
                </label>
                <input
                  type="text"
                  placeholder="Enter custom reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Live Preview of Schedule Recalculation */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Affected Pending Schedule Preview ({pendingAppointments.length} Patients)
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-amber-800">
                New Total Delay: +{(activeDoctor?.currentDelayMinutes || 0) + (effectiveDelay || 0)}m
              </span>
            </div>

            {pendingAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4 bg-white/70 rounded-xl">
                No active pending patients for this doctor today.
              </p>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {pendingAppointments.map((app) => {
                  const projectedTotalDelay = (activeDoctor?.currentDelayMinutes || 0) + (effectiveDelay || 0);
                  const revisedTime = addDelayToTime(app.originalTime, projectedTotalDelay);

                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-amber-100 shadow-xs text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          #{app.serialNumber}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{app.patientName}</p>
                          <p className="text-[10px] text-slate-400">{app.patientPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 line-through mr-1.5">
                            {app.estimatedTime}
                          </span>
                          <span className="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-xs">
                            {revisedTime}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                          SMS + WA
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-amber-800/80 mt-2.5 italic">
              * Completed, absent, and cancelled appointments will remain completely untouched.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyClick}
              disabled={pendingAppointments.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Preview & Apply +{effectiveDelay || 0}m Delay</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog before applying */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmApply}
        title="Confirm Delay Announcement"
        type="warning"
        confirmText={`Yes, Apply +${effectiveDelay}m Delay`}
        message={`Are you sure you want to add a ${effectiveDelay}-minute delay for ${activeDoctor?.name}? This will instantly recalculate estimated appointment times for ${pendingAppointments.length} pending patients and dispatch automated SMS and WhatsApp delay alerts.`}
      >
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Reason: {effectiveReason}</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Recalculated patient times will be saved to local storage and reflected in real time across the Admin Dashboard, Doctor Console, and Patient Portal.
          </p>
        </div>
      </ConfirmDialog>
    </>
  );
}
