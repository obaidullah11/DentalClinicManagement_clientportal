import React, { useState } from 'react';
import { BookingData, MedicalHistory } from './types/BookingTypes';
import HomePage from './components/pages/HomePage';
import PatientTypeSelection from './components/pages/PatientTypeSelection';
import DateTimeSelection from './components/pages/DateTimeSelection';
import PatientDetailsForm from './components/pages/PatientDetailsForm_new';
import MedicalHistoryComponent from './components/pages/MedicalHistory';
import BookingConfirmation from './components/pages/BookingConfirmation';
import AppointmentConfirmation from './components/pages/AppointmentConfirmation';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
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
    selectedDate: 'Today, October 2',
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
  const [showCalendar, setShowCalendar] = useState(false);

  const updateBookingData = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
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

  // Render the appropriate component based on current step
  switch (currentStep) {
    case 0:
      return <HomePage onStartBooking={() => setCurrentStep(1)} />;

    case 1:
      return (
        <PatientTypeSelection
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={() => setCurrentStep(2)}
          onBack={() => setCurrentStep(0)}
        />
      );

    case 2:
      return (
        <BookingConfirmation
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      );

    case 3:
      return (
        <DateTimeSelection
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          onNext={() => setCurrentStep(4)}
          onChangePatientType={() => setCurrentStep(1)}
        />
      );

    case 4:
      return (
        <PatientDetailsForm
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          onNext={() => setCurrentStep(5)}
          onChangePatientType={() => setCurrentStep(1)}
          onChangeDateTime={() => setCurrentStep(3)}
        />
      );

    case 5:
      return (
        <MedicalHistoryComponent
          bookingData={bookingData}
          updateMedicalHistory={updateMedicalHistory}
          onNext={() => setCurrentStep(6)}
          onBack={() => setCurrentStep(4)}
        />
      );

    case 6:
      return (
        <AppointmentConfirmation 
          bookingData={bookingData}
          onNext={() => setCurrentStep(0)} 
        />
      );

    default:
      return <HomePage onStartBooking={() => setCurrentStep(1)} />;
  }
};

export default App;