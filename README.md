# DocPulse - Doctor Appointment Scheduling & Real-Time Patient Delay Notification System

A modern, responsive healthcare SaaS web application built with **React.js, Vite, and Tailwind CSS**. Designed for clinics, hospitals, and outpatient departments (OPDs) where doctors see multiple patients daily, and delay notifications must be automatically computed and dispatched to waiting patients in real-time.

---

## 🌟 Key Features & Highlights

### 0. 🌐 Modern SaaS Home Landing Page (`/`)
- **Hero Presentation:** High-impact introduction to zero-wait outpatient queue management and deterministic delay recalculation.
- **Embedded Live Queue Search Widget:** Visitors can enter an Appointment ID or phone number directly from the homepage to check their status with 1-click sample token buttons.
- **Live OPD Metrics Banner:** Real-time counters showing total appointments, waiting patients, completed consultations, and outbound notifications dispatched today.
- **Dedicated Role Portals Showcase:** Interactive launchpad cards for **Admin / Reception**, **Doctor Desk**, and **Patient Portal**.
- **Interactive Scheduling Math Walkthrough:** 4-step explanation of serial number time formulas and delay safeguards.
- **Enterprise Features Grid:** Overview of delay algorithms, WhatsApp & SMS simulation, Recharts analytics, and local storage persistence.

### 1. 🏥 Admin / Receptionist Dashboard (`/admin`)
- **Real-Time KPI Cards:** Total Appointments Today, Patients Waiting, In-Consultation, Completed Consultations, Delayed Slots, and Cancelled Slots.
- **Queue Analytics Flow:** Recharts interactive bar chart tracking hourly appointment status distribution (Completed, Waiting, Delayed).
- **Appointment Management (`/admin/appointments`):**
  - Search patients by name, phone (+91 format), serial number (`#3`), or Appointment ID (`APT-1003`).
  - Filter by Doctor, Status, and Date.
  - Sort by serial number ascending / descending.
  - Book new appointment with **automatic serial number increment and time calculation**.
  - Cancel appointment with automated notification dispatch simulation.
- **Patient Management (`/admin/patients`):**
  - Register new patients (Name, Age, Gender, Phone, Email, Blood Group, Allergies).
  - Medical visit history and quick record lookup.
- **Doctor & OPD Management (`/admin/doctors`):**
  - Doctor profiles with specialization, consultation slot duration, clinic opening/closing hours, room numbers, and on-duty availability toggles.
- **Dedicated Delay Management Engine (`/admin/delays`):**
  - Select doctor and announce delay in minutes (+10m, +15m, +20m, +30m, +60m presets or custom minutes).
  - Automatically recalculates revised estimated arrival times for all pending patients.
  - **Safeguard Rule:** Completed and Cancelled appointments are strictly locked and never modified.
  - Side-by-side comparison of original vs. revised arrival times.
  - Confirmation dialog before applying changes.
  - Broadcasts simulated WhatsApp and SMS notifications with delay reason.
- **Notification Feed (`/admin/notifications`):**
  - Audit trail of all simulated SMS and WhatsApp alerts dispatched to patients.
  - Test ping trigger for real-time dispatch verification.

---

### 2. 🩺 Doctor Dashboard (`/doctor`)
- **Active Consultation Desk:**
  - Patient card displaying current patient's name, serial number, contact, and chief complaints.
  - **Live Consultation Timer:** Tracks consultation elapsed time in minutes and seconds.
  - **Consultation & Prescription Notes:** Doctor can write clinical diagnoses and notes.
  - **Status Actions:** *Start Consultation*, *Complete Consultation*, and *Mark Patient Absent / No-Show*.
- **Queue Controls:**
  - *Pause / Resume Queue* button for doctors stepping out for breaks.
  - *Quick Delay Announcement* (+10m, +15m, +30m) directly from desk.
- **Today's Queue (`/doctor/queue`):**
  - Complete roster of today's patients ordered by serial number with live delay adjustments.
- **Patient History (`/doctor/history`):**
  - List of patients seen today with consultation notes and prescription records.

---

### 3. 📱 Patient Portal (`/patient`)
- **Mobile-Friendly Live Queue Tracker:**
  - Search by **Appointment ID** (e.g. `APT-1003`, `1002`) or **10-Digit Indian Phone Number** (e.g. `9819283746`).
  - Pre-filled one-click demo pills for quick evaluation (`APT-1003 (Waiting)`, `APT-1002 (In Consultation)`, etc.).
- **Prominent Delay Alert Banner:**
  - Displays high-visibility notification banner when doctor announces a delay:
    > *"⚠️ Doctor is Running 20 Minutes Late due to an emergency case. Your revised consultation time is 11:20 AM (was 11:00 AM)."*
- **Queue Progress & Countdown:**
  - Live count of **patients ahead of you** in queue (e.g., *2 Patients Ahead of You*).
  - Estimated waiting time countdown based on consultation slot duration.
  - 4-stage visual lifecycle: *Booked -> In Queue -> Consulting -> Completed*.
- **Digital Token Slip:**
  - Verified appointment pass with assigned Serial Number, Doctor Name, OPD Room Number, and printable slip download.
- **Notification History Log:**
  - Personal log of WhatsApp and SMS messages sent specifically to this patient.

---

## 📐 Mathematical Scheduling & Delay Logic

### Base Formula
For any doctor with Clinic Opening Time $T_0$ and slot duration $D$:
$$\text{Scheduled Time} = T_0 + (\text{Serial Number} - 1) \times D$$

**Example:**
- Doctor Opening Time: `10:00 AM`, Slot Duration: `15 mins`
- Serial 1: `10:00 AM`
- Serial 2: `10:15 AM`
- Serial 3: `10:30 AM`
- Serial 4: `10:45 AM`
- Serial 5: `11:00 AM`

### Delay Recalculation Engine
When a delay of $\Delta$ minutes is announced:
$$\text{Revised Estimated Time} = \text{Original Scheduled Time} + \Delta$$
- **Safeguard Rules:**
  1. Appointments with status `Completed`, `Cancelled`, or `Absent` retain their recorded state and are **never** altered.
  2. Original booked times are preserved alongside revised estimated times.
  3. All pending (`Scheduled` or `Delayed`) patients are updated atomically and receive automated simulated notifications.

---

## 🛠️ Technology Stack

- **Framework:** React 18 (Functional components & Hooks)
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS (Healthcare teal & medical emerald palette)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Analytics:** Recharts
- **Toast Notifications:** React Hot Toast
- **Persistence:** Browser `localStorage` with a 1-click **Reset Demo Data** action

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher, tested on v22)
- npm (v9 or higher)

### Installation & Launch

1. Open a terminal in the project directory:
   ```bash
   cd c:\Users\Ankit\Desktop\appointment_booking\Frontend
   ```

2. Dependencies are already installed. Start the development server:
   ```bash
   npm run dev
   ```
   Or from the root directory:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🧪 Quick Test Scenarios for Demonstration

1. **Test Delay Recalculation (Admin):**
   - Go to **Delay Management** (`/admin/delays`).
   - Select **Dr. Rajesh Sharma**.
   - Click the **+20m** preset and click **Apply Delay & Notify Patients**.
   - Notice that Serial #1 (Completed) and Serial #7 (Cancelled) remain unchanged, while Serials #3, #4, #5, #6, #8, #9, and #10 have their times bumped by 20 minutes with amber badges!
   - Check the **Notifications** tab (`/admin/notifications`) to see newly dispatched WhatsApp and SMS messages.

2. **Test Doctor Consultation Desk (Doctor):**
   - Click the role switcher in the top bar to switch to **Doctor Portal** (`/doctor`).
   - Notice Dr. Rajesh Sharma's active queue.
   - Click **Call Next: Serial #3 (Rohan Sharma)**.
   - Watch the consultation timer begin ticking in real-time.
   - Enter prescription notes and click **Complete Consultation**.

3. **Test Patient Live Tracker (Patient Portal):**
   - Switch to **Patient Portal** (`/patient`).
   - Click the sample pill **APT-1003 (Waiting & Delayed)**.
   - Observe the prominent yellow delay banner, the live counter showing patients ahead in queue, estimated arrival time, and the complete WhatsApp/SMS notification timeline.

4. **Test Booking New Appointment:**
   - In Admin, click **Add Appointment**.
   - Notice the next Serial Number and time slot are computed automatically based on the doctor's opening time and slot duration!
