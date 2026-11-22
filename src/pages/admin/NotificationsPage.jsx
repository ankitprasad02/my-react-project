import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { formatNotificationTimestamp } from '../../utils/timeCalculations';
import {
  Bell,
  MessageSquare,
  Smartphone,
  Send,
  CheckCheck,
  Check,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export function NotificationsPage() {
  const { notifications, patients, appointments, sendManualNotification } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'WhatsApp', 'SMS'
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedNotifDetail, setSelectedNotifDetail] = useState(null);

  // Compose form
  const [composeData, setComposeData] = useState({
    patientName: '',
    patientPhone: '',
    type: 'WhatsApp',
    category: 'Special Advisory',
    message: ''
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        n.patientName?.toLowerCase().includes(term) ||
        n.patientPhone?.includes(term) ||
        n.message?.toLowerCase().includes(term);

      const matchesType =
        selectedType === 'all' ||
        n.type.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [notifications, searchTerm, selectedType]);

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!composeData.patientName || !composeData.message) {
      toast.error('Patient name and message are required.');
      return;
    }
    sendManualNotification(composeData);
    setIsComposeOpen(false);
    setComposeData({
      patientName: '',
      patientPhone: '',
      type: 'WhatsApp',
      category: 'Special Advisory',
      message: ''
    });
  };

  const handleQuickPatientSelect = (patId) => {
    const pat = patients.find((p) => p.id === patId);
    if (pat) {
      setComposeData((prev) => ({
        ...prev,
        patientName: pat.name,
        patientPhone: pat.phone
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Management & Broadcast Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit logs of simulated real-time WhatsApp and SMS patient delay alerts
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Direct Message</span>
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient name, phone, or keyword..."
            className="w-full sm:w-80"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Channels (WhatsApp & SMS)</option>
            <option value="WhatsApp">WhatsApp Only</option>
            <option value="SMS">SMS Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated Gateway: Connected</span>
          </span>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Channel</th>
                <th className="px-4 py-3.5">Recipient Patient</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Simulated Message Content</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No notification logs match your filters.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((n) => {
                  const isWhatsApp = n.type === 'WhatsApp';

                  return (
                    <tr
                      key={n.id}
                      onClick={() => setSelectedNotifDetail(n)}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Channel */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isWhatsApp
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {isWhatsApp ? (
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                          )}
                          <span>{n.type}</span>
                        </span>
                      </td>

                      {/* Patient */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {n.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {n.patientPhone}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {n.category || 'Delay Alert'}
                        </span>
                      </td>

                      {/* Message Content preview */}
                      <td className="px-4 py-3.5">
                        <p className="line-clamp-2 text-slate-700 max-w-md font-sans text-xs leading-relaxed">
                          {n.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{n.status || 'Delivered'}</span>
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right font-medium text-slate-500">
                        {formatNotificationTimestamp(n.timestamp)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Notification Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Send Direct Simulated Patient Alert"
        subtitle="Test sending an immediate WhatsApp or SMS broadcast"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleComposeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Registered Patient (Auto-fill)
            </label>
            <select
              onChange={(e) => handleQuickPatientSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="">-- Choose patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={composeData.patientName}
                onChange={(e) => setComposeData({ ...composeData, patientName: e.target.value })}
                placeholder="Patient Name"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={composeData.patientPhone}
                onChange={(e) => setComposeData({ ...composeData, patientPhone: e.target.value })}
                placeholder="+91 98201 54321"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notification Channel
              </label>
              <select
                value={composeData.type}
                onChange={(e) => setComposeData({ ...composeData, type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS Gateway</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={composeData.category}
                onChange={(e) => setComposeData({ ...composeData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="Schedule Delay Alert">Schedule Delay Alert</option>
                <option value="Queue Reminder">Queue Reminder</option>
                <option value="Doctor Advisory">Doctor Advisory</option>
                <option value="Direct Message">Direct Message</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              required
              value={composeData.message}
              onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
              placeholder="e.g. Namaste, your doctor has arrived at the clinic. Please proceed to OPD Suite 102."
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Send</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Notification Message Detail Preview Modal */}
      <Modal
        isOpen={!!selectedNotifDetail}
        onClose={() => setSelectedNotifDetail(null)}
        title="Simulated Notification Dispatch"
        subtitle={`Channel: ${selectedNotifDetail?.type} • Delivered to ${selectedNotifDetail?.patientPhone}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>{selectedNotifDetail?.patientName}</span>
              <span>{formatNotificationTimestamp(selectedNotifDetail?.timestamp)}</span>
            </div>
            <div className="p-3 rounded-xl bg-white text-xs text-slate-800 leading-relaxed shadow-xs border border-slate-200/80">
              {selectedNotifDetail?.message}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Delivery Status: <strong className="text-emerald-700 font-semibold">{selectedNotifDetail?.status || 'Delivered'}</strong></span>
              <span>Category: {selectedNotifDetail?.category}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedNotifDetail(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
