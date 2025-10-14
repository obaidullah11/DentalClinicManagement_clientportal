import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import { BookingData } from '../../types/BookingTypes';

interface PatientTypeSelectionProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PatientTypeSelection: React.FC<PatientTypeSelectionProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => {
  const [othersText, setOthersText] = useState('');

  const handleOthersChange = (value: string) => {
    setOthersText(value);
    if (value.trim()) {
      updateBookingData('reason', value);
    }
  };

  const isFormValid = () => {
    return bookingData.patientType && (bookingData.reason || othersText.trim());
  };
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-full bg-white">
        <div className="w-full bg-white flex flex-col lg:flex-row lg:items-start lg:justify-center p-4 lg:p-8 lg:max-w-6xl lg:mx-auto min-h-screen">
          <div className="flex-1 lg:pr-8 flex flex-col">
            <div className="mb-6 lg:mb-8 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium text-gray-800">Cosmodental</h2>
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 lg:block">← Back to Home</button>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-cosmo-green mb-6 lg:mb-8">Book your Appointment</h1>
            </div>

            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-6 flex-shrink-0">
              <ClinicInfo />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="mb-6 lg:mb-8 flex-shrink-0">
                <h3 className="text-base font-medium text-gray-800 mb-4">
                  Patient Type <span className="text-red-500">*</span>
                </h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => updateBookingData('patientType', 'New')} 
                    className={`flex-1 lg:flex-none px-6 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      bookingData.patientType === 'New' 
                        ? 'bg-cosmo-green text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    New
                  </button>
                  <button 
                    onClick={() => updateBookingData('patientType', 'Existing')} 
                    className={`flex-1 lg:flex-none px-6 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      bookingData.patientType === 'Existing' 
                        ? 'bg-cosmo-green text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Existing
                  </button>
                </div>
                {!bookingData.patientType && (
                  <p className="text-red-500 text-xs mt-2">Please select a patient type</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-base font-medium text-gray-800 mb-4">
                    Reason for Visit <span className="text-red-500">*</span>
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {['Consultation', 'Cleaning', 'Filling (Pasta)', 'X-Ray', 'Extraction', 'Veneers'].map((reason) => (
                      <button 
                        key={reason} 
                        onClick={() => updateBookingData('reason', reason)} 
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          bookingData.reason === reason 
                            ? 'bg-cosmo-green text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['Braces', 'Treatment'].map((reason) => (
                      <button 
                        key={reason} 
                        onClick={() => updateBookingData('reason', reason)} 
                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          bookingData.reason === reason 
                            ? 'bg-cosmo-green text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-500 mb-2">Others</label>
                    <input 
                      type="text" 
                      value={othersText}
                      onChange={(e) => handleOthersChange(e.target.value)}
                      placeholder="Please specify other reasons..." 
                      className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cosmo-green focus:border-transparent" 
                    />
                  </div>
                  {!bookingData.reason && !othersText.trim() && (
                    <p className="text-red-500 text-xs mt-2">Please select a reason for visit or specify in Others</p>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 pb-8">
                <button 
                  onClick={onNext} 
                  disabled={!isFormValid()}
                  className={`w-full px-8 py-3 rounded-md text-sm font-semibold transition-colors ${
                    isFormValid()
                      ? 'bg-cosmo-green text-white hover:bg-green-700 cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
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

export default PatientTypeSelection;