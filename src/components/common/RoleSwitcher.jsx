import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../context/AuthRoleContext';
import { useClinic } from '../../context/ClinicContext';
import { Shield, Stethoscope, User, ChevronDown, Sparkles } from 'lucide-react';

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, switchRole, activeDoctorId, setActiveDoctorId, setPatientLookupQuery } = useRole();
  const { doctors, appointments, patients } = useClinic();
  const [isOpen, setIsOpen] = useState(false);

  // Derive active view from location
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const isPatientRoute = location.pathname.startsWith('/patient');
  const isAdminRoute = !isDoctorRoute && !isPatientRoute;

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const handleSelectRole = (role, docId = null) => {
    switchRole(role, docId);
    setIsOpen(false);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'doctor') {
      navigate('/doctor');
    } else if (role === 'patient') {
      navigate('/patient');
    }
  };

  const handleQuickPatient = (appointmentId) => {
    setPatientLookupQuery(appointmentId);
    switchRole('patient');
    setIsOpen(false);
    navigate(`/patient?id=${appointmentId}`);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-teal-200 bg-teal-50/80 text-teal-800 hover:bg-teal-100 hover:scale-105 active:scale-95 transition-all duration-150 shadow-xs"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-teal-600 text-white">
          {isAdminRoute && <Shield className="w-3 h-3" />}
          {isDoctorRoute && <Stethoscope className="w-3 h-3" />}
          {isPatientRoute && <User className="w-3 h-3" />}
        </span>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-teal-600 uppercase font-bold tracking-wider leading-none">
            Active Mode
          </p>
          <p className="text-xs font-semibold text-teal-900 leading-tight">
            {isAdminRoute && 'Admin / Receptionist'}
            {isDoctorRoute && `${currentDoctor?.name} (Doctor)`}
            {isPatientRoute && 'Patient Portal'}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-teal-700 ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Switch Perspective
              </p>
              <p className="text-[11px] text-slate-400">
                Test and demonstrate all 3 user role flows instantly
              </p>
            </div>

            <div className="py-1 space-y-1">
              {/* Admin */}
              <button
                onClick={() => handleSelectRole('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                  isAdminRoute
                    ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Shield className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Admin / Receptionist</div>
                  <div className="text-[11px] text-slate-500">Manage queues, delay alerts, all doctors</div>
                </div>
              </button>

              {/* Doctor 1 */}
              <div className="pt-1 border-t border-slate-100">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Doctor Dashboards
                </p>
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDoctorId(doc.id);
                      handleSelectRole('doctor', doc.id);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isDoctorRoute && activeDoctorId === doc.id
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-100'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{doc.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{doc.specialization}</div>
                    </div>
                    {doc.currentDelayMinutes > 0 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        +{doc.currentDelayMinutes}m
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Patient */}
              <div className="pt-1 border-t border-slate-100">
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Portal
                </p>
                <button
                  onClick={() => handleSelectRole('patient')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    isPatientRoute
                      ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-100'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                    <User className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Patient Portal Home</div>
                    <div className="text-[11px] text-slate-500">Lookup appointment & live delay tracker</div>
                  </div>
                </button>

                {/* Quick patient test picker */}
                <div className="px-3 py-1.5 bg-slate-50 rounded-xl mt-1">
                  <p className="text-[10px] text-slate-500 font-medium mb-1">
                    Demo 1-Click Patient Lookup:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {appointments.slice(0, 4).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleQuickPatient(app.id)}
                        className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:scale-105 active:scale-95 transition-all"
                      >
                        #{app.serialNumber} {app.patientName.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
