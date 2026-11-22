/**
 * Utility functions for healthcare clinic scheduling, serial number time calculations,
 * and delay propagation.
 */

/**
 * Convert time string like "10:00 AM" or "02:30 PM" to minutes from midnight
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convert minutes from midnight to formatted 12-hour time string "10:15 AM"
 */
export function minutesToTimeString(totalMinutes) {
  let normalized = Math.max(0, totalMinutes) % (24 * 60);
  let hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedHours = displayHours.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes} ${period}`;
}

/**
 * Core Business Logic Formula:
 * Appointment Time = Opening Time + (Serial Number - 1) * Consultation Duration
 */
export function calculateAppointmentTime(openingTimeStr, serialNumber, durationMinutes = 15) {
  const openingMinutes = timeStringToMinutes(openingTimeStr);
  const offset = (Math.max(1, serialNumber) - 1) * durationMinutes;
  return minutesToTimeString(openingMinutes + offset);
}

/**
 * Add delay minutes to a time string
 */
export function addDelayToTime(timeStr, delayMinutes = 0) {
  const currentMinutes = timeStringToMinutes(timeStr);
  return minutesToTimeString(currentMinutes + delayMinutes);
}

/**
 * Calculate difference in minutes between two time strings
 */
export function getTimeDifferenceInMinutes(earlierTimeStr, laterTimeStr) {
  const t1 = timeStringToMinutes(earlierTimeStr);
  const t2 = timeStringToMinutes(laterTimeStr);
  return Math.max(0, t2 - t1);
}

/**
 * Get formatted current date in readable form (e.g., "Sunday, 22 Nov 2026")
 */
export function getFormattedToday() {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get standard ISO date string YYYY-MM-DD
 */
export function getTodayISODate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Format timestamp for notification logs (e.g., "Today at 10:14 AM")
 */
export function formatNotificationTimestamp(dateOrIso) {
  if (!dateOrIso) return 'Just now';
  const d = new Date(dateOrIso);
  if (isNaN(d.getTime())) return dateOrIso;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
