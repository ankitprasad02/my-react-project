/**
 * Generates unique IDs for appointments, patients, and notifications
 */

export function generateAppointmentId(existingAppointments = []) {
  const currentCount = existingAppointments.length + 1;
  const numPart = (1000 + currentCount).toString();
  return `APT-${numPart}`;
}

export function generatePatientId(existingPatients = []) {
  const currentCount = existingPatients.length + 1;
  const numPart = (100 + currentCount).toString();
  return `PAT-${numPart}`;
}

export function generateNotificationId() {
  return `NOTIF-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}
