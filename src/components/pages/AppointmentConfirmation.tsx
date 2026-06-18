import React, { useState, useEffect, useRef } from 'react';
import Header from '../common/Header';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';
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
  onBack: () => void;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ bookingData, onNext, onBack }) => {
  const { settings } = useWebsiteSettings();
  const clinicName = settings?.clinic_name || 'Cosmodental';

  // Polyfill-safe left-pad for 2-digit numbers
  const pad2 = (s: string): string => (s.length < 2 ? '0' + s : s);

  // Polyfill-safe Array.includes replacement
  const inList = (arr: string[], val: string): boolean => arr.indexOf(val) !== -1;
  const [loading, setLoading] = useState(true);
  const [appointmentCode, setAppointmentCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({} as Record<string, string[]>);
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
    
    // Check if it successfully matches the format XXX/XX or XX/XX
    if (/^\d{2,3}\/\d{1,2}$/.test(trimmed)) {
      // Normalize to XXX/XX format
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const systolic = parts[0].trim();
        const diastolic = pad2(parts[1].trim());
        // Keep systolic as is (2-3 digits is fine), ensure diastolic is 2 digits
        return `${systolic}/${diastolic}`;
      }
      return trimmed;
    }
    
    // Try to extract numbers separated by /, space, or other separators
    const numbers = trimmed.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const systolic = numbers[0];
      const diastolic = pad2(numbers[1]);
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
        const todayFormatted = `${todayYear}-${pad2(String(todayMonth + 1))}-${pad2(String(todayDay))}`;
        throw new Error(`Selected date (${formattedDate}) must be today or a future date. Today is ${todayFormatted}`);
      }
      
      const formattedTime = formatTimeForAPI(bookingData.selectedTime);

      // Format date of birth to Y-m-d format (YYYY-MM-DD) if provided
      let formattedDateOfBirth: string | undefined = undefined;
      if (bookingData.dateOfBirth) {
        try {
          formattedDateOfBirth = formatDateForAPI(bookingData.dateOfBirth);
        } catch (error) {
          console.error('Error formatting date of birth:', error);
          // If formatting fails, leave it undefined
          formattedDateOfBirth = undefined;
        }
      }

      return {
        patient: {
          patientType: (bookingData.patientType === 'New' || bookingData.patientType === 'Existing') 
            ? bookingData.patientType 
            : 'New',
          firstName: bookingData.firstName.trim(),
          lastName: bookingData.lastName.trim(),
          middleName: bookingData.middleName?.trim() || undefined,
          gender: (inList(['Male', 'Female', 'Other', 'Prefer not to say'], bookingData.gender))
            ? bookingData.gender as 'Male' | 'Female' | 'Other' | 'Prefer not to say'
            : 'Prefer not to say',
          civilStatus: (inList(['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], bookingData.civilStatus))
            ? bookingData.civilStatus as 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated'
            : 'Single',
          dateOfBirth: formattedDateOfBirth,
          occupation: bookingData.occupation?.trim() || undefined,
          mobileNumber: formatMobileNumber(bookingData.mobileNumber.trim()),
          emailAddress: bookingData.emailAddress.trim(),
        },
        appointment: {
          reason: bookingData.reason.trim(),
          selectedDate: formattedDate,
          selectedTime: formattedTime,
          howDidYouKnow: (inList(['Walk-in', 'Referred by a relative or friend', 'Google', 'Social Media', 'YouTube', 'Others'], bookingData.howDidYouKnow))
            ? bookingData.howDidYouKnow as 'Walk-in' | 'Referred by a relative or friend' | 'Google' | 'Social Media' | 'YouTube' | 'Others'
            : 'Others',
          notes: bookingData.notes?.trim() || undefined,
        },
        medicalHistory: {
          generalHealth: bookingData.medicalHistory.generalHealth?.trim() || undefined,
          medicalTreatment: bookingData.medicalHistory.medicalTreatment?.trim() || undefined,
          medicalCondition: bookingData.medicalHistory.medicalCondition?.trim() || undefined,
          services: bookingData.medicalHistory.services?.trim() || undefined,
          hospitalized: (inList(['Yes', 'No', ''], bookingData.medicalHistory.hospitalized))
            ? bookingData.medicalHistory.hospitalized as 'Yes' | 'No' | ''
            : undefined,
          hospitalizedWhy: bookingData.medicalHistory.hospitalizedWhy?.trim() || undefined,
          prescriptionMedication: (inList(['Yes', 'No', ''], bookingData.medicalHistory.prescriptionMedication))
            ? bookingData.medicalHistory.prescriptionMedication as 'Yes' | 'No' | ''
            : undefined,
          prescriptionSpecify: bookingData.medicalHistory.prescriptionSpecify?.trim() || undefined,
          tobacco: (inList(['Yes', 'No', ''], bookingData.medicalHistory.tobacco))
            ? bookingData.medicalHistory.tobacco as 'Yes' | 'No' | ''
            : undefined,
          alcohol: (inList(['Yes', 'No', ''], bookingData.medicalHistory.alcohol))
            ? bookingData.medicalHistory.alcohol as 'Yes' | 'No' | ''
            : undefined,
          allergic: (inList(['Yes', 'No', ''], bookingData.medicalHistory.allergic))
            ? bookingData.medicalHistory.allergic as 'Yes' | 'No' | ''
            : undefined,
          allergicItems: bookingData.medicalHistory.allergicItems || undefined,
          bleedingTime: bookingData.medicalHistory.bleedingTime?.trim() || undefined,
          forWomenOnly: {
            pregnant: (inList(['Yes', 'No', 'N/A', ''], bookingData.medicalHistory.forWomenOnly.pregnant))
              ? bookingData.medicalHistory.forWomenOnly.pregnant as 'Yes' | 'No' | 'N/A' | ''
              : '',
            nursing: (inList(['Yes', 'No', 'N/A', ''], bookingData.medicalHistory.forWomenOnly.nursing))
              ? bookingData.medicalHistory.forWomenOnly.nursing as 'Yes' | 'No' | 'N/A' | ''
              : '',
            birthControl: (inList(['Yes', 'No', 'N/A', ''], bookingData.medicalHistory.forWomenOnly.birthControl))
              ? bookingData.medicalHistory.forWomenOnly.birthControl as 'Yes' | 'No' | 'N/A' | ''
              : '',
          },
          bloodType: (inList(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''], bookingData.medicalHistory.bloodType))
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
            setLoading(false);
          } else {
            // Success flag is true but missing required data
            console.error('Success response missing appointment data:', response);
            setError('Appointment submission succeeded but response data is incomplete');
            setLoading(false);
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
          setLoading(false);
        } else {
          // Unexpected response structure
          console.error('Unexpected response structure:', response);
          setError('Received an unexpected response from the server');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error submitting appointment:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Loading state - show spinner while submitting
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div
              className="w-16 h-16 rounded-full border-4 border-gray-200 animate-spin"
              style={{ borderTopColor: 'var(--primary-color, #6b7280)' }}
            />
            <div className="text-center">
              <p
                className="text-[18px] font-semibold text-[#242424] mb-1"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Submitting your appointment...
              </p>
              <p
                className="text-[14px] text-[#6b7280]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Please wait while we process your request.
              </p>
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
        <Header />
        <div className="w-full bg-white">
          <div className="w-full bg-white flex flex-col items-center justify-center p-4 lg:p-8 min-h-screen">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-8">{clinicName}</h2>
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
                        {(Object.keys(validationErrors) as string[]).map((field: string) => {
                          const errs: string[] = validationErrors[field];
                          if (Array.isArray(errs)) {
                            return errs.map((err: string, idx: number) => (
                              <li key={`${field}-${idx}`}>{err}</li>
                            ));
                          }
                          return (
                            <li key={field}>
                              <strong>{field}:</strong> {String(errs)}
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
                      onBack();
                    }}
                    className="px-6 py-2 bg-cosmo-green text-white rounded-md text-sm font-semibold hover:opacity-90 transition-colors"
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
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <div className="flex-1 w-full bg-white flex flex-col items-center justify-center px-4 py-[50px]">
        <div className="relative w-full max-w-[880px] bg-white border border-[#d0d5dd] border-solid rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-5 sm:px-8 lg:px-12 pt-7 pb-10">
          <button
            type="button"
            onClick={onNext}
            aria-label="Close and return to start page"
            title="Close"
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#d0d5dd] bg-white text-[#667085] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:border-[#98a2b3] hover:bg-[#f9fafb] hover:text-[#242424] focus:outline-none focus:ring-2 focus:ring-cosmo-green focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Calendar icon */}
          <div className="flex justify-center mb-6">
            <svg className="block w-[54px] h-[54px] text-cosmo-green" viewBox="0 0 45.75 52.9019" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M45.75 22.875V40.6667C45.75 42.0149 45.2144 43.3078 44.2611 44.2611C43.3078 45.2144 42.0149 45.75 40.6667 45.75H5.08333C3.73515 45.75 2.44218 45.2144 1.48887 44.2611C0.535564 43.3078 0 42.0149 0 40.6667V22.875H45.75ZM33.0417 0C33.7158 0 34.3622 0.267782 34.8389 0.744437C35.3156 1.22109 35.5833 1.86757 35.5833 2.54167V5.08333H40.6667C42.0149 5.08333 43.3078 5.6189 44.2611 6.57221C45.2144 7.52552 45.75 8.81848 45.75 10.1667V17.7917H0V10.1667C0 8.81848 0.535564 7.52552 1.48887 6.57221C2.44218 5.6189 3.73515 5.08333 5.08333 5.08333H10.1667V2.54167C10.1667 1.86757 10.4344 1.22109 10.9111 0.744437C11.3878 0.267782 12.0342 0 12.7083 0C13.3824 0 14.0289 0.267782 14.5056 0.744437C14.9822 1.22109 15.25 1.86757 15.25 2.54167V5.08333H30.5V2.54167C30.5 1.86757 30.7678 1.22109 31.2444 0.744437C31.7211 0.267782 32.3676 0 33.0417 0Z"/>
            </svg>
          </div>

          {/* Greeting */}
          <p className="text-center text-[16px] sm:text-[18px] font-normal text-[#242424] leading-snug m-0 mb-8 px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hi <span className="font-semibold">{bookingData.firstName || 'Timothy'}</span>, we've successfully received your request for an appointment!
          </p>

          {/* Inner box */}
          <div className="border border-[#d0d5dd] border-solid rounded-[8px] p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1 flex flex-col gap-[6px] min-w-0">
              <p className="m-0 text-[#242424] text-[18px] sm:text-[20px] font-bold leading-[normal] tracking-[-0.4px] break-words" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {bookingData.lastName || 'Miller'}, {bookingData.firstName || 'Timothy'}
              </p>
              <p className="m-0 text-[#242424] text-[18px] sm:text-[20px] font-medium leading-[normal] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {calculateAge(bookingData.dateOfBirth) || '34'} yrs. old - {bookingData.gender || 'Male'}
              </p>
              <p className="m-0 text-[#242424] text-[18px] sm:text-[20px] font-medium leading-[normal] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {bookingData.patientType || 'New'} Patient
              </p>
              <p className="m-0 text-cosmo-green text-[16px] font-semibold leading-[normal] tracking-[-0.32px] break-words" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {bookingData.reason || 'Consultation'}
              </p>
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px self-stretch bg-[#d0d5dd]" />
            <div className="block sm:hidden h-px w-full bg-[#d0d5dd]" />

            <div className="flex-1 flex flex-col gap-[8px] min-w-0">
              <p className="m-0 text-[#242424] text-[18px] sm:text-[20px] font-bold leading-[normal] tracking-[-0.4px] break-words" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {bookingData.selectedDate || 'Today, Oct 02'}
              </p>
              <div className="flex items-center gap-2">
                <img src="/images/clock-4_new.svg" alt="" className="block w-[18px] h-[18px]" />
                <span className="text-[#242424] text-[15px] font-medium leading-[normal] tracking-[-0.3px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {bookingData.selectedTime || '12:00 PM'}
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center px-2">
            <p className="m-0 mb-3 text-[#242424] text-[15px] sm:text-[16px] font-medium leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
              Please be informed that this is NOT YET A CONFIRMED APPOINTMENT.
            </p>
            <p className="m-0 text-[#242424] text-[15px] sm:text-[16px] font-normal leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
              A clinic representative will contact you to finalize your visit schedule.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppointmentConfirmation;
