import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { useClinic } from '../../context/ClinicContext';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Stethoscope,
  Send,
  CheckCircle,
  AlertTriangle,
  FileText,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AppointmentDetailsModal({ isOpen, onClose, appointment, onEdit }) {
  const { updateAppointmentStatus, sendManualNotification } = useClinic();
  const [customMsg, setCustomMsg] = useState('');
  const [msgType, setMsgType] = useState('WhatsApp');

  if (!appointment) return null;

  const isDelayed = (appointment.delayMinutes || 0) > 0;

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    sendManualNotification({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      appointmentId: appointment.id,
      type: msgType,
      message: customMsg,
      category: 'Direct Patient Message'
    });

    setCustomMsg('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Appointment Details: ${appointment.id}`}
      subtitle={`Token #${appointment.serialNumber} • ${appointment.date}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Summary Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/50 p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-extrabold text-lg shadow-md shadow-teal-500/20">
              #{appointment.serialNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-base">{appointment.patientName}</h4>
                <PriorityBadge priority={appointment.priority} />
              </div>
              <p className="text-xs text-slate-500">
                {appointment.patientGender}, {appointment.patientAge} years • {appointment.patientPhone}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between">
            <StatusBadge status={appointment.status} />
            <span className="text-[11px] text-slate-400 mt-1 font-mono">
              ID: {appointment.id}
            </span>
          </div>
        </div>

        {/* Timing Comparison Card (Scheduled vs Revised Estimated Time) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 p-3.5 bg-white">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Original Scheduled Time</span>
            </div>
            <div className="text-xl font-bold text-slate-800">
              {appointment.originalTime}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Calculated from clinic opening slot</p>
          </div>

          <div className={`rounded-xl border p-3.5 ${
            isDelayed
              ? 'border-amber-200 bg-amber-50/60'
              : 'border-teal-200 bg-teal-50/40'
          }`}>
            <div className="flex items-center gap-2 text-xs mb-1">
              {isDelayed ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-800">Revised Estimated Time</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-teal-800">Estimated Consultation Time</span>
                </>
              )}
            </div>
            <div className={`text-xl font-extrabold ${isDelayed ? 'text-amber-900' : 'text-teal-900'}`}>
              {appointment.estimatedTime}
            </div>
            {isDelayed ? (
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                Delayed by +{appointment.delayMinutes} min ({appointment.lastDelayAnnouncement?.reason || 'Doctor emergency'})
              </p>
            ) : (
              <p className="text-[11px] text-teal-700 mt-0.5">Running on schedule with no delays</p>
            )}
          </div>
        </div>

        {/* Doctor & Clinical Details */}
        <div className="rounded-xl border border-slate-200/80 p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-600">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span className="font-semibold">Consulting Doctor:</span>
              <span className="text-slate-900 font-bold">{appointment.doctorName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{appointment.date}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Chief Complaint / Reason for Visit
            </p>
            <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
              {appointment.chiefComplaint || 'Routine medical evaluation'}
            </p>
          </div>

          {appointment.cancellationReason && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-bold">Cancellation Reason: </span>
              {appointment.cancellationReason}
            </div>
          )}

          {appointment.completedAt && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span className="font-bold">Consultation Finished: </span>
              At {appointment.completedAt}
            </div>
          )}
        </div>

        {/* Status Quick Action Bar */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Update Queue Status:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateAppointmentStatus(appointment.id, 'waiting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                appointment.status === 'waiting'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
              }`}
            >
              Patient Arrived (Waiting)
            </button>
            <button
              onClick={() => updateAppointmentStatus(appointment.id, 'in-consultation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                appointment.status === 'in-consultation'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
              }`}
            >
              In Consultation
            </button>
            <button
              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                appointment.status === 'completed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-teal-50'
              }`}
            >
              Mark Completed
            </button>
            <button
              onClick={() => updateAppointmentStatus(appointment.id, 'absent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                appointment.status === 'absent'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Mark Absent
            </button>
          </div>
        </div>

        {/* Send Direct Notification Simulation */}
        <div className="rounded-xl border border-slate-200 p-3 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              Simulate Instant SMS / WhatsApp to Patient
            </span>
            <div className="flex gap-2">
              <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="modalMsgType"
                  value="WhatsApp"
                  checked={msgType === 'WhatsApp'}
                  onChange={() => setMsgType('WhatsApp')}
                  className="text-teal-600"
                />
                WhatsApp
              </label>
              <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="modalMsgType"
                  value="SMS"
                  checked={msgType === 'SMS'}
                  onChange={() => setMsgType('SMS')}
                  className="text-teal-600"
                />
                SMS
              </label>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="e.g. Please proceed to Room 102, doctor is waiting."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(appointment);
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              Edit Appointment Info
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
