import React from 'react';
import { AlertTriangle, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export function DelayAlertBanner({ doctorId, onOpenDelayModal, showReset = true }) {
  const { doctors, resetDoctorDelay } = useClinic();

  const doctor = doctorId
    ? doctors.find((d) => d.id === doctorId)
    : doctors.find((d) => (d.currentDelayMinutes || 0) > 0);

  if (!doctor || !doctor.currentDelayMinutes || doctor.currentDelayMinutes <= 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-4 text-white shadow-lg shadow-amber-500/15 mb-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white flex-shrink-0">
            <AlertTriangle className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                Active Schedule Delay
              </span>
              <span className="text-xs font-semibold text-amber-100">
                +{doctor.currentDelayMinutes} Minutes Total
              </span>
            </div>
            <h3 className="text-base font-bold mt-0.5 tracking-tight">
              {doctor.name} is currently running {doctor.currentDelayMinutes} minutes behind schedule
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              Reason: {doctor.lastDelayReason || 'Clinical emergency in progress'}. All pending patient tokens have been automatically recalculated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {showReset && (
            <button
              onClick={() => resetDoctorDelay(doctor.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Delay</span>
            </button>
          )}

          {onOpenDelayModal && (
            <button
              onClick={onOpenDelayModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold shadow-sm transition-colors"
            >
              <span>Manage Delay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Background ambient pattern */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none blur-2xl" />
    </div>
  );
}
