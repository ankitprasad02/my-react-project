export const initialNotifications = [
  {
    id: "notif-1",
    appointmentId: "APT-1001",
    patientName: "Aarav Sharma",
    patientPhone: "+91 98201 54321",
    type: "WhatsApp",
    category: "Booking Confirmation",
    message: "Namaste Aarav! Your appointment with Dr. Rajesh Sharma is confirmed for today at 10:00 AM. Token #1 at OPD Suite 102. Please arrive 10 minutes early. - PulseQ Healthcare",
    status: "Read",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "notif-2",
    appointmentId: "APT-1002",
    patientName: "Sunita Verma",
    patientPhone: "+91 98112 65432",
    type: "SMS",
    category: "Booking Confirmation",
    message: "PulseQ Clinic: Sunita Verma, your appointment with Dr. Rajesh Sharma is confirmed. Token #2, Time: 10:15 AM today. Track live queue at pulseq.in/track",
    status: "Delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString()
  },
  {
    id: "notif-3",
    appointmentId: "APT-1003",
    patientName: "Rohan Gupta",
    patientPhone: "+91 97170 12345",
    type: "WhatsApp",
    category: "Queue Status Reminder",
    message: "Hello Rohan! You are Token #3. You have checked in at PulseQ Clinic. Currently 1 patient ahead of you. Estimated consultation time: 10:30 AM.",
    status: "Delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "notif-4",
    appointmentId: "APT-1001",
    patientName: "Aarav Sharma",
    patientPhone: "+91 98201 54321",
    type: "SMS",
    category: "Consultation Completed",
    message: "PulseQ Clinic: Consultation completed with Dr. Rajesh Sharma. Your digital prescription and pharmacy order are ready at the reception desk. Get well soon!",
    status: "Delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "notif-5",
    appointmentId: "APT-1011",
    patientName: "Amitabh Sen",
    patientPhone: "+91 98310 45678",
    type: "WhatsApp",
    category: "Booking Confirmation",
    message: "Namaste Amitabh! Your appointment with Dr. Priya Patel is confirmed for 10:30 AM. Token #1 at OPD Suite 105. Please bring your latest kidney function reports.",
    status: "Read",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  }
];
