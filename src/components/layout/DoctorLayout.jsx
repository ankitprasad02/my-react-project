import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useClinic } from '../../context/ClinicContext';
import { useRole } from '../../context/AuthRoleContext';

export function DoctorLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { doctors } = useClinic();
  const { activeDoctorId } = useRole();

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        role="doctor"
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title={`${currentDoctor?.name} — Consultation Room (${currentDoctor?.roomNumber})`}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
