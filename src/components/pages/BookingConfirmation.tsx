import React, { useState, useRef, useEffect } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData } from '../../types/BookingTypes';

interface BookingConfirmationProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    "Walk-in",
    "Referred by a relative or friend",
    "Google",
    "Social Media",
    "YouTube",
    "Others"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (value: string) => {
    updateBookingData('howDidYouKnow', value);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = options.length * 40 + 16; // Approximate height
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isFormValid = () => {
    return !!bookingData.howDidYouKnow;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <div className="w-full flex flex-col items-center pt-[53px] pb-[50px]">
        <h1 className="text-[24px] font-bold text-[#00b389] mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0">
          <div className="w-full lg:w-[673px]">
            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-[53px] flex-shrink-0">
              <ClinicInfo />
            </div>

            <div>
              <div className="mb-[30px]">
                <h3 className="text-[20px] font-bold text-[#242424] mb-[26px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Patient Type
                </h3>
                <div className="flex gap-[12px]">
                  <div className={`rounded-[10px] text-[18px] transition-colors w-[157px] h-[58px] tracking-[-0.36px] flex items-center justify-center ${
                    bookingData.patientType === 'New' 
                      ? 'bg-[#00b389] text-white font-semibold' 
                      : 'bg-[#f3f3f3] text-[#242424] font-medium'
                  }`} style={{ fontFamily: 'Manrope, sans-serif' }}>
                    New
                  </div>
                  <div className={`rounded-[10px] text-[18px] transition-colors w-[157px] h-[58px] tracking-[-0.36px] flex items-center justify-center ${
                    bookingData.patientType === 'Existing' 
                      ? 'bg-[#00b389] text-white font-semibold' 
                      : 'bg-[#f3f3f3] text-[#242424] font-medium'
                  }`} style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Existing
                  </div>
                </div>
              </div>
              
              <div className="mb-[30px]">
                <h3 className="text-[20px] font-bold text-[#242424] mb-[26px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Reason for Visit
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src="/images/file-check-2.svg" alt="Check" className="w-[18px] h-[18px]" />
                    <span className="text-[18px] font-medium text-[#242424] tracking-[-0.36px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.reason || 'Consultation'}</span>
                  </div>
                  <button onClick={onBack} className="text-[14px] font-semibold text-[#242424] underline tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Change</button>
                </div>
              </div>
              
              <div className="border-b border-[#bfbfbf] border-dashed mb-[30px]"></div>
              
              <div className="mb-[30px]">
                <h3 className="text-[20px] font-bold text-[#242424] mb-[15px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  How Did you know about Cosmodental? <span className="text-red-500">*</span>
                </h3>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] font-medium h-[55px] text-left bg-white flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00b389] focus:border-[#00b389] tracking-[-0.28px]"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    <span className={bookingData.howDidYouKnow ? 'text-[#242424]' : 'text-[#9f9f9f]'}>
                      {bookingData.howDidYouKnow || 'Choose your answer'}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform text-[#242424] ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute z-50 w-full bg-white border border-[#e8e8e8] rounded-[8px] shadow-lg max-h-[240px] overflow-y-auto left-0 right-0 ${
                      dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}>
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full px-[20px] py-[12px] text-left text-[14px] font-medium hover:bg-[#f3f3f3] focus:outline-none transition-colors tracking-[-0.28px] ${
                            bookingData.howDidYouKnow === option ? 'bg-[#f3f3f3] text-[#242424]' : 'text-[#242424]'
                          }`}
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-[30px]">
                <h3 className="text-[20px] font-bold text-[#242424] mb-[15px] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Note <span className="text-[14px] font-normal text-[#9f9f9f] tracking-[-0.28px]">(Preferred Dentist or Special Requests)</span>
                </h3>
                <textarea 
                  value={bookingData.notes} 
                  onChange={(e) => updateBookingData('notes', e.target.value)} 
                  placeholder="Write..." 
                  className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] font-medium h-[55px] resize-none focus:outline-none focus:border-[#00b389] tracking-[-0.28px] placeholder:text-[#9f9f9f]"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                ></textarea>
              </div>
            </div>

            <div className="pt-[30px] pb-[50px] flex justify-center lg:justify-start gap-[14px]">
              <button 
                onClick={onBack} 
                className="w-[256px] h-[55px] bg-[#f3f3f3] text-[#242424] rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-gray-200 transition-colors flex items-center justify-center"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Back
              </button>
              <button 
                onClick={onNext} 
                disabled={!isFormValid()}
                className={`w-[256px] h-[55px] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] transition-colors flex items-center justify-center ${
                  isFormValid() ? 'bg-[#00b389] hover:bg-[#009673]' : 'bg-[#00b389] opacity-50 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Clinic Info - Desktop Only */}
          <div className="hidden lg:block w-[441px] flex-shrink-0">
            <ClinicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;