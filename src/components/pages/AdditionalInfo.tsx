import React, { useState, useRef, useEffect } from 'react';
import ClinicInfo from '../common/ClinicInfo';
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
    <div className="w-screen h-screen max-w-[1920px] max-h-[1080px] bg-white font-sans overflow-hidden">
      <div className="w-full h-full bg-white">
        <div className="w-full h-full bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-6xl flex gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Cosmodental</h2>
                <h1 className="text-2xl font-bold text-cosmo-green mb-8">Book your Appointment</h1>
              </div>
              
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
                  <button className="text-sm text-cosmo-green hover:underline ml-auto">change</button>
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
              
              <div className="flex gap-4">
                <button 
                  onClick={onBack} 
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button onClick={onNext} className="bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors">Next</button>
              </div>
            </div>
            <ClinicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;