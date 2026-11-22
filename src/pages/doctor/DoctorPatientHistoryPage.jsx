import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/Badge';
import { History, User, Calendar, Clock, FileText } from 'lucide-react';

export function DoctorPatientHistoryPage() {
  const { doctors, appointments } = useClinic();
  const { activeDoctorId } = useRole();

  const [searchTerm, setSearchTerm] = useState('');

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const doctorApps = appointments.filter((a) => a.doctorId === currentDoctor.id);

  const filtered = doctorApps.filter((a) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      a.patientName.toLowerCase().includes(term) ||
      a.patientPhone.includes(term) ||
      a.chiefComplaint?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Patient Consultation History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Past patient visits and completed clinical evaluations under {currentDoctor.name}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search consultation history by patient name, phone, or symptom..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-xs">
                  #{app.serialNumber}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{app.patientName}</h4>
                  <p className="text-[11px] text-slate-400">{app.patientAge}y • {app.patientPhone}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span>Date: {app.date}</span>
                <span>Slot: {app.originalTime}</span>
              </div>
              <p className="font-semibold text-slate-700 pt-1">
                Complaint: {app.chiefComplaint || 'Routine medical review'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
