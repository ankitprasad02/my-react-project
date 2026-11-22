import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { SearchInput } from '../../components/common/SearchInput';
import { AppointmentModal } from '../../components/appointments/AppointmentModal';
import { AppointmentDetailsModal } from '../../components/appointments/AppointmentDetailsModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Clock,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AppointmentsPage() {
  const { appointments, doctors, cancelAppointment, updateAppointmentStatus } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [inspectingAppointment, setInspectingAppointment] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('Patient requested cancellation');

  // Filter & Sort Logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Search term
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        app.patientName.toLowerCase().includes(term) ||
        (app.serialNumber && app.serialNumber.toString().includes(term)) ||
        (app.id && app.id.toLowerCase().includes(term)) ||
        (app.patientPhone && app.patientPhone.includes(term));

      // Status filter
      const matchesStatus =
        selectedStatus === 'all' ||
        app.status.toLowerCase() === selectedStatus.toLowerCase();

      // Doctor filter
      const matchesDoctor =
        selectedDoctorId === 'all' || app.doctorId === selectedDoctorId;

      return matchesSearch && matchesStatus && matchesDoctor;
    }).sort((a, b) => {
      const serialA = a.serialNumber || 0;
      const serialB = b.serialNumber || 0;
      return sortOrder === 'asc' ? serialA - serialB : serialB - serialA;
    });
  }, [appointments, searchTerm, selectedStatus, selectedDoctorId, sortOrder]);

  const handleConfirmCancel = () => {
    if (cancellingAppointment) {
      cancelAppointment(cancellingAppointment.id, cancelReason);
      setCancellingAppointment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Appointment Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor, reschedule, and manage real-time clinic patient queues
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAppointment(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/30 hover:shadow-teal-600/40 hover:scale-105 active:scale-95 transition-all duration-150 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient name, serial #, or phone..."
          />

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Appointment Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="waiting">Waiting in Clinic</option>
            <option value="in-consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="absent">Absent</option>
          </select>

          {/* Doctor Filter */}
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort by Token #{sortOrder === 'asc' ? 'Ascending (1 → N)' : 'Descending (N → 1)'}</span>
            </span>
          </button>
        </div>

        {/* Counter summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredAppointments.length}</strong> of{' '}
            <strong className="text-slate-800">{appointments.length}</strong> total appointments
          </span>
          {(searchTerm || selectedStatus !== 'all' || selectedDoctorId !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedDoctorId('all');
              }}
              className="text-teal-700 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointment Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Token / Serial</th>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Doctor & OPD</th>
                <th className="px-4 py-3.5">Scheduled Time</th>
                <th className="px-4 py-3.5">Revised Est. Time</th>
                <th className="px-4 py-3.5">Queue Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No appointments match your filters.</p>
                    <p className="text-xs mt-1">Try resetting the search terms or add a new appointment.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => {
                  const isDelayed = (app.delayMinutes || 0) > 0;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer group"
                      onClick={() => setInspectingAppointment(app)}
                    >
                      {/* Token # */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 font-extrabold text-teal-800 text-xs shadow-xs">
                            #{app.serialNumber}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {app.id}
                          </span>
                        </div>
                      </td>

                      {/* Patient info */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {app.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{app.patientPhone}</span>
                          <span>•</span>
                          <span>{app.patientAge}y, {app.patientGender}</span>
                        </div>
                        {app.chiefComplaint && (
                          <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                            {app.chiefComplaint}
                          </div>
                        )}
                      </td>

                      {/* Doctor info */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{app.doctorName}</div>
                        <div className="text-[10px] text-slate-400">Date: {app.date}</div>
                      </td>

                      {/* Original Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-700">{app.originalTime}</div>
                        <div className="text-[10px] text-slate-400">Standard Slot</div>
                      </td>

                      {/* Revised Estimated Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isDelayed ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-teal-800'}`}>
                            {app.estimatedTime}
                          </span>
                          {isDelayed && (
                            <span className="text-[10px] font-semibold text-amber-600">
                              (+{app.delayMinutes}m)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingAppointment(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 hover:scale-110 active:scale-95 transition-all"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingAppointment(app);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all"
                            title="Edit appointment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {app.status !== 'cancelled' && app.status !== 'completed' && (
                            <button
                              onClick={() => setCancellingAppointment(app)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all"
                              title="Cancel appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Booking / Edit Modal */}
      <AppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAppointment(null);
        }}
        initialData={editingAppointment}
      />

      {/* Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!inspectingAppointment}
        onClose={() => setInspectingAppointment(null)}
        appointment={inspectingAppointment}
        onEdit={(app) => {
          setEditingAppointment(app);
          setIsAddModalOpen(true);
        }}
      />

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancellingAppointment}
        onClose={() => setCancellingAppointment(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        type="danger"
        confirmText="Confirm Cancellation"
        message={`Are you sure you want to cancel Token #${cancellingAppointment?.serialNumber} for ${cancellingAppointment?.patientName}? A cancellation SMS will be simulated.`}
      >
        <div className="space-y-2 mt-2">
          <label className="block text-xs font-semibold text-slate-700">
            Cancellation Reason:
          </label>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
