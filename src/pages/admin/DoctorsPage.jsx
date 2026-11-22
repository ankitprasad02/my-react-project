import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { StatusBadge } from '../../components/common/Badge';
import { DelayModal } from '../../components/delay/DelayModal';
import {
  Stethoscope,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Timer,
  Edit,
  Power
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorsPage() {
  const { doctors, appointments, updateDoctor, toggleDoctorAvailability } = useClinic();

  const [activeDelayDoctorId, setActiveDelayDoctorId] = useState(null);
  const [editingDurationDoc, setEditingDurationDoc] = useState(null);
  const [newDuration, setNewDuration] = useState(15);

  const handleUpdateDuration = (docId) => {
    updateDoctor(docId, { consultationDuration: parseInt(newDuration, 10) });
    setEditingDurationDoc(null);
    toast.success("Consultation duration updated.");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Profiles & Availability
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure consultation durations, clinic hours, and duty statuses
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => {
          const docAppointments = appointments.filter((a) => a.doctorId === doc.id);
          const waitingCount = docAppointments.filter((a) => a.status === 'waiting').length;
          const completedCount = docAppointments.filter((a) => a.status === 'completed').length;
          const hasDelay = (doc.currentDelayMinutes || 0) > 0;

          return (
            <div
              key={doc.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5 hover:border-teal-200 transition-all"
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 shadow-md"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{doc.name}</h3>
                    <p className="text-xs font-semibold text-teal-700">{doc.qualification}</p>
                    <p className="text-xs text-slate-500">{doc.specialization} • {doc.department}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{doc.roomNumber}</span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={hasDelay ? 'Delayed' : doc.status} />
              </div>

              {/* Consultation Duration & Clinic Timings Card */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Clinic Hours</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {doc.openingTime} – {doc.closingTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Slot Duration</span>
                    {editingDurationDoc === doc.id ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={newDuration}
                          onChange={(e) => setNewDuration(e.target.value)}
                          className="w-16 py-0.5 px-1.5 text-xs border border-slate-300 rounded font-bold"
                        />
                        <button
                          onClick={() => handleUpdateDuration(doc.id)}
                          className="text-[10px] bg-teal-600 text-white px-2 py-1 rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-800">
                          {doc.consultationDuration} min / patient
                        </span>
                        <button
                          onClick={() => {
                            setEditingDurationDoc(doc.id);
                            setNewDuration(doc.consultationDuration);
                          }}
                          className="text-[10px] text-teal-700 font-semibold underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[160px]">{doc.email}</span>
                  </div>
                </div>
              </div>

              {/* Today's Queue Performance */}
              <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-teal-50/50 to-slate-50 p-3 rounded-xl border border-teal-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Today</span>
                  <span className="font-extrabold text-slate-800 text-sm">{docAppointments.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Waiting in Lounge</span>
                  <span className="font-extrabold text-amber-700 text-sm">{waitingCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Consultations Done</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{completedCount}</span>
                </div>
              </div>

              {/* Delay Warning or Announcement Actions */}
              {hasDelay ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-amber-600" />
                      Delayed by +{doc.currentDelayMinutes} min
                    </span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      {doc.lastDelayReason || 'Emergency rounds'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveDelayDoctorId(doc.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm"
                  >
                    Manage Delay
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveDelayDoctorId(doc.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100/80 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Timer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Announce Delay</span>
                  </button>

                  <button
                    onClick={() => toggleDoctorAvailability(doc.id)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Power className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doc.status === 'Available' ? 'Take Break' : 'Resume'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delay Modal */}
      <DelayModal
        isOpen={!!activeDelayDoctorId}
        onClose={() => setActiveDelayDoctorId(null)}
        preselectedDoctorId={activeDelayDoctorId}
      />
    </div>
  );
}
