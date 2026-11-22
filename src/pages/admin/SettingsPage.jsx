import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Bell,
  Clock,
  ShieldCheck,
  Smartphone,
  Save,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { resetToDefaultData, doctors } = useClinic();

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success("Clinic operational parameters saved successfully.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Clinic Configuration & System Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          General settings, notification gateway simulation, and sample data restoration
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Clinic General Info */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <SettingsIcon className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              General Clinic Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinic / Healthcare Center Name
              </label>
              <input
                type="text"
                defaultValue="PulseQ Multispeciality Clinic & Heart Care"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Central Reception Contact (Toll Free)
              </label>
              <input
                type="text"
                defaultValue="+91 1800 200 4455"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Clinic Opening Time
              </label>
              <input
                type="text"
                defaultValue="10:00 AM"
                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs font-medium text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Slot Calculation Formula
              </label>
              <input
                type="text"
                disabled
                value="Opening Time + (Serial Number - 1) × Duration"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-mono text-slate-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Notification Simulation Gateway */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Real-Time Patient Notification Channels (Simulated)
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Instant WhatsApp Schedule Delay Alerts
                </p>
                <p className="text-[11px] text-slate-500">
                  Automatically dispatches revised appointment times to pending patients upon doctor delay announcements.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Fallback SMS Carrier Notifications
                </p>
                <p className="text-[11px] text-slate-500">
                  Sends fallback text message when high-priority delay threshold exceeds 30 minutes.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Reset Database Section */}
        <div className="rounded-2xl bg-rose-50/50 p-6 border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-rose-950 text-sm">
              Reset Demonstration Database
            </h3>
          </div>

          <p className="text-xs text-rose-800 leading-relaxed">
            Need to start a fresh presentation demo? Clicking this button will immediately wipe localStorage and repopulate 15+ Indian patients, doctors, scheduled slots, and notification logs to their initial clean state.
          </p>

          <button
            type="button"
            onClick={resetToDefaultData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Fresh Initial State</span>
          </button>
        </div>
      </form>
    </div>
  );
}
