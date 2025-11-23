/**
 * API Service for Public Appointment Endpoints
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error?: {
    code: string;
    message: string;
    suggestedTimes?: string[];
    existingPatientId?: number;
    suggestion?: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiError;

// Patient Types
export interface PatientData {
  patientType: 'New' | 'Existing';
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  civilStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  dateOfBirth: string; // YYYY-MM-DD
  occupation?: string;
  mobileNumber: string;
  emailAddress: string;
}

// Appointment Types
export interface AppointmentData {
  reason: string;
  selectedDate: string; // YYYY-MM-DD
  selectedTime: string; // HH:MM AM/PM
  howDidYouKnow: 'Walk-in' | 'Referred by a relative or friend' | 'Google' | 'Social Media' | 'YouTube' | 'Others';
  notes?: string;
}

// Medical History Types
export interface AllergicItems {
  localAnesthetic: boolean;
  penicillin: boolean;
  sulfa: boolean;
  aspirin: boolean;
  latex: boolean;
  others: boolean;
}

export interface ForWomenOnly {
  pregnant: 'Yes' | 'No' | 'N/A' | '';
  nursing: 'Yes' | 'No' | 'N/A' | '';
  birthControl: 'Yes' | 'No' | 'N/A' | '';
}

export interface MedicalHistoryData {
  generalHealth?: string;
  medicalTreatment?: string;
  medicalCondition?: string;
  services?: string;
  hospitalized?: 'Yes' | 'No' | '';
  hospitalizedWhy?: string;
  prescriptionMedication?: 'Yes' | 'No' | '';
  prescriptionSpecify?: string;
  tobacco?: 'Yes' | 'No' | '';
  alcohol?: 'Yes' | 'No' | '';
  allergic?: 'Yes' | 'No' | '';
  allergicItems?: AllergicItems;
  bleedingTime?: string;
  forWomenOnly?: ForWomenOnly;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown' | '';
  bloodPressure?: string;
  followingConditions?: string[];
}

// Submit Appointment Request Types
export interface SubmitAppointmentRequest {
  patient: PatientData;
  appointment: AppointmentData;
  medicalHistory: MedicalHistoryData;
}

export interface AppointmentResponse {
  id: number;
  appointmentCode: string;
  status: string;
  selectedDate: string;
  selectedTime: string;
  reason: string;
  notes?: string;
  howDidYouKnow: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientResponse {
  id: number;
  patientType: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  emailAddress: string;
  mobileNumber: string;
  createdAt: string;
}

export interface MedicalHistoryResponse {
  id: number;
  patientId: number;
  createdAt: string;
}

export interface SubmitAppointmentResponse {
  appointment: AppointmentResponse;
  patient: PatientResponse;
  medicalHistory: MedicalHistoryResponse;
}

// Availability Types
export interface AvailabilityResponse {
  date: string;
  available: boolean;
  time?: string;
  alternativeTimes?: string[];
}

// Check Patient Types
export interface CheckPatientRequest {
  emailAddress?: string;
  mobileNumber?: string;
}

export interface CheckPatientResponse {
  exists: boolean;
  patientId?: number;
  patient?: PatientResponse;
}

// Get Appointment by Code Types
export interface GetAppointmentResponse {
  appointment: AppointmentResponse;
  patient: PatientResponse;
  status: string;
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        errors: data.errors,
        error: data.error,
      } as ApiError;
    }

    return data as ApiSuccessResponse<T>;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error 
        ? `Network error: ${error.message}` 
        : 'An unexpected error occurred',
    } as ApiError;
  }
}

/**
 * Submit Appointment Request
 * POST /api/public/appointments/submit
 */
export async function submitAppointment(
  request: SubmitAppointmentRequest
): Promise<ApiResponse<SubmitAppointmentResponse>> {
  return apiRequest<SubmitAppointmentResponse>('/public/appointments/submit', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Check Time Slot Availability
 * GET /api/public/appointments/availability
 */
export async function checkAvailability(
  date: string,
  time?: string
): Promise<ApiResponse<AvailabilityResponse>> {
  const params = new URLSearchParams({ date });
  if (time) {
    params.append('time', time);
  }
  
  return apiRequest<AvailabilityResponse>(
    `/public/appointments/availability?${params.toString()}`
  );
}

/**
 * Get Appointment by Code
 * GET /api/public/appointments/code/{appointmentCode}
 */
export async function getAppointmentByCode(
  appointmentCode: string
): Promise<ApiResponse<GetAppointmentResponse>> {
  return apiRequest<GetAppointmentResponse>(
    `/public/appointments/code/${encodeURIComponent(appointmentCode)}`
  );
}

/**
 * Check Existing Patient
 * POST /api/public/patients/check
 */
export async function checkExistingPatient(
  request: CheckPatientRequest
): Promise<ApiResponse<CheckPatientResponse>> {
  return apiRequest<CheckPatientResponse>('/public/patients/check', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Format date from various formats to YYYY-MM-DD
 * Uses local timezone to avoid UTC conversion issues
 */
export function formatDateForAPI(date: string | Date): string {
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else {
    // Handle "Today, October 2" format or similar
    if (date.toLowerCase().includes('today')) {
      dateObj = new Date();
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Already in YYYY-MM-DD format, parse it using local timezone
      const [year, month, day] = date.split('-').map(Number);
      dateObj = new Date(year, month - 1, day);
    } else {
      // Try to parse date strings like "October 2, 2025" or "October 2, 2025"
      // Parse manually to avoid timezone issues
      const dateMatch = date.match(/(\w+)\s+(\d+),?\s+(\d{4})/);
      if (dateMatch) {
        const [, monthName, day, year] = dateMatch;
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                           'july', 'august', 'september', 'october', 'november', 'december'];
        const monthIndex = monthNames.findIndex(m => m.startsWith(monthName.toLowerCase()));
        if (monthIndex !== -1) {
          dateObj = new Date(parseInt(year), monthIndex, parseInt(day));
        } else {
          // Fallback to standard parsing
          dateObj = new Date(date);
        }
      } else {
        // Try standard parsing
        dateObj = new Date(date);
      }
      
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
      }
    }
  }
  
  // Format using local timezone to avoid UTC conversion issues
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:MM AM/PM format
 */
export function formatTimeForAPI(time: string): string {
  // If already in correct format, return as is
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) {
    return time;
  }
  
  // Handle 24-hour format
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  return time;
}

