import React, { useState, useMemo } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData } from '../../types/BookingTypes';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

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
  const { settings } = useWebsiteSettings();
  const [othersText, setOthersText] = useState('');

  // Default procedure choices if API doesn't provide them
  const defaultChoices = ['Consultation', 'Cleaning', 'Filling (Pasta)', 'X-Ray', 'Extraction', 'Veneers', 'Braces', 'Treatment'];
  
  // Get procedure choices from API or use defaults
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const procedureChoices = useMemo(() => {
    return settings?.procedure_choices && settings.procedure_choices.length > 0 
      ? settings.procedure_choices 
      : defaultChoices;
  }, [settings?.procedure_choices]);

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
      <Header />

      {/* Main content centered */}
      <div className="w-full flex flex-col items-center pt-[53px] pb-[50px]">
        {/* Title centered above everything */}
        <h1 className="text-[24px] font-bold text-[#00b389] mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0">
          {/* Left side - Form */}
          <div className="w-full lg:w-[673px]">
            <div>
                {/* Patient Type */}
                <div className="mb-[42px]">
              <h3 className="text-[20px] font-bold text-[#242424] mb-[26px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Patient Type
              </h3>
              <div className="flex gap-[12px]">
                <button 
                  onClick={() => updateBookingData('patientType', 'New')} 
                  className={`rounded-[10px] text-[18px] transition-colors cursor-pointer w-[157px] h-[58px] tracking-[-0.36px] flex items-center justify-center ${
                    bookingData.patientType === 'New' 
                      ? 'bg-[#00b389] text-white font-semibold' 
                      : 'bg-[#f3f3f3] text-[#242424] font-medium hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  New
                </button>
                <button 
                  onClick={() => updateBookingData('patientType', 'Existing')} 
                  className={`rounded-[10px] text-[18px] transition-colors cursor-pointer w-[157px] h-[58px] tracking-[-0.36px] flex items-center justify-center ${
                    bookingData.patientType === 'Existing' 
                      ? 'bg-[#00b389] text-white font-semibold' 
                      : 'bg-[#f3f3f3] text-[#242424] font-medium hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Existing
                </button>
              </div>
              {!bookingData.patientType && (
                <p className="text-red-500 text-xs mt-2">Please select a patient type</p>
              )}
            </div>

            {/* Reason for Visit */}
            <div className="mb-[28px]">
              <h3 className="text-[20px] font-bold text-[#242424] mb-[26px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Reason for Visit <span className="text-red-500">*</span>
              </h3>
              <div className="flex flex-wrap gap-x-[12px] gap-y-[12px]">
                {procedureChoices.map((reason) => (
                  <button 
                    key={reason} 
                    onClick={() => updateBookingData('reason', reason)} 
                    className={`rounded-[10px] text-[18px] transition-colors cursor-pointer h-[58px] tracking-[-0.36px] flex items-center justify-center px-[20px] whitespace-nowrap ${
                      bookingData.reason === reason 
                        ? 'bg-[#00b389] text-white font-semibold' 
                        : 'bg-[#f3f3f3] text-[#242424] font-medium hover:bg-gray-200'
                    }`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="mt-[35px]">
                <input 
                  type="text" 
                  value={othersText}
                  onChange={(e) => handleOthersChange(e.target.value)}
                  placeholder="Others" 
                  className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] font-medium focus:outline-none focus:border-[#00b389] h-[55px] text-[#242424] placeholder:text-[#9f9f9f] tracking-[-0.28px]" 
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                />
              </div>
              {!bookingData.reason && !othersText.trim() && (
                <p className="text-red-500 text-xs mt-2">Please select a reason for visit or specify in Others</p>
              )}
            </div>

            {/* Confirm Button */}
            <div className="pt-[30px] pb-8 flex justify-center lg:justify-end gap-[14px]">
              <button 
                onClick={onNext} 
                disabled={!isFormValid()}
                className={`w-[256px] h-[55px] rounded-[8px] text-[16px] font-semibold transition-colors flex items-center justify-center tracking-[-0.32px] ${
                  isFormValid()
                    ? 'bg-[#00b389] text-white hover:bg-[#009673] cursor-pointer' 
                    : 'bg-[#00b389] text-white opacity-50 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Confirm
              </button>
            </div>
            </div>
          </div>

          {/* Right side - Clinic Info - aligned with Patient Type heading */}
          <div className="hidden lg:block w-[441px] flex-shrink-0">
            <ClinicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTypeSelection;