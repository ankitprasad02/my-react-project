import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout';
import { DoctorLayout } from './components/layout/DoctorLayout';
import { PatientLayout } from './components/layout/PatientLayout';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AppointmentsPage } from './pages/admin/AppointmentsPage';
import { PatientsPage } from './pages/admin/PatientsPage';
import { DoctorsPage } from './pages/admin/DoctorsPage';
import { DelayManagementPage } from './pages/admin/DelayManagementPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorQueuePage } from './pages/doctor/DoctorQueuePage';
import { DoctorPatientHistoryPage } from './pages/doctor/DoctorPatientHistoryPage';
import { DoctorNotificationsPage } from './pages/doctor/DoctorNotificationsPage';
import { DoctorSettingsPage } from './pages/doctor/DoctorSettingsPage';

// Patient Pages
import { PatientPortalPage } from './pages/patient/PatientPortalPage';

// Home Page
import { HomePage } from './pages/HomePage';

// Common
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Home Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Role A: Admin / Receptionist Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="delays" element={<DelayManagementPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Role B: Doctor Console Routes */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="queue" element={<DoctorQueuePage />} />
        <Route path="history" element={<DoctorPatientHistoryPage />} />
        <Route path="notifications" element={<DoctorNotificationsPage />} />
        <Route path="settings" element={<DoctorSettingsPage />} />
      </Route>

      {/* Role C: Patient Portal */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientPortalPage />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
