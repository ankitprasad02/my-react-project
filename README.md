# PulseQ — Doctor Appointment Scheduling & Real-Time Delay Notification System

A modern, production-grade healthcare SaaS web application built with **React, Vite, and Tailwind CSS**. Designed for multi-doctor outpatient departments (OPDs) and private clinics to handle appointment scheduling, dynamic serial number queue calculation, doctor delay announcements, automatic schedule recalculation, and simulated real-time WhatsApp & SMS patient notifications.

---

## 🚀 Key Features

### 1. 🏥 Admin / Receptionist Dashboard
- **Executive Operations Overview**:
  - Live KPIs: Total appointments today, patients waiting in clinic lounge, completed consultations, cancelled slots, delayed appointments, and average waiting times.
  - **Recharts Analytics**: Hourly patient flow distribution (Scheduled vs Waiting vs Completed) and status breakdown donut chart.
  - **Doctor Duty Cards**: Real-time room availability, slot durations, and active delay indicators.
  - **Live Upcoming Queue**: Quick status preview of next patients in line.
- **Appointment Management**:
  - Search by patient name, token/serial number, appointment ID, or phone number.
  - Multi-criteria filtering by appointment status (`Scheduled`, `Waiting`, `In Consultation`, `Completed`, `Cancelled`, `Absent`) and consulting doctor.
  - Token sorting (ascending/descending).
  - Add, edit, cancel, and inspect detailed appointment modal.
  - Automated token serial number assignment and time slot calculation formula:
    $$\text{Appointment Time} = \text{Opening Time} + (\text{Serial Number} - 1) \times \text{Consultation Duration}$$
- **Patient Management**:
  - Patient directory with demographics: Name, Age, Gender, Phone, Email, Blood Group, Address, and Clinical History.
  - Full consultation visit timeline & history per patient.
  - Register, edit, and delete patient records.
- **Doctor Management**:
  - Doctor profiles (qualifications, department, experience, assigned room).
  - Configurable consultation durations (e.g. 15 min or 20 min).
  - Clinic opening & closing times.
  - One-click duty toggle (`Available` vs `On Break`).
- **Dedicated Delay Announcement Engine**:
  - Announce additional doctor delays in minutes: Quick-select buttons (+10, +15, +20, +30, +60 min) or custom input.
  - Clinical reason tagging (Emergency clinical procedure, ICU rounds, Traffic delay, etc.).
  - **Automated Schedule Recalculation**: Automatically shifts estimated consultation times for all pending patients while strictly preserving completed and cancelled slots.
  - Live recalculation impact preview table showing old vs new times before applying.
  - Confirmation modal with safety checks.
  - Immediate simulated broadcast dispatch to affected patients via WhatsApp and SMS.
- **Notification Management**:
  - Comprehensive audit logs of all WhatsApp and SMS messages.
  - Delivery status tracking (`Delivered`, `Sent`, `Read`), timestamps, and categories.
  - Direct message composer to broadcast custom alerts.

---

### 2. 🩺 Doctor Consultation Room Console
- **Doctor Profile Header**: Shows active doctor name, OPD suite, standard slot length, and current delay status.
- **"Now Serving" Active Patient Card**:
  - Prominent in-room patient badge with age, gender, contact, and chief complaints.
  - "Start Consultation", "Mark Consultation as Completed", and "Mark Absent" actions.
- **Queue Controls**:
  - "Pause Queue / Take Break" toggle.
  - Instant "Announce Delay" trigger.
  - Queue overview displaying patients waiting in lounge vs upcoming scheduled arrivals.
- **Doctor Switcher**: Seamlessly switch between Dr. Rajesh Sharma (Cardiology) and Dr. Priya Patel (General Medicine).

---

### 3. 📱 Patient Portal
- **Mobile-First Responsive Interface**:
  - Search by Appointment ID (e.g. `APT-1003`) or 10-digit registered phone number (e.g. `9717012345`).
  - **1-Click Demo Patient Quick Select**: Easily demonstrate different patient states in 1 click.
- **Live Queue & Delay Card**:
  - Prominent Token / Serial Number badge.
  - Original scheduled time vs revised estimated consultation time.
  - **Prominent Delay Alert Banner**: Displays why the doctor is delayed and by how many minutes.
  - **Real-Time Queue Position**: Shows exact count of patients ahead in the queue.
  - **Estimated Waiting Time**: Calculated from queue position and doctor consultation pace.
  - **Self Check-In Button**: "I have arrived at the clinic" updates clinic reception in real time.
  - Patient-specific notification log history.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 with Vite |
| **Styling** | Tailwind CSS (Tailwind typography, custom color palette: Deep Teal `#0f766e` & Emerald) |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Notifications** | React Hot Toast |
| **Data Persistence** | State management + Browser `localStorage` with failover dummy data |

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── appointments/       # AppointmentModal, AppointmentDetailsModal
│   ├── common/             # Badge, Modal, ConfirmDialog, StatCard, SearchInput, RoleSwitcher
│   ├── delay/              # DelayModal, DelayAlertBanner
│   ├── layout/             # AdminLayout, DoctorLayout, PatientLayout, Navbar, Sidebar
│   └── patients/           # PatientModal, PatientHistoryModal
├── context/
│   ├── ClinicContext.jsx   # Core clinic state, recalculation logic, storage sync
│   └── AuthRoleContext.jsx # Role management (Admin, Doctor, Patient)
├── data/
│   ├── initialDoctors.js   # Doctors (Dr. Rajesh Sharma, Dr. Priya Patel)
│   ├── initialPatients.js  # 16 realistic Indian patient records
│   ├── initialAppointments.js # Full appointment dataset across doctors & statuses
│   └── initialNotifications.js# WhatsApp & SMS audit logs
├── pages/
│   ├── admin/              # AdminDashboard, AppointmentsPage, PatientsPage, DoctorsPage, DelayManagementPage, NotificationsPage, SettingsPage
│   ├── doctor/             # DoctorDashboard, DoctorQueuePage, DoctorPatientHistoryPage, DoctorNotificationsPage, DoctorSettingsPage
│   ├── patient/            # PatientPortalPage
│   └── NotFoundPage.jsx
├── utils/
│   ├── timeCalculations.js # Slot formulas, delay arithmetic, 12-hour formatters
│   ├── storage.js          # LocalStorage persistence wrapper
│   └── idGenerators.js     # Unique ID formatters (APT-xxxx, PAT-xxx)
├── App.jsx                 # Route definitions
├── main.jsx                # Application entry point with providers
└── index.css               # Tailwind directives and custom animation styles
```

---

## 🏃 Running the Application Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Launch
```bash
# 1. Install dependencies (already completed)
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The application runs on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🧪 Demonstration & Testing Guide

1. **Role Switching**:
   - Use the **Active Mode** dropdown in the top right navbar to toggle between:
     - `Admin / Receptionist`: Full operational controls.
     - `Dr. Rajesh Sharma` or `Dr. Priya Patel`: Doctor consultation views.
     - `Patient Portal`: Public patient tracking view.

2. **Testing Schedule Delay Propagation**:
   - Go to **Delay Management** or click **Announce Delay** on the Admin/Doctor dashboard.
   - Choose a doctor (e.g. Dr. Rajesh Sharma) and pick a delay (e.g. `+30 min`).
   - Notice the **Live Recalculation Preview**: All pending patients (e.g. Token #3, #4, #5) get updated times (e.g. 10:30 AM $\rightarrow$ 11:00 AM), while completed Token #1 and cancelled Token #8 remain strictly untouched.
   - Click **Preview & Apply Delay** and confirm.
   - Switch to **Patient Portal**: Look up Token #3 (`APT-1003` or phone `9717012345`). Notice the prominent amber delay alert banner, the revised 11:00 AM consultation time, and the simulated WhatsApp delay message in their timeline!

3. **Doctor Consultation Flow**:
   - Switch to **Doctor Console** (`/doctor`).
   - Click **Start Consultation** or **Mark Completed** for Token #2.
   - Notice the queue advances and notification logs update.

4. **Reset Demo Data**:
   - Click the **Reset Demo** button in the top navbar or under **Settings** anytime to restore fresh demonstration data.
