import React, { useState, useEffect, useRef } from 'react';
import Header from '../common/Header';
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
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const hasSubmittedRef = useRef(false);

  // Reset hasSubmittedRef when component mounts (for new appointments)
  useEffect(() => {
    hasSubmittedRef.current = false;
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Header />
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
        <Header />
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
                      onBack();
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
    <div className="min-h-screen bg-white font-sans flex flex-col items-center">
      <Header />
      <div className="flex-1 w-full bg-white flex flex-col items-center pt-[80px] pb-[50px]">
        <div className="w-[880px] h-[620px] bg-white border border-[#d0d5dd] border-solid rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative">
          
          <div className="absolute left-1/2 -translate-x-1/2 top-[27px] w-[61px] h-[61px] overflow-clip">
            <div className="absolute inset-[12.5%_12.5%_0.78%_12.5%]">
               <img src="/images/calendar_new.svg" alt="" className="absolute block max-w-none w-full h-full" />
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 top-[117px] text-center whitespace-nowrap">
            <p className="text-[18px] font-normal text-[#242424] leading-[normal] m-0 not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="leading-[normal]">Hi </span>
              <span className="font-semibold leading-[normal] not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>{bookingData.firstName || 'Timothy'}</span>
              <span className="leading-[normal]">, we’ve successfully</span>
            </p>
            <p className="text-[18px] font-normal text-[#242424] leading-[normal] m-0" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="leading-[normal]">received your request for an appointment</span>
              <span className="leading-[normal]">!</span>
            </p>
          </div>

          {/* Inner box */}
          <div className="absolute left-[142px] top-[211px] w-[595px] h-[248px] bg-white border border-[#d0d5dd] border-solid rounded-[8px]" />

          {/* Patient Details inside inner box (left part) */}
          <p className="absolute left-[165px] top-[229px] m-0 text-[#242424] text-[20px] font-bold leading-[normal] tracking-[-0.4px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {bookingData.lastName || 'Miller'}, {bookingData.firstName || 'Timothy'}
          </p>
          <p className="absolute left-[165px] top-[263px] m-0 text-[#242424] text-[20px] font-medium leading-[normal] tracking-[-0.4px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {calculateAge(bookingData.dateOfBirth) || '34'} yrs. old - {bookingData.gender || 'Male'}
          </p>
          <p className="absolute left-[165px] top-[297px] m-0 text-[#242424] text-[20px] font-medium leading-[normal] tracking-[-0.4px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {bookingData.patientType || 'New'} Patient
          </p>
          <p className="absolute left-[165px] top-[332px] m-0 text-cosmo-green text-[16px] font-semibold leading-[normal] tracking-[-0.32px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {bookingData.reason || 'Consultation'}
          </p>
          <p className="absolute left-[165px] top-[366px] m-0 text-[#242424] text-[20px] font-bold leading-[normal] tracking-[-0.4px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {bookingData.selectedDate || 'Today, Oct 02'}
          </p>

          <div className="absolute left-[165px] top-[402px] overflow-clip w-[18px] h-[18px]">
             <div className="absolute inset-[8.33%]">
                <div className="absolute inset-[-5%]">
                   <img src="/images/clock-4_new.svg" alt="" className="block max-w-none w-full h-full" />
                </div>
             </div>
          </div>
          <p className="absolute left-[190px] top-[401px] m-0 text-[#242424] text-[15px] font-medium leading-[normal] tracking-[-0.3px] whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
             {bookingData.selectedTime || '12:00 PM'}
          </p>

          {/* Vertical Separator line inside inner box */}
          <div className="absolute left-[471px] top-[230px] flex items-center justify-center w-0 h-[209px]">
             <div className="flex-none rotate-90">
                <div className="relative w-[209px] h-0">
                   <div className="absolute inset-[-1px_0_0_0]">
                      <img src="/images/line_1120.svg" alt="" className="block max-w-none w-full h-full" />
                   </div>
                </div>
             </div>
          </div>

          {/* Appointment code inside inner box (right part) */}
          <p className="absolute left-[608px] top-[290px] -translate-x-1/2 m-0 text-[#242424] text-[16px] font-normal leading-[normal] text-center whitespace-nowrap not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your appointment code is
          </p>
          <p className="absolute left-[611.5px] top-[328px] -translate-x-1/2 m-0 text-[#242424] text-[24px] font-bold leading-[normal] text-center whitespace-nowrap not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            {appointmentCode || 'ABC12346789'}
          </p>

          <p className="absolute left-1/2 -translate-x-1/2 top-[495px] m-0 w-[400px] h-[43px] text-center text-[#242424] text-[16px] font-medium leading-[normal] not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            Please be informed that this is NOT YET A CONFIRMED APPOINTMENT. 
          </p>
          <p className="absolute left-1/2 -translate-x-1/2 top-[545px] m-0 w-[348px] h-[42px] text-center text-[#242424] text-[16px] font-normal leading-[normal] not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
            A clinic representative will contact you to finalize your visit schedule.
          </p>

        </div>
        
        <div className="flex justify-center mt-[40px] pb-8 w-full">
          <button
            onClick={onNext}
            className="w-[256px] h-[55px] bg-cosmo-green text-[16px] text-white font-semibold rounded-[8px] tracking-[-0.32px] hover:opacity-90 transition-colors flex items-center justify-center cursor-pointer border-none"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;

