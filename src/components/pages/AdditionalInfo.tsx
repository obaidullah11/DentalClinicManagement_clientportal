import React, { useState, useRef, useEffect } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData } from '../../types/BookingTypes';

interface AdditionalInfoProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
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
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden flex flex-col h-screen">
      <Header />
      <div className="w-full flex flex-col items-center pt-[53px] pb-[50px] overflow-hidden flex-1">
        <h1 className="text-[24px] font-bold text-[#00b389] mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0 flex-1 overflow-hidden min-h-0">
          <div className="w-full lg:w-[737px] flex flex-col h-full">
            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-[53px] flex-shrink-0">
              <ClinicInfo />
            </div>
            
            <div className="flex-1 flex flex-col w-full h-full min-h-0">
              <div className="flex-1 overflow-y-auto pr-4 pb-[100px] hide-scrollbar">
              
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-800 mb-4">Patient Type</h3>
                <div className="flex gap-4 mb-6">
                  <button className="bg-cosmo-green text-white px-6 py-2 rounded-md text-sm font-medium">New</button>
                  <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-md text-sm font-medium">Existing</button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-800 mb-4">Reason for Visit</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Consultation</span>
                  <button className="text-[14px] font-semibold text-[#242424] underline tracking-[-0.28px] ml-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>change</button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-800 mb-4">How Did you know about Cosmodental?</h3>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4 text-left bg-white flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cosmo-green focus:border-transparent"
                  >
                    <span className={bookingData.howDidYouKnow ? 'text-gray-900' : 'text-gray-500'}>
                      {bookingData.howDidYouKnow || 'Choose your answer'}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto left-0 right-0 ${
                      dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}>
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${
                            bookingData.howDidYouKnow === option ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-800 mb-4">Note <span className="text-sm text-gray-500">(Preferred Dentist or Special Requests)</span></h3>
                <textarea value={bookingData.notes} onChange={(e) => updateBookingData('notes', e.target.value)} placeholder="Write..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"></textarea>
              </div>
              
              </div>
              <div className="flex-shrink-0 pt-[60px] flex justify-center lg:justify-start gap-[14px]">
                <button 
                  onClick={onBack}
                  className="w-[256px] h-[55px] bg-[#f3f3f3] text-[#242424] rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-gray-200 transition-colors flex items-center justify-center"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Back
                </button>
                <button 
                  onClick={onNext} 
                  className="w-[256px] h-[55px] bg-[#00b389] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-[#009673] transition-colors flex items-center justify-center"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Next
                </button>
              </div>
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

export default AdditionalInfo;