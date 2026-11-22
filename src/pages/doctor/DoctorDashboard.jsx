import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { DelayModal } from '../../components/delay/DelayModal';
import { DelayAlertBanner } from '../../components/delay/DelayAlertBanner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Stethoscope,
  Users,
  CheckCircle2,
  Clock,
  Play,
  Check,
  UserX,
  Pause,
  Timer,
  AlertCircle,
  FileText,
  Heart,
  Activity,
  Sparkles,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorDashboard() {
  const { doctors, appointments, updateAppointmentStatus, pauseResumeDoctorQueue } = useClinic();
  const { activeDoctorId } = useRole();

  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [absentConfirmApp, setAbsentConfirmApp] = useState(null);

  // Doctor profile
  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  // Doctor appointments today
  const doctorAppointments = appointments.filter((a) => a.doctorId === currentDoctor.id);

  // Status metrics
  const completedCount = doctorAppointments.filter((a) => a.status === 'completed').length;
  const waitingQueue = doctorAppointments.filter((a) => a.status === 'waiting');
  const remainingCount = doctorAppointments.filter((a) => ['waiting', 'scheduled'].includes(a.status)).length;
  const currentPatient = doctorAppointments.find((a) => a.status === 'in-consultation');

  // Next patient in line if no one is currently in consultation
  const nextInLine = !currentPatient ? waitingQueue[0] || doctorAppointments.find((a) => a.status === 'scheduled') : null;

  const handleStartConsultation = (appId) => {
    updateAppointmentStatus(appId, 'in-consultation');
    toast.success("Consultation started.");
  };

  const handleCompleteConsultation = (appId) => {
    updateAppointmentStatus(appId, 'completed');
    toast.success("Consultation marked as completed!");
  };

  const handleConfirmAbsent = () => {
    if (absentConfirmApp) {
      updateAppointmentStatus(absentConfirmApp.id, 'absent');
      setAbsentConfirmApp(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Good day, {currentDoctor.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {currentDoctor.roomNumber}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentDoctor.specialization} • Standard Slot: {currentDoctor.consultationDuration} min
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => pauseResumeDoctorQueue(currentDoctor.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              currentDoctor.isQueuePaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {currentDoctor.isQueuePaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Queue</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Queue (Take Break)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsDelayModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-600/30 transition-all"
          >
            <Timer className="w-4 h-4" />
            <span>Announce Delay</span>
          </button>
        </div>
      </div>

      {/* Delay Alert Banner */}
      <DelayAlertBanner doctorId={currentDoctor.id} onOpenDelayModal={() => setIsDelayModalOpen(true)} />

      {/* Doctor Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Consultations"
          value={doctorAppointments.length}
          subtitle="Assigned for today"
          icon={Users}
          colorScheme="teal"
        />
        <StatCard
          title="Patients Remaining"
          value={remainingCount}
          subtitle={`${waitingQueue.length} waiting in lounge`}
          icon={Clock}
          colorScheme="amber"
          trend={`${waitingQueue.length} ready`}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Consultations done"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Current Delay"
          value={currentDoctor.currentDelayMinutes > 0 ? `+${currentDoctor.currentDelayMinutes}m` : '0m'}
          subtitle={currentDoctor.currentDelayMinutes > 0 ? 'Schedule shifted' : 'On-time schedule'}
          icon={Timer}
          colorScheme={currentDoctor.currentDelayMinutes > 0 ? 'rose' : 'teal'}
        />
      </div>

      {/* Current Active Patient ("Now Serving" in Room) */}
      <div className="rounded-2xl bg-white border-2 border-teal-500/80 shadow-md p-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight uppercase">
              Current Patient In Room
            </h3>
          </div>
          {currentPatient && (
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Started at {currentPatient.startedAt || '10:16 AM'}
            </span>
          )}
        </div>

        {currentPatient ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white font-black text-xl shadow-md shadow-teal-600/30">
                  #{currentPatient.serialNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {currentPatient.patientName}
                    </h4>
                    <PriorityBadge priority={currentPatient.priority} />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {currentPatient.patientGender}, {currentPatient.patientAge} years • Phone: {currentPatient.patientPhone}
                  </p>
                  <p className="text-xs text-teal-900 font-medium mt-1">
                    Scheduled: {currentPatient.originalTime} (Est: {currentPatient.estimatedTime})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCompleteConsultation(currentPatient.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 hover:scale-105 active:scale-95 transition-all duration-150"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>

                <button
                  onClick={() => setAbsentConfirmApp(currentPatient)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-150"
                >
                  <UserX className="w-4 h-4 text-slate-500" />
                  <span>Mark Absent</span>
                </button>
              </div>
            </div>

            {/* Chief complaint & notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Chief Complaint / Symptoms
                </span>
                <p className="font-semibold text-slate-800">
                  {currentPatient.chiefComplaint || 'Routine medical review'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Digital Prescription / Advice Ready
                </span>
                <p className="text-slate-600">
                  Automated completion notification with prescription link will dispatch on finish.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Consultation Room is Currently Open</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {nextInLine
                  ? `Next patient ready: ${nextInLine.patientName} (Token #${nextInLine.serialNumber})`
                  : 'All appointments for this session are currently completed.'}
              </p>
            </div>

            {nextInLine && (
              <button
                onClick={() => handleStartConsultation(nextInLine.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-150"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Call Next: #{nextInLine.serialNumber} {nextInLine.patientName}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Patient Queue Table */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Upcoming Patient Queue Today
            </h3>
            <p className="text-xs text-slate-400">
              Patients lined up according to serial numbers and revised delay schedules
            </p>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {waitingQueue.length} Checked In
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3.5 py-2.5">Token #</th>
                <th className="px-3.5 py-2.5">Patient Name</th>
                <th className="px-3.5 py-2.5">Scheduled Slot</th>
                <th className="px-3.5 py-2.5">Estimated Time</th>
                <th className="px-3.5 py-2.5">Queue Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorAppointments
                .filter((a) => a.id !== currentPatient?.id)
                .map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        #{app.serialNumber}
                      </span>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-800">{app.patientName}</div>
                      <div className="text-[10px] text-slate-400">{app.patientAge}y • {app.patientPhone}</div>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap text-slate-500">
                      {app.originalTime}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className={`font-bold ${app.delayMinutes > 0 ? 'text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-slate-800'}`}>
                        {app.estimatedTime}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap text-right">
                      {app.status === 'waiting' && !currentPatient && (
                        <button
                          onClick={() => handleStartConsultation(app.id)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors"
                        >
                          Start Consultation
                        </button>
                      )}
                      {app.status === 'scheduled' && (
                        <span className="text-[11px] text-slate-400">Waiting arrival</span>
                      )}
                      {app.status === 'completed' && (
                        <span className="text-[11px] text-teal-700 font-semibold">Done ({app.completedAt})</span>
                      )}
                      {app.status === 'cancelled' && (
                        <span className="text-[11px] text-rose-500">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delay Modal */}
      <DelayModal
        isOpen={isDelayModalOpen}
        onClose={() => setIsDelayModalOpen(false)}
        preselectedDoctorId={currentDoctor.id}
      />

      {/* Confirm Absent Dialog */}
      <ConfirmDialog
        isOpen={!!absentConfirmApp}
        onClose={() => setAbsentConfirmApp(null)}
        onConfirm={handleConfirmAbsent}
        title="Mark Patient Absent"
        type="warning"
        confirmText="Confirm Absent"
        message={`Mark Token #${absentConfirmApp?.serialNumber} (${absentConfirmApp?.patientName}) as absent? The queue will advance to the next patient.`}
      />
    </div>
  );
}
