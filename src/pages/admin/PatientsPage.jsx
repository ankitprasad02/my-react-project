import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { SearchInput } from '../../components/common/SearchInput';
import { PatientModal } from '../../components/patients/PatientModal';
import { PatientHistoryModal } from '../../components/patients/PatientHistoryModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Heart,
  MapPin,
  Clock
} from 'lucide-react';

export function PatientsPage() {
  const { patients, appointments, deletePatient } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingHistoryPatient, setViewingHistoryPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return patients;
    return patients.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      (p.email && p.email.toLowerCase().includes(term)) ||
      (p.id && p.id.toLowerCase().includes(term))
    );
  }, [patients, searchTerm]);

  const handleDeleteConfirm = () => {
    if (deletingPatient) {
      deletePatient(deletingPatient.id);
      setDeletingPatient(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Directory & Profiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registered patients, contact numbers, and appointment history
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPatient(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Header */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by patient name, phone number, or ID..."
          className="w-full sm:w-80"
        />

        <div className="text-xs text-slate-500">
          Total registered patients: <strong className="text-slate-800">{patients.length}</strong>
        </div>
      </div>

      {/* Patient Cards / Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Age & Gender</th>
                <th className="px-4 py-3.5">Contact Number</th>
                <th className="px-4 py-3.5">Blood Group</th>
                <th className="px-4 py-3.5">Visits / Appointments</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No patients match your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const visitCount = appointments.filter(
                    (a) => a.patientId === patient.id || a.patientPhone === patient.phone
                  ).length;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer group"
                      onClick={() => setViewingHistoryPatient(patient)}
                    >
                      {/* Name & ID */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-xs">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {patient.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {patient.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-teal-600" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">
                            {patient.email}
                          </div>
                        )}
                      </td>

                      {/* Blood Group */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {patient.bloodGroup || 'B+'}
                        </span>
                      </td>

                      {/* Visits */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {visitCount} consultation{visitCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingHistoryPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                            title="View history"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingPatient(patient);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit patient"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete patient record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      <PatientModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPatient(null);
        }}
        initialData={editingPatient}
      />

      {/* Patient History Modal */}
      <PatientHistoryModal
        isOpen={!!viewingHistoryPatient}
        onClose={() => setViewingHistoryPatient(null)}
        patient={viewingHistoryPatient}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingPatient}
        onClose={() => setDeletingPatient(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        type="danger"
        confirmText="Delete Record"
        message={`Are you sure you want to delete ${deletingPatient?.name} from clinic records? Existing appointment tokens will be preserved for history.`}
      />
    </div>
  );
}
