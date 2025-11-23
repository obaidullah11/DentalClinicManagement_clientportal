# API Requirements: Appointment Request Submission

## Overview
This document specifies the complete API requirements for submitting appointment requests from the client booking system. The API must handle patient registration, appointment creation, and medical history submission in a single transaction or coordinated workflow.

---

## Base Configuration

- **Base URL**: `http://127.0.0.1:8000/api` (Development)
- **Production URL**: `https://api.cosmodental.com/api` (Production)
- **Content Type**: `application/json`
- **Response Format**: JSON
- **Authentication**: Not required for public appointment submission (or optional API key)

---

## Endpoint: Submit Appointment Request

### POST `/api/public/appointments/submit`

**Description**: Creates a new appointment request with complete patient information and medical history.

**Request Method**: `POST`

**Request Headers**:
```http
Content-Type: application/json
Accept: application/json
```

---

## Request Body Structure

### Complete Request Payload

```json
{
  "patient": {
    "patientType": "New" | "Existing",
    "firstName": "string (required, min: 1, max: 100)",
    "lastName": "string (required, min: 1, max: 100)",
    "middleName": "string (optional, max: 100)",
    "gender": "Male" | "Female" | "Other" | "Prefer not to say",
    "civilStatus": "Single" | "Married" | "Divorced" | "Widowed" | "Separated",
    "dateOfBirth": "string (YYYY-MM-DD, required)",
    "occupation": "string (optional, max: 200)",
    "mobileNumber": "string (required, format: +[country code][number])",
    "emailAddress": "string (required, valid email format)"
  },
  "appointment": {
    "reason": "string (required, must be from procedure_choices or custom)",
    "selectedDate": "string (YYYY-MM-DD, required, must be future date)",
    "selectedTime": "string (required, format: 'HH:MM AM/PM' or 'HH:MM')",
    "howDidYouKnow": "Walk-in" | "Referred by a relative or friend" | "Google" | "Social Media" | "YouTube" | "Others",
    "notes": "string (optional, max: 1000, preferred dentist or special requests)"
  },
  "medicalHistory": {
    "generalHealth": "string (optional, max: 500)",
    "medicalTreatment": "string (optional, max: 500)",
    "medicalCondition": "string (optional, max: 500)",
    "services": "string (optional, max: 500)",
    "hospitalized": "Yes" | "No" | "",
    "hospitalizedWhy": "string (required if hospitalized='Yes', max: 500)",
    "prescriptionMedication": "Yes" | "No" | "",
    "prescriptionSpecify": "string (required if prescriptionMedication='Yes', max: 500)",
    "tobacco": "Yes" | "No" | "",
    "alcohol": "Yes" | "No" | "",
    "allergic": "Yes" | "No" | "",
    "allergicItems": {
      "localAnesthetic": "boolean",
      "penicillin": "boolean",
      "sulfa": "boolean",
      "aspirin": "boolean",
      "latex": "boolean",
      "others": "boolean"
    },
    "bleedingTime": "string (optional, max: 100)",
    "forWomenOnly": {
      "pregnant": "Yes" | "No" | "N/A" | "",
      "nursing": "Yes" | "No" | "N/A" | "",
      "birthControl": "Yes" | "No" | "N/A" | ""
    },
    "bloodType": "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" | "",
    "bloodPressure": "string (optional, format: 'XXX/XX', max: 20)",
    "followingConditions": [
      "string (array of condition names, optional)"
    ]
  }
}
```

---

## Field Validation Requirements

### Patient Information

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `patientType` | string | Yes | Must be "New" or "Existing" |
| `firstName` | string | Yes | 1-100 characters, alphanumeric and spaces only |
| `lastName` | string | Yes | 1-100 characters, alphanumeric and spaces only |
| `middleName` | string | No | Max 100 characters, alphanumeric and spaces only |
| `gender` | string | Yes | Must be one of: Male, Female, Other, Prefer not to say |
| `civilStatus` | string | Yes | Must be one of: Single, Married, Divorced, Widowed, Separated |
| `dateOfBirth` | date | Yes | Valid date in YYYY-MM-DD format, must be in the past, age must be >= 0 and <= 150 |
| `occupation` | string | No | Max 200 characters |
| `mobileNumber` | string | Yes | Valid phone format with country code (e.g., +639171234567) |
| `emailAddress` | string | Yes | Valid email format, max 255 characters |

### Appointment Information

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `reason` | string | Yes | Must be from procedure_choices API or custom text (max 200 chars) |
| `selectedDate` | date | Yes | YYYY-MM-DD format, must be today or future date, not more than 1 year ahead |
| `selectedTime` | string | Yes | Valid time format (HH:MM AM/PM or 24-hour format), must be within clinic hours |
| `howDidYouKnow` | string | Yes | Must be one of the predefined options |
| `notes` | string | No | Max 1000 characters |

### Medical History

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `generalHealth` | string | No | Max 500 characters |
| `medicalTreatment` | string | No | Max 500 characters |
| `medicalCondition` | string | No | Max 500 characters |
| `services` | string | No | Max 500 characters |
| `hospitalized` | string | No | Must be "Yes", "No", or empty |
| `hospitalizedWhy` | string | Conditional | Required if hospitalized="Yes", max 500 characters |
| `prescriptionMedication` | string | No | Must be "Yes", "No", or empty |
| `prescriptionSpecify` | string | Conditional | Required if prescriptionMedication="Yes", max 500 characters |
| `tobacco` | string | No | Must be "Yes", "No", or empty |
| `alcohol` | string | No | Must be "Yes", "No", or empty |
| `allergic` | string | No | Must be "Yes", "No", or empty |
| `allergicItems` | object | No | Object with boolean values |
| `bleedingTime` | string | No | Max 100 characters |
| `forWomenOnly` | object | No | Object with pregnant, nursing, birthControl fields |
| `bloodType` | string | No | Must be valid blood type or empty |
| `bloodPressure` | string | No | Format: XXX/XX (e.g., 120/80), max 20 characters |
| `followingConditions` | array | No | Array of strings, each max 200 characters |

---

## Success Response (201 Created)

```json
{
  "success": true,
  "message": "Appointment request submitted successfully",
  "data": {
    "appointment": {
      "id": 12345,
      "appointmentCode": "COSMO-2024-001234",
      "status": "Pending",
      "selectedDate": "2024-11-15",
      "selectedTime": "10:00 AM",
      "reason": "Consultation",
      "notes": "First time visit",
      "howDidYouKnow": "Google",
      "createdAt": "2024-11-10T21:33:16+00:00",
      "updatedAt": "2024-11-10T21:33:16+00:00"
    },
    "patient": {
      "id": 67890,
      "patientType": "New",
      "firstName": "John",
      "lastName": "Doe",
      "middleName": "Michael",
      "emailAddress": "john.doe@example.com",
      "mobileNumber": "+639171234567",
      "createdAt": "2024-11-10T21:33:16+00:00"
    },
    "medicalHistory": {
      "id": 11111,
      "patientId": 67890,
      "createdAt": "2024-11-10T21:33:16+00:00"
    }
  }
}
```

---

## Error Responses

### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "patient.firstName": ["The first name field is required."],
    "patient.emailAddress": ["The email address must be a valid email format."],
    "appointment.selectedDate": ["The selected date must be a future date."],
    "appointment.selectedTime": ["The selected time slot is not available."]
  }
}
```

### 409 Conflict - Time Slot Unavailable

```json
{
  "success": false,
  "message": "The selected time slot is not available",
  "error": {
    "code": "TIME_SLOT_UNAVAILABLE",
    "message": "The appointment time 10:00 AM on 2024-11-15 is already booked.",
    "suggestedTimes": [
      "10:30 AM",
      "11:00 AM",
      "2:00 PM"
    ]
  }
}
```

### 422 Unprocessable Entity - Duplicate Patient

```json
{
  "success": false,
  "message": "Patient already exists",
  "error": {
    "code": "DUPLICATE_PATIENT",
    "message": "A patient with this email or mobile number already exists.",
    "existingPatientId": 67890,
    "suggestion": "Use patientType: 'Existing' and provide patientId instead"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An error occurred while processing your request",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Please try again later or contact support."
  }
}
```

---

## Business Logic Requirements

### 1. Patient Creation/Retrieval
- **New Patients**: Create new patient record
- **Existing Patients**: 
  - Check if patient exists by email or mobile number
  - If exists, return existing patient ID
  - If not exists but marked as "Existing", return error suggesting to use "New"
- **Duplicate Prevention**: Check email and mobile number uniqueness

### 2. Appointment Code Generation
- Format: `COSMO-{YEAR}-{SEQUENTIAL_NUMBER}`
- Example: `COSMO-2024-001234`
- Must be unique
- Sequential number should reset annually or continue incrementing

### 3. Time Slot Validation
- Check if selected time slot is available
- Validate against clinic operating hours
- Check for existing appointments at the same time
- Consider appointment duration (default: 45 minutes)
- If unavailable, suggest alternative times

### 4. Date Validation
- Selected date must be today or future
- Cannot be more than 1 year in advance
- Must not be on clinic holidays (if configured)
- Must be a valid weekday (if clinic only operates weekdays)

### 5. Medical History
- Always create medical history record (even if mostly empty)
- Link to patient record
- Store all provided information
- Mark incomplete fields as null/empty

### 6. Status Management
- New appointments start with status: "Pending"
- Status can be updated later by clinic staff to: "Confirmed", "Cancelled", "Completed"

---

## Transaction Requirements

### Option 1: Single Transaction (Recommended)
All operations (patient, appointment, medical history) should be wrapped in a database transaction:
- If any part fails, rollback all changes
- Ensures data consistency
- Atomic operation

### Option 2: Sequential with Rollback
If single transaction is not possible:
1. Create patient first
2. Create appointment (linked to patient)
3. Create medical history (linked to patient)
4. If any step fails, rollback previous steps

---

## Additional Endpoints Required

### 1. Check Time Slot Availability

**GET** `/api/public/appointments/availability`

**Query Parameters**:
- `date` (required): YYYY-MM-DD
- `time` (optional): HH:MM AM/PM

**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2024-11-15",
    "available": true,
    "time": "10:00 AM",
    "alternativeTimes": [
      "10:30 AM",
      "11:00 AM"
    ]
  }
}
```

### 2. Get Appointment by Code

**GET** `/api/public/appointments/code/{appointmentCode}`

**Response**:
```json
{
  "success": true,
  "data": {
    "appointment": { ... },
    "patient": { ... },
    "status": "Pending"
  }
}
```

### 3. Check Existing Patient

**POST** `/api/public/patients/check`

**Request Body**:
```json
{
  "emailAddress": "john.doe@example.com",
  "mobileNumber": "+639171234567"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "exists": true,
    "patientId": 67890,
    "patient": { ... }
  }
}
```

---

## Notification Requirements

After successful submission, the system should:

1. **Send Confirmation Email** (if email service configured)
   - Appointment code
   - Date and time
   - Patient name
   - Reason for visit
   - Note that it's pending confirmation

2. **Send SMS Notification** (if SMS service configured)
   - Short message with appointment code
   - Date and time

3. **Internal Notification** (for clinic staff)
   - New appointment request notification
   - Include all appointment details
   - Link to appointment management system

---

## Security Requirements

1. **Rate Limiting**
   - Maximum 5 appointment submissions per IP per hour
   - Maximum 3 appointment submissions per email per day

2. **Input Sanitization**
   - Sanitize all string inputs to prevent XSS
   - Validate and escape HTML content
   - Prevent SQL injection

3. **Data Privacy**
   - Encrypt sensitive data (medical history)
   - Log access to patient data
   - Comply with HIPAA/GDPR requirements

4. **CORS Configuration**
   - Allow requests from frontend domain
   - Restrict to specific origins

---

## Performance Requirements

- **Response Time**: < 2 seconds for 95% of requests
- **Concurrent Requests**: Support at least 50 concurrent submissions
- **Database**: Optimize queries with proper indexes
- **Caching**: Cache clinic hours and availability data

---

## Testing Requirements

### Test Cases

1. **Valid New Patient Appointment**
   - All required fields provided
   - Valid date and time
   - Should return success with appointment code

2. **Existing Patient Appointment**
   - Email/mobile matches existing patient
   - Should link to existing patient record

3. **Invalid Date/Time**
   - Past date → Error
   - Invalid time format → Error
   - Unavailable time slot → Error with suggestions

4. **Missing Required Fields**
   - Missing firstName → Validation error
   - Missing email → Validation error

5. **Duplicate Prevention**
   - Same email, different name → Handle appropriately
   - Same mobile, different email → Handle appropriately

6. **Medical History Edge Cases**
   - Empty medical history → Should still create record
   - Conditional fields (hospitalizedWhy when hospitalized=Yes) → Validation

---

## Example Complete Request

```json
{
  "patient": {
    "patientType": "New",
    "firstName": "Maria",
    "lastName": "Santos",
    "middleName": "Cruz",
    "gender": "Female",
    "civilStatus": "Married",
    "dateOfBirth": "1990-05-15",
    "occupation": "Teacher",
    "mobileNumber": "+639171234567",
    "emailAddress": "maria.santos@example.com"
  },
  "appointment": {
    "reason": "Cleaning",
    "selectedDate": "2024-11-20",
    "selectedTime": "2:00 PM",
    "howDidYouKnow": "Google",
    "notes": "Prefer Dr. Smith if available"
  },
  "medicalHistory": {
    "generalHealth": "Good",
    "medicalTreatment": "None",
    "medicalCondition": "None",
    "services": "Regular checkup",
    "hospitalized": "No",
    "hospitalizedWhy": "",
    "prescriptionMedication": "No",
    "prescriptionSpecify": "",
    "tobacco": "No",
    "alcohol": "Occasionally",
    "allergic": "Yes",
    "allergicItems": {
      "localAnesthetic": false,
      "penicillin": true,
      "sulfa": false,
      "aspirin": false,
      "latex": false,
      "others": false
    },
    "bleedingTime": "Normal",
    "forWomenOnly": {
      "pregnant": "No",
      "nursing": "No",
      "birthControl": "Yes"
    },
    "bloodType": "O+",
    "bloodPressure": "120/80",
    "followingConditions": []
  }
}
```

---

## Integration Notes

1. **Frontend Integration**: The frontend should call this endpoint when user reaches the final confirmation step
2. **Error Handling**: Frontend should display validation errors clearly to users
3. **Loading States**: Show loading indicator during submission
4. **Success Handling**: Display appointment code and confirmation message
5. **Retry Logic**: Implement retry for network failures (max 3 attempts)

---

## Database Schema Considerations

### Required Tables
1. `patients` - Patient information
2. `appointments` - Appointment records
3. `medical_histories` - Medical history records
4. `appointment_status_logs` - Status change history (optional)

### Required Indexes
- `patients.email_address` (unique)
- `patients.mobile_number` (unique)
- `appointments.appointment_code` (unique)
- `appointments.selected_date` + `appointments.selected_time` (composite for availability checks)
- `appointments.patient_id` (foreign key)
- `medical_histories.patient_id` (foreign key)

---

## Version History

- **v1.0** - Initial specification (2024-11-10)

---

This specification provides complete requirements for implementing the appointment submission API endpoint. All fields, validations, error handling, and business logic are documented for backend implementation.



