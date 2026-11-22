import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useClinic } from '../../context/ClinicContext';
import { calculateAppointmentTime, addDelayToTime, getTodayISODate } from '../../utils/timeCalculations';
import { Calendar, User, Stethoscope, Clock, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function AppointmentModal({ isOpen, onClose, initialData = null, defaultDoctorId = null }) {
  const { doctors, patients, appointments, addAppointment, updateAppointment } = useClinic();

  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientPhone: '',
    patientAge: 35,
    patientGender: 'Male',
    doctorId: defaultDoctorId || (doctors[0]?.id || ''),
    date: getTodayISODate(),
    chiefComplaint: '',
    priority: 'Normal',
    notes: ''
  });

  // When patient selection changes, auto-fill phone, age, gender
  const handlePatientSelect = (patId) => {
    const selected = patients.find((p) => p.id === patId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        patientId: selected.id,
        patientName: selected.name,
        patientPhone: selected.phone,
        patientAge: selected.age,
        patientGender: selected.gender
      }));
    } else {
      setFormData((prev) => ({ ...prev, patientId: '' }));
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientId: initialData.patientId || '',
        patientName: initialData.patientName || '',
        patientPhone: initialData.patientPhone || '',
        patientAge: initialData.patientAge || 35,
        patientGender: initialData.patientGender || 'Male',
        doctorId: initialData.doctorId || doctors[0]?.id,
        date: initialData.date || getTodayISODate(),
        chiefComplaint: initialData.chiefComplaint || '',
        priority: initialData.priority || 'Normal',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        patientId: patients[0]?.id || '',
        patientName: patients[0]?.name || '',
        patientPhone: patients[0]?.phone || '',
        patientAge: patients[0]?.age || 35,
        patientGender: patients[0]?.gender || 'Male',
        doctorId: defaultDoctorId || (doctors[0]?.id || ''),
        date: getTodayISODate(),
        chiefComplaint: '',
        priority: 'Normal',
        notes: ''
      });
    }
  }, [initialData, isOpen, defaultDoctorId, doctors, patients]);

  // Preview serial number and scheduled time for the chosen doctor and date
  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
  const existingAppsForDocOnDate = appointments.filter(
    (a) => a.doctorId === formData.doctorId && a.date === formData.date
  );

  const calculatedNextSerial = isEditing 
    ? initialData.serialNumber 
    : (existingAppsForDocOnDate.length > 0 ? Math.max(...existingAppsForDocOnDate.map((a) => a.serialNumber || 0)) + 1 : 1);

  const calculatedTime = selectedDoctor
    ? calculateAppointmentTime(selectedDoctor.openingTime, calculatedNextSerial, selectedDoctor.consultationDuration)
    : '10:00 AM';

  const previewEstimatedTime = selectedDoctor?.currentDelayMinutes > 0
    ? addDelayToTime(calculatedTime, selectedDoctor.currentDelayMinutes)
    : calculatedTime;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.patientPhone) {
      toast.error('Please enter patient name and contact number.');
      return;
    }
    if (!formData.doctorId) {
      toast.error('Please select a doctor.');
      return;
    }

    if (isEditing) {
      updateAppointment(initialData.id, {
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        patientAge: formData.patientAge,
        patientGender: formData.patientGender,
        chiefComplaint: formData.chiefComplaint,
        priority: formData.priority,
        notes: formData.notes
      });
    } else {
      addAppointment(formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Appointment' : 'Book New Doctor Appointment'}
      subtitle="Serial number and time are automatically scheduled based on clinic slots"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Doctor & Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Doctor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                disabled={isEditing}
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization} • {doc.consultationDuration} min)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Appointment Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="date"
                disabled={isEditing}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100"
              >
              </input>
            </div>
          </div>
        </div>

        {/* Schedule Calculation Preview Banner */}
        <div className="rounded-xl bg-teal-50/80 border border-teal-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold text-sm shadow-sm">
              #{calculatedNextSerial}
            </div>
            <div>
              <p className="text-xs font-bold text-teal-950">
                Auto-Assigned Token #{calculatedNextSerial}
              </p>
              <p className="text-[11px] text-teal-700">
                Formula: Opening ({selectedDoctor?.openingTime || '10:00 AM'}) + ({calculatedNextSerial} - 1) × {selectedDoctor?.consultationDuration || 15}m
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
              Scheduled Slot
            </span>
            <span className="text-base font-extrabold text-teal-900">
              {calculatedTime}
            </span>
            {selectedDoctor?.currentDelayMinutes > 0 && (
              <span className="block text-[10px] font-semibold text-amber-700">
                Est. with +{selectedDoctor.currentDelayMinutes}m delay: {previewEstimatedTime}
              </span>
            )}
          </div>
        </div>

        {/* Patient Selection / Details */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Select Existing Patient or Enter Details
            </label>
            <span className="text-[11px] text-slate-400">Total {patients.length} registered</span>
          </div>

          {!isEditing && (
            <select
              value={formData.patientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full mb-3 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">-- Choose from registered patients (Auto-fill) --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone} • {p.gender}, {p.age}y)
                </option>
              ))}
            </select>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Full name (e.g. Aarav Sharma)"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Phone Number (for SMS & WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                placeholder="+91 98201 54321"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                <select
                  value={formData.patientGender}
                  onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High (Senior Citizen / Acute Pain)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chief complaint & notes */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Chief Complaint / Reason for Consultation
          </label>
          <input
            type="text"
            value={formData.chiefComplaint}
            onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
            placeholder="e.g. Chest pain, Follow-up on blood pressure, Routine review"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/30 transition-all"
          >
            {isEditing ? 'Save Changes' : `Confirm Booking (Token #${calculatedNextSerial})`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
