# Oralux — Patient Portal (Online Booking)

Patient-facing web app for the **Oralux Dental Clinic Management System**. Patients use it to book appointments through a multi-step flow (appointment type → reason → date/time → patient details → medical history → confirmation). Built with **Create React App + React 18 + TypeScript**.

This is one of **three** apps that make up the system:

| App | Repo | Stack | Default port |
|-----|------|-------|--------------|
| **Patient Portal** (this repo) | `DentalClinicManagement_clientportal` | CRA / React 18 / TS | **3000** |
| Admin Dashboard | `diliver_DentalClinicManagementFE` | Vite / React 18 / TS / Tailwind | 5173 |
| Backend API | `diliver_DentalClinicManagement` | Laravel 9 (XAMPP: Apache + MySQL) | 80 (Apache) |

The portal and the admin dashboard both talk to the **same Laravel backend API**.

---

## Prerequisites

- **Node.js 18.x** or later (LTS) and **npm 9.x**+
- The **backend API** running (the Laravel `diliver_DentalClinicManagement` project on XAMPP). Set that up first — see its README.

---

## Quick start (new developer)

```bash
# 1. Clone
git clone https://github.com/obaidullah11/DentalClinicManagement_clientportal.git
cd DentalClinicManagement_clientportal

# 2. Install dependencies
npm install

# 3. Configure the API URL (IMPORTANT — see note below)
cp .env.example .env.local
#   then edit .env.local if your backend is not at the default path

# 4. Run the dev server (http://localhost:3000)
npm start
```

---

## ⚠️ Environment configuration (the #1 gotcha)

The portal reads the backend URL from **`.env.local`** at the project root. CRA only exposes vars prefixed with `REACT_APP_`.

```env
# .env.local
REACT_APP_API_BASE_URL=http://localhost/diliver_DentalClinicManagement/public/api
```

- This must point at the **running Laravel backend** (Apache via XAMPP), **not** `http://localhost:8000`. A stray service on `:8000` will return 404s and the booking flow will silently fail.
- After changing `.env.local`, **restart `npm start`** (CRA only reads env vars at startup).
- `.env.local` is git-ignored (it's machine-specific). Commit changes to **`.env.example`** instead.

---

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm start` | Run the dev server with hot reload on http://localhost:3000 |
| `npm run build` | Production build into `build/` |
| `npm test` | Run the test runner |

---

## Booking flow overview

The booking wizard lives under `src/components/pages/` and is orchestrated by `src/App.tsx`:

1. Landing
2. Appointment type + reason
3. How did you know about us
4. Date / time selection (`DateTimeSelection.tsx`)
5. Patient details (`PatientDetailsForm_new.tsx`)
6. Medical history (`MedicalHistory.tsx`)
7. Confirmation (`AppointmentConfirmation.tsx`)

`currentStep` and `bookingData` persist to `localStorage` so a refresh doesn't lose progress. Step visibility (e.g. skipping Medical History for existing patients) is controlled by `isStepHidden()` in `App.tsx`. Shared booking types are in `src/types/BookingTypes.ts`.

---

## Project structure

```
src/
  App.tsx                       # wizard orchestration, step routing, persistence
  components/pages/             # one component per booking step
  types/BookingTypes.ts         # BookingData / MedicalHistory shapes
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Booking submit does nothing / 404s | `.env.local` is missing or points to the wrong backend. Set `REACT_APP_API_BASE_URL` to the Apache backend and restart. |
| Env change has no effect | Restart `npm start` — CRA reads env only at startup. |
| CORS errors | Ensure the Laravel backend allows the portal origin (`http://localhost:3000`) in its CORS config. |

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
