import React from 'react';
import ClinicInfo from '../common/ClinicInfo';
import { BookingData } from '../../types/BookingTypes';

interface PatientDetailsFormProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onChangePatientType: () => void;
  onChangeDateTime: () => void;
}

const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onChangePatientType,
  onChangeDateTime
}) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-full bg-white">
        <div className="w-full bg-white flex flex-col lg:flex-row lg:items-start lg:justify-center p-4 lg:p-8 lg:max-w-6xl lg:mx-auto min-h-screen">
          <div className="flex-1 lg:pr-8 flex flex-col">
            <div className="mb-6 lg:mb-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800">Cosmodental</h2>
                <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-700 hidden lg:block">← Back to Home</button>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-cosmo-green mb-6 lg:mb-8">Book your Appointment</h1>
            </div>

            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-6 flex-shrink-0">
              <ClinicInfo />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-medium text-gray-800">{bookingData.patientType} Patient</span>
                  <button onClick={onChangePatientType} className="text-sm text-cosmo-green hover:underline">Change</button>
                </div>
                <span className="text-sm text-gray-600">{bookingData.reason}</span>
              </div>
              
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-medium text-gray-800">{bookingData.selectedDate}</span>
                  <button onClick={onChangeDateTime} className="text-sm text-cosmo-green hover:underline">Change</button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">{bookingData.selectedTime || '12:00 PM'}</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    value={bookingData.firstName} 
                    onChange={(e) => updateBookingData('firstName', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                  <input 
                    type="text" 
                    placeholder="Middle Name" 
                    value={bookingData.middleName} 
                    onChange={(e) => updateBookingData('middleName', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={bookingData.lastName} 
                    onChange={(e) => updateBookingData('lastName', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <select 
                    value={bookingData.gender} 
                    onChange={(e) => updateBookingData('gender', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Civil Status" 
                    value={bookingData.civilStatus} 
                    onChange={(e) => updateBookingData('civilStatus', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                  <input 
                    type="date" 
                    placeholder="Date of Birth" 
                    value={bookingData.dateOfBirth} 
                    onChange={(e) => updateBookingData('dateOfBirth', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Occupation" 
                    value={bookingData.occupation} 
                    onChange={(e) => updateBookingData('occupation', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                  <input 
                    type="text" 
                    placeholder="Mobile Number" 
                    value={bookingData.mobileNumber} 
                    onChange={(e) => updateBookingData('mobileNumber', e.target.value)} 
                    className="px-3 py-3 border border-gray-300 rounded-md text-sm" 
                  />
                </div>
                
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={bookingData.emailAddress} 
                  onChange={(e) => updateBookingData('emailAddress', e.target.value)} 
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm mb-6" 
                />
              </div>
              
              <div className="flex-shrink-0 pt-4 pb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <button 
                    onClick={() => onChangeDateTime()} 
                    className="w-full lg:w-auto px-6 py-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={onNext} 
                    className="w-full lg:w-auto bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Info - Desktop Only */}
          <div className="hidden lg:block flex-shrink-0">
            <ClinicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsForm;