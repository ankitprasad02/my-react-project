import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { DelayAlertBanner } from '../../components/delay/DelayAlertBanner';
import { DelayModal } from '../../components/delay/DelayModal';
import { AppointmentModal } from '../../components/appointments/AppointmentModal';
import { AppointmentDetailsModal } from '../../components/appointments/AppointmentDetailsModal';
import { PatientModal } from '../../components/patients/PatientModal';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  XCircle,
  Timer,
  Clock,
  Plus,
  Stethoscope,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function AdminDashboard() {
  const { doctors, appointments, patients } = useClinic();

  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Metrics
  const totalToday = appointments.length;
  const waitingPatients = appointments.filter((a) => a.status === 'waiting').length;
  const completedPatients = appointments.filter((a) => a.status === 'completed').length;
  const cancelledPatients = appointments.filter((a) => a.status === 'cancelled').length;
  const inConsultationPatients = appointments.filter((a) => a.status === 'in-consultation').length;
  const delayedAppointments = appointments.filter((a) => (a.delayMinutes || 0) > 0 && !['completed', 'cancelled'].includes(a.status)).length;

  // Chart Data: Status Breakdown
  const statusPieData = [
    { name: 'Completed', value: completedPatients, color: '#0d9488' },
    { name: 'Waiting', value: waitingPatients, color: '#f59e0b' },
    { name: 'In Consult', value: inConsultationPatients, color: '#10b981' },
    { name: 'Scheduled', value: appointments.filter((a) => a.status === 'scheduled').length, color: '#0284c7' },
    { name: 'Cancelled', value: cancelledPatients, color: '#f43f5e' },
  ].filter((item) => item.value > 0);

  // Chart Data: Hourly Distribution (Simulated based on scheduled slots)
  const hourlyData = [
    { time: '10:00 AM', completed: 1, waiting: 1, scheduled: 0 },
    { time: '10:30 AM', completed: 1, waiting: 2, scheduled: 0 },
    { time: '11:00 AM', completed: 0, waiting: 1, scheduled: 3 },
    { time: '11:30 AM', completed: 0, waiting: 0, scheduled: 3 },
    { time: '12:00 PM', completed: 0, waiting: 0, scheduled: 3 },
  ];

  // Upcoming patient queue (pending appointments)
  const upcomingQueue = appointments
    .filter((a) => ['waiting', 'in-consultation', 'scheduled'].includes(a.status))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinic Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time patient queue, slot calculations, and delay notification engine
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAppModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/30 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => setIsDelayModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            <Timer className="w-4 h-4" />
            <span>Announce Delay</span>
          </button>

          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm hover:border-slate-300 hover:scale-105 active:scale-95 transition-all duration-150"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* Active Delay Alert Banner (if any doctor has delay) */}
      <DelayAlertBanner onOpenDelayModal={() => setIsDelayModalOpen(true)} />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Today"
          value={totalToday}
          subtitle="All booked slots"
          icon={CalendarCheck}
          colorScheme="teal"
        />
        <StatCard
          title="Waiting in Clinic"
          value={waitingPatients}
          subtitle="Arrived at lounge"
          icon={Users}
          colorScheme="amber"
          trend="In queue"
        />
        <StatCard
          title="Completed"
          value={completedPatients}
          subtitle="Consultations done"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Delayed Slots"
          value={delayedAppointments}
          subtitle="Revised timings"
          icon={Timer}
          colorScheme="rose"
        />
        <StatCard
          title="Cancelled"
          value={cancelledPatients}
          subtitle="Slots freed"
          icon={XCircle}
          colorScheme="blue"
        />
      </div>

      {/* Analytics Charts & Doctor Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments by Hour Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                Daily Appointment Flow & Queue Load
              </h3>
              <p className="text-xs text-slate-400">Scheduled vs Arrived vs Completed by time slot</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Flow
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="waiting" name="Waiting" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduled" name="Upcoming Scheduled" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
            Status Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-3">Overall patient queue progress</p>

          <div className="flex-1 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Doctor Statuses & Live Upcoming Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Status Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Current Doctor Status
            </h3>
            <span className="text-xs text-slate-400">{doctors.length} Doctors on duty</span>
          </div>

          {doctors.map((doc) => {
            const docWaiting = appointments.filter((a) => a.doctorId === doc.id && a.status === 'waiting').length;
            const docCompleted = appointments.filter((a) => a.doctorId === doc.id && a.status === 'completed').length;
            const hasDelay = (doc.currentDelayMinutes || 0) > 0;

            return (
              <div
                key={doc.id}
                className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400">{doc.roomNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={hasDelay ? 'Delayed' : doc.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Slot</span>
                    <span className="font-bold text-slate-700">{doc.consultationDuration}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Waiting</span>
                    <span className="font-bold text-amber-700">{docWaiting}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Done</span>
                    <span className="font-bold text-emerald-700">{docCompleted}</span>
                  </div>
                </div>

                {hasDelay ? (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-amber-600" />
                      +{doc.currentDelayMinutes} min Delay Active
                    </span>
                    <button
                      onClick={() => setIsDelayModalOpen(true)}
                      className="text-[11px] font-bold text-amber-800 underline"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsDelayModalOpen(true)}
                    className="w-full py-1.5 rounded-xl border border-dashed border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50 text-xs font-medium transition-all"
                  >
                    + Announce Delay for {doc.name.split(' ')[1]}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Upcoming Queue Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  Active Patient Queue
                </h3>
                <p className="text-xs text-slate-400">Next patients lined up for consultation</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {upcomingQueue.length} Active Slots
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {upcomingQueue.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppointment(app)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 border border-teal-200 font-extrabold text-teal-800 text-xs">
                      #{app.serialNumber}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.patientName}</p>
                      <p className="text-[11px] text-slate-500">{app.doctorName} • {app.chiefComplaint}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{app.estimatedTime}</p>
                      {app.delayMinutes > 0 && (
                        <p className="text-[10px] text-amber-700 font-semibold">
                          +{app.delayMinutes}m delay
                        </p>
                      )}
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex justify-end">
            <button
              onClick={() => setIsAppModalOpen(true)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View all scheduled appointments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DelayModal
        isOpen={isDelayModalOpen}
        onClose={() => setIsDelayModalOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
      />

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />

      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
