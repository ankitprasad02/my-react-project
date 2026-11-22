import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRoleContext = createContext(null);

export function AuthRoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'doctor' | 'patient'
  const [activeDoctorId, setActiveDoctorId] = useState('doc-1');
  const [patientLookupQuery, setPatientLookupQuery] = useState('');

  const switchRole = (newRole, doctorId = null) => {
    setCurrentRole(newRole);
    if (doctorId) {
      setActiveDoctorId(doctorId);
    }
  };

  return (
    <AuthRoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeDoctorId,
        setActiveDoctorId,
        switchRole,
        patientLookupQuery,
        setPatientLookupQuery,
      }}
    >
      {children}
    </AuthRoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useRole must be used within an AuthRoleProvider');
  }
  return context;
}
