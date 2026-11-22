import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { Stethoscope, Clock, MapPin, Power, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorSettingsPage() {
  const { doctors, updateDoctor, toggleDoctorAvailability } = useClinic();
  const { activeDoctorId } = useRole();

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const [duration, setDuration] = useState(currentDoctor.consultationDuration || 15);
  const [openingTime, setOpeningTime] = useState(currentDoctor.openingTime || '10:00 AM');
  const [closingTime, setClosingTime] = useState(currentDoctor.closingTime || '02:00 PM');
  const [roomNumber, setRoomNumber] = useState(currentDoctor.roomNumber || 'OPD Suite 102');

  const handleSave = (e) => {
    e.preventDefault();
    updateDoctor(currentDoctor.id, {
      consultationDuration: parseInt(duration, 10),
      openingTime,
      closingTime,
      roomNumber,
    });
    toast.success("Doctor preferences updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Doctor Profile & Consultation Slot Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure clinical opening hours and patient consultation slot lengths
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <img
            src={currentDoctor.avatar}
            alt={currentDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
          />
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{currentDoctor.name}</h3>
            <p className="text-xs text-teal-700 font-semibold">{currentDoctor.specialization}</p>
            <p className="text-xs text-slate-400">{currentDoctor.qualification}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Consultation Slot Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-bold text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Room / OPD Suite
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-bold text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinic Opening Time
            </label>
            <input
              type="text"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinic Closing Time
            </label>
            <input
              type="text"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleDoctorAvailability(currentDoctor.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Duty: {currentDoctor.status} (Toggle)</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
