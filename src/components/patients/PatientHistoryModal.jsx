import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { useClinic } from '../../context/ClinicContext';
import { User, Phone, Mail, Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

export function PatientHistoryModal({ isOpen, onClose, patient }) {
  const { appointments } = useClinic();

  if (!patient) return null;

  const patientAppointments = appointments.filter(
    (a) => a.patientId === patient.id || a.patientPhone === patient.phone
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Patient History: ${patient.name}`}
      subtitle={`ID: ${patient.id} • Registered Profile`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Patient Profile Card */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-50/70 to-slate-50 p-4 border border-teal-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-lg shadow-sm">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{patient.name}</h4>
                <p className="text-xs text-slate-600">
                  {patient.gender}, {patient.age} years • Blood Group: <span className="font-bold text-rose-600">{patient.bloodGroup || 'B+'}</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-teal-200 text-teal-800">
              {patientAppointments.length} Visit{patientAppointments.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-teal-100/70">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              <span>{patient.email || 'No email provided'}</span>
            </div>
          </div>

          {patient.history && (
            <div className="mt-2.5 text-xs bg-white/80 p-2.5 rounded-lg border border-teal-100">
              <span className="font-semibold text-slate-700">Clinical History / Notes: </span>
              <span className="text-slate-600">{patient.history}</span>
            </div>
          )}
        </div>

        {/* Consultation History Table / List */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Appointment Timeline & History
          </h5>

          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No appointments recorded for this patient yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {patientAppointments.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-800">Token #{app.serialNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">{app.doctorName}</span>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                    <div>
                      <span className="text-slate-400 block">Date</span>
                      <span className="font-medium text-slate-700">{app.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Scheduled Time</span>
                      <span className="font-medium text-slate-700">{app.originalTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Est. Consultation</span>
                      <span className="font-medium text-teal-800">{app.estimatedTime}</span>
                    </div>
                  </div>

                  {app.chiefComplaint && (
                    <p className="mt-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Complaint: </span>
                      {app.chiefComplaint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
