# Backend API Specification for Dental Management System (DMS)

## Overview

This document outlines the complete backend API requirements for the Cosmodental appointment booking system. The API should support the full patient booking workflow, from initial appointment request to confirmation and management.

## Base Configuration

- **Base URL**: `https://api.cosmodental.com/v1`
- **Authentication**: Bearer token authentication
- **Content Type**: `application/json`
- **Response Format**: JSON

## Core Entities

### Patient
```json
{
  "id": "string (UUID)",
  "patientType": "New | Existing",
  "firstName": "string",
  "lastName": "string", 
  "middleName": "string",
  "gender": "Male | Female | Other",
  "civilStatus": "Single | Married | Divorced | Widowed",
  "dateOfBirth": "string (YYYY-MM-DD)",
  "age": "number (calculated)",
  "occupation": "string",
  "mobileNumber": "string",
  "emailAddress": "string",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Appointment
```json
{
  "id": "string (UUID)",
  "appointmentCode": "string (e.g., ABC123456789)",
  "patientId": "string (UUID)",
  "patientType": "New | Existing",
  "reason": "string",
  "selectedDate": "string (YYYY-MM-DD)",
  "selectedTime": "string (HH:MM AM/PM)",
  "status": "Pending | Confirmed | Cancelled | Completed",
  "howDidYouKnow": "Walk-in | Referred by a relative or friend | Google | Social Media | YouTube | Others",
  "notes": "string",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Medical History
```json
{
  "id": "string (UUID)",
  "patientId": "string (UUID)",
  "generalHealth": "string",
  "medicalTreatment": "string",
  "medicalCondition": "string", 
  "services": "string",
  "hospitalized": "Yes | No",
  "hospitalizedWhy": "string",
  "prescriptionMedication": "Yes | No",
  "prescriptionSpecify": "string",
  "tobacco": "Yes | No",
  "alcohol": "Yes | No",
  "allergic": "Yes | No",
  "allergicItems": {
    "localAnesthetic": "boolean",
    "penicillin": "boolean",
    "sulfa": "boolean",
    "aspirin": "boolean",
    "latex": "boolean",
    "others": "boolean"
  },
  "bleedingTime": "string",
  "forWomenOnly": {
    "pregnant": "Yes | No | N/A",
    "nursing": "Yes | No | N/A", 
    "birthControl": "Yes | No | N/A"
  },
  "bloodType": "A+ | A- | B+ | B- | AB+ | AB- | O+ | O-",
  "bloodPressure": "string",
  "followingConditions": "string[]",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

## API Endpoints

### 1. Patient Management

#### Create New Patient
```http
POST /patients
```

**Request Body:**
```json
{
  "patientType": "New",
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "gender": "Male",
  "civilStatus": "Single",
  "dateOfBirth": "1990-05-15",
  "occupation": "Engineer",
  "mobileNumber": "+1234567890",
  "emailAddress": "john.doe@email.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "patientType": "New",
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Michael",
    "gender": "Male",
    "civilStatus": "Single",
    "dateOfBirth": "1990-05-15",
    "age": 34,
    "occupation": "Engineer",
    "mobileNumber": "+1234567890",
    "emailAddress": "john.doe@email.com",
    "createdAt": "2024-10-14T10:30:00Z",
    "updatedAt": "2024-10-14T10:30:00Z"
  }
}
```

#### Get Patient by ID
```http
GET /patients/{patientId}
```

#### Update Patient
```http
PUT /patients/{patientId}
```

#### Search Existing Patients
```http
GET /patients/search?query={searchTerm}&type=existing
```

### 2. Appointment Management

#### Create Appointment
```http
POST /appointments
```

**Request Body:**
```json
{
  "patientId": "uuid-here",
  "patientType": "New",
  "reason": "Consultation",
  "selectedDate": "2024-10-15",
  "selectedTime": "10:00 AM",
  "howDidYouKnow": "Google",
  "notes": "First time visit, nervous about dental procedures"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "appointmentCode": "ABC123456789",
    "patientId": "uuid-here",
    "patientType": "New",
    "reason": "Consultation",
    "selectedDate": "2024-10-15",
    "selectedTime": "10:00 AM",
    "status": "Pending",
    "howDidYouKnow": "Google",
    "notes": "First time visit, nervous about dental procedures",
    "createdAt": "2024-10-14T10:30:00Z",
    "updatedAt": "2024-10-14T10:30:00Z"
  }
}
```

#### Get Available Time Slots
```http
GET /appointments/availability?date={YYYY-MM-DD}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2024-10-15",
    "morning": [
      { "time": "9:00 AM", "available": true },
      { "time": "9:45 AM", "available": false },
      { "time": "10:00 AM", "available": true },
      { "time": "10:45 AM", "available": true }
    ],
    "afternoon": [
      { "time": "12:00 PM", "available": true },
      { "time": "12:30 PM", "available": true },
      { "time": "01:00 PM", "available": false },
      { "time": "01:30 PM", "available": true },
      { "time": "02:00 PM", "available": true },
      { "time": "02:30 PM", "available": true },
      { "time": "03:00 PM", "available": true }
    ]
  }
}
```

#### Get Appointment by Code
```http
GET /appointments/code/{appointmentCode}
```

#### Update Appointment Status
```http
PATCH /appointments/{appointmentId}/status
```

**Request Body:**
```json
{
  "status": "Confirmed",
  "notes": "Confirmed by clinic staff"
}
```

#### Get Appointments by Date Range
```http
GET /appointments?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}&status={status}
```

### 3. Medical History Management

#### Create Medical History
```http
POST /patients/{patientId}/medical-history
```

**Request Body:**
```json
{
  "generalHealth": "Good",
  "medicalTreatment": "None currently",
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
    "pregnant": "N/A",
    "nursing": "N/A",
    "birthControl": "N/A"
  },
  "bloodType": "O+",
  "bloodPressure": "120/80",
  "followingConditions": []
}
```

#### Get Medical History
```http
GET /patients/{patientId}/medical-history
```

#### Update Medical History
```http
PUT /patients/{patientId}/medical-history/{historyId}
```

### 4. Clinic Configuration

#### Get Clinic Information
```http
GET /clinic/info
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "Cosmodental",
    "address": "123 Dental Street, City, State 12345",
    "phone": "+1234567890",
    "email": "info@cosmodental.com",
    "workingHours": {
      "monday": { "open": "09:00", "close": "17:00" },
      "tuesday": { "open": "09:00", "close": "17:00" },
      "wednesday": { "open": "09:00", "close": "17:00" },
      "thursday": { "open": "09:00", "close": "17:00" },
      "friday": { "open": "09:00", "close": "17:00" },
      "saturday": { "open": "09:00", "close": "15:00" },
      "sunday": { "closed": true }
    },
    "services": [
      "General Dentistry",
      "Cosmetic Dentistry", 
      "Orthodontics",
      "Oral Surgery",
      "Teeth Cleaning",
      "Root Canal Treatment"
    ]
  }
}
```

#### Get Available Services
```http
GET /clinic/services
```

### 5. Notification Management

#### Send Appointment Confirmation
```http
POST /notifications/appointment-confirmation
```

**Request Body:**
```json
{
  "appointmentId": "uuid-here",
  "method": "email | sms | both",
  "message": "Custom message (optional)"
}
```

#### Send Appointment Reminder
```http
POST /notifications/appointment-reminder
```

### 6. Analytics and Reporting

#### Get Appointment Statistics
```http
GET /analytics/appointments?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}
```

#### Get Patient Demographics
```http
GET /analytics/patients/demographics
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### Common Error Codes
- `PATIENT_NOT_FOUND` (404)
- `APPOINTMENT_NOT_FOUND` (404)
- `INVALID_DATE_TIME` (400)
- `TIME_SLOT_UNAVAILABLE` (409)
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `INTERNAL_SERVER_ERROR` (500)

## Authentication & Security

### Authentication Headers
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

### Data Validation Requirements
- All email addresses must be valid format
- Phone numbers must include country code
- Dates must be in YYYY-MM-DD format
- Times must be in 12-hour format (HH:MM AM/PM)
- Patient names must not contain special characters
- Medical history fields have specific validation rules

## Database Considerations

### Required Indexes
- `patients.emailAddress` (unique)
- `patients.mobileNumber` (unique)
- `appointments.appointmentCode` (unique)
- `appointments.selectedDate`
- `appointments.status`
- `appointments.patientId`

### Data Retention
- Patient data: Indefinite (with consent)
- Appointment history: 7 years
- Medical history: Indefinite (medical requirement)
- System logs: 1 year

## Integration Requirements

### External Services
- **SMS Service**: For appointment confirmations and reminders
- **Email Service**: For appointment confirmations and notifications
- **Calendar Integration**: Google Calendar, Outlook integration
- **Payment Gateway**: For future payment processing
- **Backup Service**: Automated daily backups

### Webhook Support
- Appointment status changes
- New patient registrations
- Medical history updates

## Performance Requirements

- API response time: < 200ms for 95% of requests
- Database query optimization for large patient datasets
- Caching strategy for frequently accessed data
- Support for concurrent appointment bookings

## Compliance & Privacy

### HIPAA Compliance
- Encrypted data transmission (TLS 1.3)
- Encrypted data storage
- Audit logging for all data access
- User access controls and permissions

### Data Privacy
- Patient consent management
- Right to data deletion
- Data export capabilities
- Privacy policy compliance

This API specification provides the complete backend infrastructure needed to support the Cosmodental appointment booking workflow, from initial patient registration through appointment confirmation and medical history management.