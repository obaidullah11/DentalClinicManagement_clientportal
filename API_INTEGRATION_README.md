# API Integration Guide

This document explains how the frontend integrates with the Public Appointment API.

## Setup

1. **Environment Variables**: Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
   ```

2. **Install Dependencies**: All required dependencies are already included in the project.

## API Service

The API service is located in `src/services/api.ts` and provides the following functions:

### 1. `submitAppointment(request: SubmitAppointmentRequest)`
Submits a complete appointment request with patient information and medical history.

**Usage:**
```typescript
import { submitAppointment } from './services/api';

const response = await submitAppointment({
  patient: { ... },
  appointment: { ... },
  medicalHistory: { ... }
});

if (response.success) {
  console.log('Appointment Code:', response.data.appointment.appointmentCode);
} else {
  console.error('Error:', response.message);
}
```

### 2. `checkAvailability(date: string, time?: string)`
Checks if a time slot is available.

**Usage:**
```typescript
import { checkAvailability } from './services/api';

const response = await checkAvailability('2024-11-20', '10:00 AM');
if (response.success && response.data.available) {
  // Time slot is available
}
```

### 3. `getAppointmentByCode(appointmentCode: string)`
Retrieves appointment details by appointment code.

**Usage:**
```typescript
import { getAppointmentByCode } from './services/api';

const response = await getAppointmentByCode('COSMO-2024-001234');
if (response.success) {
  console.log('Appointment:', response.data.appointment);
}
```

### 4. `checkExistingPatient(request: CheckPatientRequest)`
Checks if a patient already exists.

**Usage:**
```typescript
import { checkExistingPatient } from './services/api';

const response = await checkExistingPatient({
  emailAddress: 'john@example.com',
  mobileNumber: '+639171234567'
});
```

## Data Transformation

The `AppointmentConfirmation` component automatically transforms `BookingData` to the API format:

- Converts date formats to YYYY-MM-DD
- Converts time formats to HH:MM AM/PM
- Validates enum values (gender, civilStatus, etc.)
- Trims and sanitizes string inputs
- Handles optional fields correctly

## Error Handling

All API functions return a discriminated union type:

```typescript
type ApiResponse<T> = 
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Record<string, string[]>; error?: {...} }
```

Always check `response.success` before accessing `response.data`.

## Error Types

1. **Validation Errors (400)**: Field-level validation failures
2. **Time Slot Unavailable (409)**: Selected time is already booked
3. **Duplicate Patient (422)**: Patient already exists
4. **Network Errors**: Connection issues, timeouts

## Component Integration

### AppointmentConfirmation Component

The `AppointmentConfirmation` component:
- Automatically submits the appointment when mounted
- Shows loading state during submission
- Displays error messages with validation details
- Shows success state with appointment code
- Handles all edge cases and error scenarios

## Testing

To test the API integration:

1. Ensure the backend API is running on `http://127.0.0.1:8000`
2. Complete the booking flow in the frontend
3. Check the browser console for any errors
4. Verify the appointment code is displayed on success

## Troubleshooting

### API Connection Issues
- Check that `REACT_APP_API_BASE_URL` is set correctly
- Verify the backend server is running
- Check CORS configuration on the backend

### Validation Errors
- Ensure all required fields are filled
- Check date format is YYYY-MM-DD
- Verify time format is HH:MM AM/PM
- Check enum values match API requirements

### Network Errors
- Check internet connection
- Verify API endpoint is accessible
- Check browser console for CORS errors

## Future Enhancements

Potential improvements:
- Add retry logic for failed requests
- Implement request caching
- Add request debouncing for availability checks
- Add offline support with queue
- Add request/response logging



