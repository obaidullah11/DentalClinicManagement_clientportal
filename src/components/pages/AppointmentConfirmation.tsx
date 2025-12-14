import React, { useState, useEffect, useRef } from 'react';
import { BookingData } from '../../types/BookingTypes';
import { 
  submitAppointment, 
  formatDateForAPI, 
  formatTimeForAPI,
  SubmitAppointmentRequest 
} from '../../services/api';

interface AppointmentConfirmationProps {
  bookingData: BookingData;
  onNext: () => void;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ bookingData, onNext }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const hasSubmittedRef = useRef(false);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format mobile number to API format: +[country code][number]
  // Expected format: +639171234567 (+63 followed by exactly 10 digits)
  const formatMobileNumber = (mobileNumber: string): string => {
    if (!mobileNumber) return '';
    
    // Extract all digits (removes everything except digits)
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    
    if (!digitsOnly || digitsOnly.length === 0) {
      return mobileNumber; // Return original if no digits found
    }
    
    // Remove leading zeros
    let normalized = digitsOnly.replace(/^0+/, '');
    
    // If it starts with 63 (Philippines country code)
    if (normalized.startsWith('63')) {
      const numberPart = normalized.substring(2);
      // If we have exactly 10 digits after country code, format correctly
      if (numberPart.length === 10) {
        return '+63' + numberPart;
      }
      // If more than 10, take only first 10
      if (numberPart.length > 10) {
        return '+63' + numberPart.substring(0, 10);
      }
      // If less than 10, return as is (will fail validation but at least formatted)
      return '+63' + numberPart;
    }
    
    // If it's exactly 10 digits (Philippines local format: 09171234567 -> 9171234567)
    if (normalized.length === 10) {
      return '+63' + normalized;
    }
    
    // If it's 9 digits, add +63 (might be missing leading digit)
    if (normalized.length === 9) {
      return '+63' + normalized;
    }
    
    // If it's 11-13 digits total, might have country code embedded
    if (normalized.length >= 11 && normalized.length <= 13) {
      // Try to extract: if it starts with 63, use it
      if (normalized.startsWith('63')) {
        const numberPart = normalized.substring(2);
        if (numberPart.length >= 10) {
          return '+63' + numberPart.substring(0, 10);
        }
        return '+63' + numberPart;
      }
      // Otherwise, assume first 2-3 digits are country code, take last 10
      if (normalized.length >= 12) {
        return '+63' + normalized.substring(normalized.length - 10);
      }
    }
    
    // For any other case, assume Philippines and add +63
    // Take last 10 digits if longer, or use all if shorter
    if (normalized.length > 10) {
      return '+63' + normalized.substring(normalized.length - 10);
    }
    return '+63' + normalized;
  };

  // Format blood pressure to API format: XXX/XX
  const formatBloodPressure = (bloodPressure: string | undefined): string | undefined => {
    if (!bloodPressure) return undefined;
    
    const trimmed = bloodPressure.trim();
    if (!trimmed) return undefined;
    
    // Check if it already matches the format XXX/XX or XX/XX
    if (/^\d{2,3}\/\d{1,2}$/.test(trimmed)) {
      // Normalize to XXX/XX format
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const systolic = parts[0].trim();
        const diastolic = parts[1].trim().padStart(2, '0');
        // Keep systolic as is (2-3 digits is fine), ensure diastolic is 2 digits
        return `${systolic}/${diastolic}`;
      }
      return trimmed;
    }
    
    // Try to extract numbers separated by /, space, or other separators
    const numbers = trimmed.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const systolic = numbers[0];
      const diastolic = numbers[1].padStart(2, '0');
      return `${systolic}/${diastolic}`;
    }
    
    // If it doesn't match the format, return undefined (invalid format)
    return undefined;
  };

  // Transform BookingData to API format
  const transformBookingDataToAPI = (): SubmitAppointmentRequest => {
    try {
      const formattedDate = formatDateForAPI(bookingData.selectedDate);
      
      // Validate that the date is >= today (using local date components to avoid timezone issues)
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      
      const [selectedYear, selectedMonth, selectedDay] = formattedDate.split('-').map(Number);
      const selectedDateObj = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const todayDateObj = new Date(todayYear, todayMonth, todayDay);
      
      if (selectedDateObj < todayDateObj) {
        const todayFormatted = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;
        throw new Error(`Selected date (${formattedDate}) must be today or a future date. Today is ${todayFormatted}`);
      }
      
      const formattedTime = formatTimeForAPI(bookingData.selectedTime);

      return {
        patient: {
          patientType: (bookingData.patientType === 'New' || bookingData.patientType === 'Existing') 
            ? bookingData.patientType 
            : 'New',
          firstName: bookingData.firstName.trim(),
          lastName: bookingData.lastName.trim(),
          middleName: bookingData.middleName?.trim() || undefined,
          gender: (['Male', 'Female', 'Other', 'Prefer not to say'].includes(bookingData.gender))
            ? bookingData.gender as 'Male' | 'Female' | 'Other' | 'Prefer not to say'
            : 'Prefer not to say',
          civilStatus: (['Single', 'Married', 'Divorced', 'Widowed', 'Separated'].includes(bookingData.civilStatus))
            ? bookingData.civilStatus as 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated'
            : 'Single',
          dateOfBirth: bookingData.dateOfBirth || '',
          occupation: bookingData.occupation?.trim() || undefined,
          mobileNumber: formatMobileNumber(bookingData.mobileNumber.trim()),
          emailAddress: bookingData.emailAddress.trim(),
        },
        appointment: {
          reason: bookingData.reason.trim(),
          selectedDate: formattedDate,
          selectedTime: formattedTime,
          howDidYouKnow: (['Walk-in', 'Referred by a relative or friend', 'Google', 'Social Media', 'YouTube', 'Others'].includes(bookingData.howDidYouKnow))
            ? bookingData.howDidYouKnow as 'Walk-in' | 'Referred by a relative or friend' | 'Google' | 'Social Media' | 'YouTube' | 'Others'
            : 'Others',
          notes: bookingData.notes?.trim() || undefined,
        },
        medicalHistory: {
          generalHealth: bookingData.medicalHistory.generalHealth?.trim() || undefined,
          medicalTreatment: bookingData.medicalHistory.medicalTreatment?.trim() || undefined,
          medicalCondition: bookingData.medicalHistory.medicalCondition?.trim() || undefined,
          services: bookingData.medicalHistory.services?.trim() || undefined,
          hospitalized: (['Yes', 'No', ''].includes(bookingData.medicalHistory.hospitalized))
            ? bookingData.medicalHistory.hospitalized as 'Yes' | 'No' | ''
            : undefined,
          hospitalizedWhy: bookingData.medicalHistory.hospitalizedWhy?.trim() || undefined,
          prescriptionMedication: (['Yes', 'No', ''].includes(bookingData.medicalHistory.prescriptionMedication))
            ? bookingData.medicalHistory.prescriptionMedication as 'Yes' | 'No' | ''
            : undefined,
          prescriptionSpecify: bookingData.medicalHistory.prescriptionSpecify?.trim() || undefined,
          tobacco: (['Yes', 'No', ''].includes(bookingData.medicalHistory.tobacco))
            ? bookingData.medicalHistory.tobacco as 'Yes' | 'No' | ''
            : undefined,
          alcohol: (['Yes', 'No', ''].includes(bookingData.medicalHistory.alcohol))
            ? bookingData.medicalHistory.alcohol as 'Yes' | 'No' | ''
            : undefined,
          allergic: (['Yes', 'No', ''].includes(bookingData.medicalHistory.allergic))
            ? bookingData.medicalHistory.allergic as 'Yes' | 'No' | ''
            : undefined,
          allergicItems: bookingData.medicalHistory.allergicItems || undefined,
          bleedingTime: bookingData.medicalHistory.bleedingTime?.trim() || undefined,
          forWomenOnly: {
            pregnant: (['Yes', 'No', 'N/A', ''].includes(bookingData.medicalHistory.forWomenOnly.pregnant))
              ? bookingData.medicalHistory.forWomenOnly.pregnant as 'Yes' | 'No' | 'N/A' | ''
              : '',
            nursing: (['Yes', 'No', 'N/A', ''].includes(bookingData.medicalHistory.forWomenOnly.nursing))
              ? bookingData.medicalHistory.forWomenOnly.nursing as 'Yes' | 'No' | 'N/A' | ''
              : '',
            birthControl: (['Yes', 'No', 'N/A', ''].includes(bookingData.medicalHistory.forWomenOnly.birthControl))
              ? bookingData.medicalHistory.forWomenOnly.birthControl as 'Yes' | 'No' | 'N/A' | ''
              : '',
          },
          bloodType: (['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''].includes(bookingData.medicalHistory.bloodType))
            ? bookingData.medicalHistory.bloodType as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown' | ''
            : undefined,
          bloodPressure: formatBloodPressure(bookingData.medicalHistory.bloodPressure),
          followingConditions: bookingData.medicalHistory.followingConditions || undefined,
        },
      };
    } catch (err) {
      throw new Error(`Error transforming data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Validate conditional fields before submission
  const validateConditionalFields = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check if prescriptionMedication is Yes but prescriptionSpecify is empty
    if (bookingData.medicalHistory.prescriptionMedication === 'Yes') {
      const specify = bookingData.medicalHistory.prescriptionSpecify?.trim();
      if (!specify) {
        errors.push('Please specify the prescription/non-prescription medication you are taking');
      }
    }
    
    // Check if hospitalized is Yes but hospitalizedWhy is empty
    if (bookingData.medicalHistory.hospitalized === 'Yes') {
      const why = bookingData.medicalHistory.hospitalizedWhy?.trim();
      if (!why) {
        errors.push('Please specify when and why you were hospitalized');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Submit appointment on component mount
  useEffect(() => {
    // Prevent double submission (React StrictMode runs effects twice in development)
    if (hasSubmittedRef.current) {
      return;
    }
    hasSubmittedRef.current = true;

    let isMounted = true;
    const abortController = new AbortController();

    const submitAppointmentRequest = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        setValidationErrors({});

        // Validate conditional fields first
        const validation = validateConditionalFields();
        if (!validation.isValid) {
          setError('Please complete all required fields');
          setValidationErrors({
            'conditional': validation.errors
          });
          setLoading(false);
          return;
        }

        const apiRequest = transformBookingDataToAPI();
        console.log('Submitting appointment request:', apiRequest);
        
        const response = await submitAppointment(apiRequest);
        console.log('Received response:', response);

        if (!isMounted) {
          setLoading(false);
          return;
        }

        if (response && response.success === true) {
          // Success response
          if (response.data && response.data.appointment && response.data.appointment.appointmentCode) {
            setAppointmentCode(response.data.appointment.appointmentCode);
          } else {
            // Success flag is true but missing required data
            console.error('Success response missing appointment data:', response);
            setError('Appointment submission succeeded but response data is incomplete');
          }
        } else if (response && response.success === false) {
          // Error response
          setError(response.message || 'An error occurred');
          if (response.errors) {
            setValidationErrors(response.errors);
          }
          // If time slot unavailable, show suggested times
          if (response.error?.code === 'TIME_SLOT_UNAVAILABLE') {
            const suggestedTimes = response.error.suggestedTimes?.join(', ') || '';
            setError(`${response.message}. Suggested times: ${suggestedTimes}`);
          }
        } else {
          // Unexpected response structure
          console.error('Unexpected response structure:', response);
          setError('Received an unexpected response from the server');
        }
      } catch (err) {
        console.error('Error submitting appointment:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        // Always stop loading, regardless of success or error
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    submitAppointmentRequest();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []); // Only run once on mount

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="w-full bg-white">
          <div className="w-full bg-white flex flex-col items-center justify-center p-4 lg:p-8 min-h-screen">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-8">Cosmodental</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cosmo-green rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-white rounded"></div>
                  </div>
                  <p className="text-sm text-gray-600">Submitting your appointment request...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="w-full bg-white">
          <div className="w-full bg-white flex flex-col items-center justify-center p-4 lg:p-8 min-h-screen">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-8">Cosmodental</h2>
              </div>
              <div className="bg-white border border-red-200 rounded-lg p-6 lg:p-8 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-2">Submission Failed</h3>
                  <p className="text-sm text-red-600 mb-4">{error}</p>
                  
                  {Object.keys(validationErrors).length > 0 && (
                    <div className="text-left bg-red-50 rounded p-4 mb-4">
                      <p className="text-xs font-semibold text-red-800 mb-2">Validation Errors:</p>
                      <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                        {Object.entries(validationErrors).map(([field, errors]) => {
                          if (Array.isArray(errors)) {
                            return errors.map((error, idx) => (
                              <li key={`${field}-${idx}`}>{error}</li>
                            ));
                          }
                          return (
                            <li key={field}>
                              <strong>{field}:</strong> {String(errors)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      hasSubmittedRef.current = false;
                      window.location.reload();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      hasSubmittedRef.current = false;
                      onNext();
                    }}
                    className="px-6 py-2 bg-cosmo-green text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Go Back to Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-full bg-white">
        <div className="w-full bg-white flex flex-col items-center justify-center p-4 lg:p-8 min-h-screen">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-8">Cosmodental</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cosmo-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-2">
                  Hi {bookingData.firstName}, we've already
                </h3>
                <p className="text-sm text-gray-600">received your request for an appointment!</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {bookingData.lastName}, {bookingData.firstName}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {calculateAge(bookingData.dateOfBirth)} yrs. old • {bookingData.gender}
                  </p>
                  <p className="text-xs text-gray-600">{bookingData.patientType} Patient</p>
                </div>

                <div>
                  <span className="inline-block bg-cosmo-green text-white text-xs px-2 py-1 rounded">
                    {bookingData.reason}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-800">{bookingData.selectedDate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">{bookingData.selectedTime}</span>
                  </div>
                </div>
              </div>

              {appointmentCode && (
                <div className="text-right mb-6">
                  <p className="text-xs text-gray-600 mb-1">Your appointment code is</p>
                  <p className="text-lg font-bold text-gray-800">{appointmentCode}</p>
                </div>
              )}

              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>Please be informed that this is NOT YET A</p>
                <p className="font-medium">CONFIRMED APPOINTMENT</p>
                <p className="mt-2">A clinic representative will contact you to</p>
                <p>finalize your visit schedule.</p>
              </div>
            </div>

            <div className="flex justify-center mt-8 pb-8">
              <button
                onClick={onNext}
                className="w-full lg:w-auto bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;