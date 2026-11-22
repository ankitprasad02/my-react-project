import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';
import { Bell, MessageSquare, Smartphone, CheckCheck } from 'lucide-react';
import { formatNotificationTimestamp } from '../../utils/timeCalculations';

export function DoctorNotificationsPage() {
  const { doctors, notifications } = useClinic();
  const { activeDoctorId } = useRole();

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  // Filter notifications that mention this doctor or their patients
  const doctorNotifs = notifications.filter(
    (n) => n.message && n.message.includes(currentDoctor.name.split(' ')[1])
  );

  const displayList = doctorNotifs.length > 0 ? doctorNotifs : notifications.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Patient Alerts & Notification Logs
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time broadcasts and delay communications sent to your patients
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="divide-y divide-slate-100">
          {displayList.map((n) => (
            <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                n.type === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
              }`}>
                {n.type === 'WhatsApp' ? <MessageSquare className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{n.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.patientPhone}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatNotificationTimestamp(n.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {n.message}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span>{n.status || 'Delivered'}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{n.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
