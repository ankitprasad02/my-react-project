import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { initialDoctors } from '../data/initialDoctors';
import { initialPatients } from '../data/initialPatients';
import { initialAppointments } from '../data/initialAppointments';
import { initialNotifications } from '../data/initialNotifications';
import { getFromStorage, saveToStorage } from '../utils/storage';
import {
  calculateAppointmentTime,
  addDelayToTime,
  timeStringToMinutes,
  getTodayISODate
} from '../utils/timeCalculations';
import {
  generateAppointmentId,
  generatePatientId,
  generateNotificationId
} from '../utils/idGenerators';

const ClinicContext = createContext(null);

const STORAGE_KEYS = {
  DOCTORS: 'pulseq_doctors_v1',
  PATIENTS: 'pulseq_patients_v1',
  APPOINTMENTS: 'pulseq_appointments_v1',
  NOTIFICATIONS: 'pulseq_notifications_v1',
};

export function ClinicProvider({ children }) {
  // Load state from localStorage with fallbacks
  const [doctors, setDoctors] = useState(() => 
    getFromStorage(STORAGE_KEYS.DOCTORS, initialDoctors)
  );

  const [patients, setPatients] = useState(() => 
    getFromStorage(STORAGE_KEYS.PATIENTS, initialPatients)
  );

  const [appointments, setAppointments] = useState(() => 
    getFromStorage(STORAGE_KEYS.APPOINTMENTS, initialAppointments)
  );

  const [notifications, setNotifications] = useState(() => 
    getFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );

  // Sync to storage on state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DOCTORS, doctors);
  }, [doctors]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PATIENTS, patients);
  }, [patients]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  // -------------------------------------------------------------
  // CORE BUSINESS LOGIC: DELAY MANAGEMENT & SCHEDULE RECALCULATION
  // -------------------------------------------------------------

  /**
   * Applies an announced delay in minutes to a specific doctor.
   * Automatically recalculates revised appointment times for all pending patients.
   * Never modifies completed or cancelled or absent appointments.
   * Generates simulated WhatsApp & SMS notification entries.
   */
  const applyDoctorDelay = (doctorId, additionalDelayMinutes, reason = "Unscheduled clinical emergency") => {
    const delayNum = parseInt(additionalDelayMinutes, 10);
    if (isNaN(delayNum) || delayNum <= 0) {
      toast.error("Please enter a valid delay in minutes.");
      return { success: false, affectedCount: 0 };
    }

    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      toast.error("Doctor not found.");
      return { success: false, affectedCount: 0 };
    }

    const newCumulativeDelay = (doctor.currentDelayMinutes || 0) + delayNum;

    // Identify pending appointments:
    // Exclude 'completed', 'cancelled', 'absent'
    const affectedAppointments = appointments.filter((app) => 
      app.doctorId === doctorId && 
      !['completed', 'cancelled', 'absent'].includes(app.status)
    );

    if (affectedAppointments.length === 0) {
      toast.error("No pending appointments found for this doctor.");
      return { success: false, affectedCount: 0 };
    }

    // 1. Recalculate estimated times
    const updatedAppointments = appointments.map((app) => {
      if (app.doctorId === doctorId && !['completed', 'cancelled', 'absent'].includes(app.status)) {
        // Compute revised estimated time based on original scheduled time + new total cumulative delay
        const recalculatedTime = addDelayToTime(app.originalTime, newCumulativeDelay);
        return {
          ...app,
          estimatedTime: recalculatedTime,
          delayMinutes: newCumulativeDelay,
          lastDelayAnnouncement: {
            delayAdded: delayNum,
            totalDelay: newCumulativeDelay,
            reason: reason,
            announcedAt: new Date().toISOString(),
          }
        };
      }
      return app;
    });

    // 2. Generate simulated WhatsApp & SMS notifications
    const newNotifications = [];
    const nowIso = new Date().toISOString();

    affectedAppointments.forEach((app, index) => {
      const recalculatedTime = addDelayToTime(app.originalTime, newCumulativeDelay);
      
      // WhatsApp notification
      newNotifications.push({
        id: generateNotificationId(),
        appointmentId: app.id,
        patientName: app.patientName,
        patientPhone: app.patientPhone,
        type: 'WhatsApp',
        category: 'Schedule Delay Alert',
        message: `Namaste ${app.patientName}, ${doctor.name} is running ${newCumulativeDelay} mins delayed due to ${reason.toLowerCase()}. Your revised estimated consultation time is ${recalculatedTime} (Original: ${app.originalTime}). Token #${app.serialNumber}. Please plan accordingly.`,
        status: 'Delivered',
        timestamp: nowIso
      });

      // SMS notification (alternate or dual channel)
      if (index % 2 === 0) {
        newNotifications.push({
          id: generateNotificationId(),
          appointmentId: app.id,
          patientName: app.patientName,
          patientPhone: app.patientPhone,
          type: 'SMS',
          category: 'Schedule Delay Alert',
          message: `PulseQ Alert: ${doctor.name} is delayed by ${newCumulativeDelay} min. Revised time: ${recalculatedTime} for Token #${app.serialNumber}. Track at pulseq.in/track`,
          status: 'Delivered',
          timestamp: nowIso
        });
      }
    });

    // 3. Update Doctor state
    const updatedDoctors = doctors.map((d) => {
      if (d.id === doctorId) {
        return {
          ...d,
          currentDelayMinutes: newCumulativeDelay,
          status: 'Delayed',
          lastDelayReason: reason,
          lastDelayUpdated: nowIso
        };
      }
      return d;
    });

    setAppointments(updatedAppointments);
    setDoctors(updatedDoctors);
    setNotifications((prev) => [...newNotifications, ...prev]);

    toast.success(`Schedule updated! +${delayNum}m delay applied. ${affectedAppointments.length} patients notified.`);
    return { success: true, affectedCount: affectedAppointments.length };
  };

  /**
   * Resets doctor's active delay back to 0
   */
  const resetDoctorDelay = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;

    const updatedAppointments = appointments.map((app) => {
      if (app.doctorId === doctorId && !['completed', 'cancelled', 'absent'].includes(app.status)) {
        return {
          ...app,
          estimatedTime: app.originalTime,
          delayMinutes: 0,
        };
      }
      return app;
    });

    const updatedDoctors = doctors.map((d) => {
      if (d.id === doctorId) {
        return {
          ...d,
          currentDelayMinutes: 0,
          status: 'Available',
          lastDelayReason: null,
        };
      }
      return d;
    });

    setAppointments(updatedAppointments);
    setDoctors(updatedDoctors);
    toast.success(`${doctor.name}'s delay has been reset to on-time.`);
  };

  // -------------------------------------------------------------
  // APPOINTMENT MANAGEMENT
  // -------------------------------------------------------------

  /**
   * Creates new appointment with automatic serial number and scheduled time
   * Formula: Opening Time + (Serial Number - 1) * Consultation Duration
   */
  const addAppointment = (appointmentData) => {
    const doctor = doctors.find((d) => d.id === appointmentData.doctorId);
    if (!doctor) {
      toast.error("Please select a valid doctor.");
      return null;
    }

    // Determine serial number for this doctor on this date
    const date = appointmentData.date || getTodayISODate();
    const doctorAppsOnDate = appointments.filter(
      (app) => app.doctorId === doctor.id && app.date === date
    );

    const nextSerial = doctorAppsOnDate.length > 0
      ? Math.max(...doctorAppsOnDate.map((a) => a.serialNumber || 0)) + 1
      : 1;

    // Calculate original appointment time based on doctor's opening time and consultation duration
    const originalTime = calculateAppointmentTime(
      doctor.openingTime,
      nextSerial,
      doctor.consultationDuration
    );

    // If doctor currently has an active delay, revise estimated time accordingly
    const currentDelay = doctor.currentDelayMinutes || 0;
    const estimatedTime = currentDelay > 0
      ? addDelayToTime(originalTime, currentDelay)
      : originalTime;

    const newId = generateAppointmentId(appointments);

    const newAppointment = {
      id: newId,
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      patientPhone: appointmentData.patientPhone,
      patientAge: appointmentData.patientAge || 30,
      patientGender: appointmentData.patientGender || "Other",
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: date,
      serialNumber: nextSerial,
      originalTime: originalTime,
      estimatedTime: estimatedTime,
      delayMinutes: currentDelay,
      status: "scheduled",
      chiefComplaint: appointmentData.chiefComplaint || "General consultation",
      priority: appointmentData.priority || "Normal",
      checkedIn: false,
      notes: appointmentData.notes || ""
    };

    setAppointments((prev) => [...prev, newAppointment]);

    // Send confirmation notification
    const confNotif = {
      id: generateNotificationId(),
      appointmentId: newId,
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      type: 'WhatsApp',
      category: 'Booking Confirmation',
      message: `Namaste ${newAppointment.patientName}! Your appointment with ${doctor.name} is booked for ${newAppointment.originalTime}. Token #${newAppointment.serialNumber}. - PulseQ Clinic`,
      status: 'Delivered',
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [confNotif, ...prev]);

    toast.success(`Appointment booked! Token #${nextSerial} at ${originalTime}`);
    return newAppointment;
  };

  const updateAppointment = (appointmentId, updatedFields) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, ...updatedFields } : app))
    );
    toast.success("Appointment updated successfully.");
  };

  const cancelAppointment = (appointmentId, reason = "Cancelled by patient/clinic") => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? { ...app, status: 'cancelled', cancellationReason: reason }
          : app
      )
    );

    const cancelledApp = appointments.find((a) => a.id === appointmentId);
    if (cancelledApp) {
      const cancelNotif = {
        id: generateNotificationId(),
        appointmentId: cancelledApp.id,
        patientName: cancelledApp.patientName,
        patientPhone: cancelledApp.patientPhone,
        type: 'SMS',
        category: 'Appointment Cancelled',
        message: `PulseQ Clinic: Your appointment Token #${cancelledApp.serialNumber} has been cancelled (${reason}). Call reception to reschedule.`,
        status: 'Delivered',
        timestamp: new Date().toISOString()
      };
      setNotifications((prev) => [cancelNotif, ...prev]);
    }

    toast.success("Appointment cancelled.");
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    let completedTimestamp = null;
    let startedTimestamp = null;

    if (newStatus === 'completed') {
      const now = new Date();
      completedTimestamp = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (newStatus === 'in-consultation') {
      const now = new Date();
      startedTimestamp = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === appointmentId) {
          const updated = { ...app, status: newStatus };
          if (completedTimestamp) updated.completedAt = completedTimestamp;
          if (startedTimestamp) updated.startedAt = startedTimestamp;
          if (newStatus === 'waiting') updated.checkedIn = true;
          return updated;
        }
        return app;
      })
    );

    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (newStatus === 'completed' && targetApp) {
      const compNotif = {
        id: generateNotificationId(),
        appointmentId: targetApp.id,
        patientName: targetApp.patientName,
        patientPhone: targetApp.patientPhone,
        type: 'WhatsApp',
        category: 'Consultation Completed',
        message: `Dear ${targetApp.patientName}, your consultation with ${targetApp.doctorName} is completed. Digital prescription is sent to your mobile. Thank you for visiting!`,
        status: 'Delivered',
        timestamp: new Date().toISOString()
      };
      setNotifications((prev) => [compNotif, ...prev]);
    }

    toast.success(`Appointment status set to ${newStatus}.`);
  };

  // -------------------------------------------------------------
  // PATIENT MANAGEMENT
  // -------------------------------------------------------------

  const addPatient = (patientData) => {
    const newId = generatePatientId(patients);
    const newPatient = {
      id: newId,
      name: patientData.name,
      age: parseInt(patientData.age, 10) || 30,
      gender: patientData.gender || 'Other',
      phone: patientData.phone,
      email: patientData.email || '',
      bloodGroup: patientData.bloodGroup || 'B+',
      address: patientData.address || '',
      history: patientData.history || 'No recorded chronic conditions'
    };
    setPatients((prev) => [newPatient, ...prev]);
    toast.success(`Patient ${newPatient.name} registered successfully.`);
    return newPatient;
  };

  const updatePatient = (patientId, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updatedFields } : p))
    );
    // Also sync patient name / phone on their appointments if updated
    if (updatedFields.name || updatedFields.phone) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.patientId === patientId
            ? {
                ...app,
                patientName: updatedFields.name || app.patientName,
                patientPhone: updatedFields.phone || app.patientPhone,
              }
            : app
        )
      );
    }
    toast.success("Patient details updated.");
  };

  const deletePatient = (patientId) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    toast.success("Patient record removed.");
  };

  // -------------------------------------------------------------
  // DOCTOR MANAGEMENT
  // -------------------------------------------------------------

  const updateDoctor = (doctorId, updatedFields) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, ...updatedFields } : d))
    );
    toast.success("Doctor information updated.");
  };

  const toggleDoctorAvailability = (doctorId) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === doctorId) {
          const nextStatus = d.status === 'Available' ? 'On Break' : 'Available';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
    toast.success("Doctor availability status updated.");
  };

  const pauseResumeDoctorQueue = (doctorId) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === doctorId) {
          const isPaused = d.isQueuePaused;
          return {
            ...d,
            isQueuePaused: !isPaused,
            status: !isPaused ? 'On Break' : (d.currentDelayMinutes > 0 ? 'Delayed' : 'Available')
          };
        }
        return d;
      })
    );
    toast.success("Queue status toggled.");
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------

  const sendManualNotification = ({ patientName, patientPhone, appointmentId, type, message, category }) => {
    const newNotif = {
      id: generateNotificationId(),
      appointmentId: appointmentId || "DIRECT",
      patientName,
      patientPhone,
      type: type || 'WhatsApp',
      category: category || 'Custom Message',
      message,
      status: 'Delivered',
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
    toast.success(`${type} notification sent to ${patientName}!`);
  };

  // -------------------------------------------------------------
  // RESET DEMO DATA
  // -------------------------------------------------------------
  const resetToDefaultData = () => {
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setNotifications(initialNotifications);
    saveToStorage(STORAGE_KEYS.DOCTORS, initialDoctors);
    saveToStorage(STORAGE_KEYS.PATIENTS, initialPatients);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    toast.success("Demonstration data restored to fresh initial state.");
  };

  return (
    <ClinicContext.Provider
      value={{
        doctors,
        patients,
        appointments,
        notifications,
        applyDoctorDelay,
        resetDoctorDelay,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        addPatient,
        updatePatient,
        deletePatient,
        updateDoctor,
        toggleDoctorAvailability,
        pauseResumeDoctorQueue,
        sendManualNotification,
        resetToDefaultData
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
}
