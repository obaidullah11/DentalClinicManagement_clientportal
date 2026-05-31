import React, { useState, useEffect } from 'react';
import { BookingData, MedicalHistory } from './types/BookingTypes';
import { WebsiteSettingsProvider, useWebsiteSettings } from './contexts/WebsiteSettingsContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import HomePage from './components/pages/HomePage';
import PatientTypeSelection from './components/pages/PatientTypeSelection';
import DateTimeSelection from './components/pages/DateTimeSelection';
import PatientDetailsForm from './components/pages/PatientDetailsForm_new';
import MedicalHistoryComponent from './components/pages/MedicalHistory';
import BookingConfirmation from './components/pages/BookingConfirmation';
import AppointmentConfirmation from './components/pages/AppointmentConfirmation';
import TermsAndConditions from './components/pages/TermsAndConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import BookingDisabled from './components/pages/BookingDisabled';

// Inner component that uses contexts
const AppContent: React.FC = () => {
  const { settings, loading } = useWebsiteSettings();
  const { showToast } = useToast();
  
  // Get current step from localStorage or default to 0
  const getCurrentStepFromStorage = (): number => {
    try {
      const saved = localStorage.getItem('bookingCurrentStep');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0; // Fallback to default if localStorage fails
    }
  };

  const [currentStep, setCurrentStep] = useState(getCurrentStepFromStorage());
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingKey, setBookingKey] = useState(0);

  // Check if a step is hidden
  const isStepHidden = (step: number): boolean => {
    if (step === 2 && bookingData.patientType === 'Existing') return true;
    return settings?.hidden_steps?.includes(step) || false;
  };

  // Handle step access with toast error
  const handleStepAccess = (targetStep: number): boolean => {
    if (isStepHidden(targetStep)) {
      showToast('This step is not available', 'error');
      return false;
    }
    return true;
  };

  // Get next available step
  const getNextAvailableStep = (fromStep: number): number => {
    let nextStep = fromStep + 1;
    while (nextStep <= 8 && isStepHidden(nextStep)) {
      nextStep++;
    }
    return nextStep > 8 ? 8 : nextStep;
  };

  // Get previous available step
  const getPreviousAvailableStep = (fromStep: number): number => {
    let prevStep = fromStep - 1;
    while (prevStep >= 0 && isStepHidden(prevStep)) {
      prevStep--;
    }
    return prevStep < 0 ? 0 : prevStep;
  };

  // Save currentStep to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('bookingCurrentStep', currentStep.toString());
    } catch (error) {
      console.warn('Failed to save currentStep to localStorage:', error);
    }
  }, [currentStep]);

  // Auto-skip hidden steps
  useEffect(() => {
    if (isStepHidden(currentStep)) {
      const nextAvailable = getNextAvailableStep(currentStep);
      if (nextAvailable !== currentStep) {
        setCurrentStep(nextAvailable);
      }
    }
  }, [currentStep, settings, isStepHidden, getNextAvailableStep]);
  
  // Get current date for default selectedDate
  const today = new Date();
  const defaultSelectedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Initialize booking data
  const [bookingData, setBookingData] = useState<BookingData>({
    // Patient Type Selection
    patientType: '',
    
    // Date & Time Selection
    selectedDate: defaultSelectedDate,
    selectedTime: '',
    
    // Patient Details
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    civilStatus: '',
    dateOfBirth: '',
    occupation: '',
    mobileNumber: '',
    emailAddress: '',
    
    // Medical History
    medicalHistory: {
      // Yes/No Questions (1-7)
      generalHealth: '',
      medicalTreatment: '',
      services: '',
      hospitalized: '',
      hospitalizedWhy: '',
      prescriptionMedication: '',
      prescriptionSpecify: '',
      tobacco: '',
      alcohol: '',
      
      // Allergies (Question 8)
      allergicItems: {
        localAnesthetic: false,
        penicillin: false,
        sulfa: false,
        aspirin: false,
        latex: false,
        others: false
      },
      
      // Bleeding Time (Question 9)
      bleedingTime: '',

      // For Women Only (Question 10)
      forWomenOnly: {
        pregnant: '',
        nursing: '',
        birthControl: ''
      },

      // Other Questions (11-12)
      bloodPressure: '',
      medicalCondition: '',
      allergic: '',
      bloodType: '',

      // Medical Conditions (Question 13)
      followingConditions: []
    },

    // Additional Info
    howDidYouKnow: '',
    notes: '',
    reason: ''
  });

  // Check if online booking is disabled
  const isBookingDisabled = settings?.allow_online_booking === false;
  
  // Show BookingDisabled page if online booking is disabled
  if (!loading && isBookingDisabled) {
    return <BookingDisabled />;
  }

  // Update functions for booking data
  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMedicalHistory = (field: keyof MedicalHistory, value: any) => {
    setBookingData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value
      }
    }));
  };

  // Handle appointment completion - reset all data and return to home
  const handleAppointmentCompletion = () => {
    resetBookingData();
    setCurrentStep(0);
  };

  // Reset booking data when starting a new appointment
  const resetBookingData = () => {
    setBookingKey(k => k + 1);
    // Clear localStorage
    try {
      localStorage.removeItem('bookingData');
      localStorage.removeItem('bookingCurrentStep');
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
    
    // Get current date for default selectedDate
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const defaultDate = `Today, ${months[today.getMonth()]} ${today.getDate()}`;
    
    setBookingData({
      patientType: '',
      reason: '',
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      civilStatus: '',
      dateOfBirth: '',
      occupation: '',
      mobileNumber: '',
      emailAddress: '',
      selectedDate: defaultDate,
      selectedTime: '',
      howDidYouKnow: '',
      notes: '',
      medicalHistory: {
        generalHealth: '',
        medicalTreatment: '',
        medicalCondition: '',
        services: '',
        hospitalized: '',
        hospitalizedWhy: '',
        prescriptionMedication: '',
        prescriptionSpecify: '',
        tobacco: '',
        alcohol: '',
        allergic: '',
        allergicItems: {
          localAnesthetic: false,
          penicillin: false,
          sulfa: false,
          aspirin: false,
          latex: false,
          others: false
        },
        bleedingTime: '',
        forWomenOnly: {
          pregnant: '',
          nursing: '',
          birthControl: ''
        },
        bloodType: '',
        bloodPressure: '',
        followingConditions: []
      }
    });
  };

  // Render the appropriate component based on current step
  return (
    <div>
      {(() => {
        // Skip hidden steps
        if (isStepHidden(currentStep)) {
          return null;
        }

        switch (currentStep) {
          case 0:
            return <HomePage onStartBooking={() => {
              resetBookingData();
              const nextStep = getNextAvailableStep(0);
              setCurrentStep(nextStep);
            }} />;

          case 1:
            return (
              <PatientTypeSelection
                key={bookingKey}
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={() => {
                  const nextStep = getNextAvailableStep(1);
                  setCurrentStep(nextStep);
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(1);
                  setCurrentStep(prevStep);
                }}
              />
            );

          case 2:
            return (
              <BookingConfirmation
                key={bookingKey}
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={() => {
                  const nextStep = getNextAvailableStep(2);
                  setCurrentStep(nextStep);
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(2);
                  setCurrentStep(prevStep);
                }}
              />
            );

          case 3:
            return (
              <DateTimeSelection
                key={bookingKey}
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                onNext={() => {
                  const nextStep = getNextAvailableStep(3);
                  setCurrentStep(nextStep);
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(3);
                  setCurrentStep(prevStep);
                }}
                onChangePatientType={() => {
                  const step1 = getPreviousAvailableStep(3);
                  setCurrentStep(step1);
                }}
              />
            );

          case 4:
            return (
              <PatientDetailsForm
                key={bookingKey}
                bookingData={bookingData}
                updateBookingData={updateBookingData}
                onNext={() => {
                  const nextStep = getNextAvailableStep(4);
                  setCurrentStep(nextStep);
                }}
                onChangePatientType={() => {
                  const step1 = getPreviousAvailableStep(4);
                  setCurrentStep(step1);
                }}
                onChangeDateTime={() => {
                  const step3 = getPreviousAvailableStep(4);
                  setCurrentStep(step3);
                }}
              />
            );

          case 5:
            return (
              <MedicalHistoryComponent
                key={bookingKey}
                bookingData={bookingData}
                updateMedicalHistory={updateMedicalHistory}
                onNext={() => {
                  const nextStep = getNextAvailableStep(5);
                  setCurrentStep(nextStep);
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(5);
                  setCurrentStep(prevStep);
                }}
              />
            );

          case 6:
            return (
              <AppointmentConfirmation
                bookingData={bookingData}
                onNext={() => handleAppointmentCompletion()}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(6);
                  setCurrentStep(prevStep);
                }}
              />
            );

          case 7:
            return (
              <TermsAndConditions
                onNext={() => {
                  const nextStep = getNextAvailableStep(7);
                  setCurrentStep(nextStep);
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(7);
                  setCurrentStep(prevStep);
                }}
              />
            );

          case 8:
            return (
              <PrivacyPolicy
                onNext={() => {
                  handleAppointmentCompletion();
                }}
                onBack={() => {
                  const prevStep = getPreviousAvailableStep(8);
                  setCurrentStep(prevStep);
                }}
              />
            );

          default:
            return <HomePage onStartBooking={() => {
              handleAppointmentCompletion();
              const nextStep = getNextAvailableStep(0);
              setCurrentStep(nextStep);
            }} />;
        }
      })()}
    </div>
  );
};

// Main App component that wraps everything with providers
const App: React.FC = () => {
  return (
    <ToastProvider>
      <WebsiteSettingsProvider>
        <AppContent />
      </WebsiteSettingsProvider>
    </ToastProvider>
  );
};

export default App;