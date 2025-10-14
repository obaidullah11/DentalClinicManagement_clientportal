import React from 'react';
import { BookingData } from '../../types/BookingTypes';

interface AppointmentConfirmationProps {
  bookingData: BookingData;
  onNext: () => void;
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ bookingData, onNext }) => {
  // Generate a random appointment code
  const generateAppointmentCode = () => {
    return 'ABC' + Math.random().toString().slice(2, 11);
  };

  const appointmentCode = generateAppointmentCode();

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
                  <div className="w-8 h-8 bg-white rounded"></div>
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

              <div className="text-right mb-6">
                <p className="text-xs text-gray-600 mb-1">Your appointment code is</p>
                <p className="text-lg font-bold text-gray-800">{appointmentCode}</p>
              </div>

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