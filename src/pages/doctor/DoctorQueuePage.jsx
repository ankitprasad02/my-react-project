import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { StatusBadge } from '../../components/common/Badge';
import { SearchInput } from '../../components/common/SearchInput';
import {
  ListOrdered,
  Check,
  Play,
  UserX,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorQueuePage() {
  const { doctors, appointments, updateAppointmentStatus } = useClinic();
  const { activeDoctorId } = useRole();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const doctorApps = appointments.filter((a) => a.doctorId === currentDoctor.id);

  const filtered = doctorApps.filter((app) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      app.patientName.toLowerCase().includes(term) ||
      app.serialNumber.toString().includes(term) ||
      app.patientPhone.includes(term);

    const matchesStatus =
      filterStatus === 'all' || app.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Today's Patient Queue: {currentDoctor.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time consultation order and patient queue management
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patients in queue by token # or name..."
          className="w-full sm:w-80"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="all">All Queue Records</option>
          <option value="in-consultation">Currently In Consultation</option>
          <option value="waiting">Waiting in Clinic</option>
          <option value="scheduled">Scheduled (Upcoming)</option>
          <option value="completed">Completed</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5">Token #</th>
              <th className="px-4 py-3.5">Patient Name</th>
              <th className="px-4 py-3.5">Chief Complaint</th>
              <th className="px-4 py-3.5">Original Slot</th>
              <th className="px-4 py-3.5">Estimated Consultation</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-xs">
                    #{app.serialNumber}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{app.patientName}</div>
                  <div className="text-[11px] text-slate-400">{app.patientPhone}</div>
                </td>
                <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">
                  {app.chiefComplaint || 'Routine medical review'}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                  {app.originalTime}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className={`font-bold ${app.delayMinutes > 0 ? 'text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-teal-900'}`}>
                    {app.estimatedTime}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  {app.status === 'waiting' && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'in-consultation')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors"
                    >
                      Start Consult
                    </button>
                  )}
                  {app.status === 'in-consultation' && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'completed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  {app.status === 'completed' && (
                    <span className="text-[11px] text-teal-700 font-semibold">Done ({app.completedAt})</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
