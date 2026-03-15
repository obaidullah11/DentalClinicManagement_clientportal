import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData } from '../../types/BookingTypes';

interface DateTimeSelectionProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onChangePatientType: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  bookingData,
  updateBookingData,
  showCalendar,
  setShowCalendar,
  onNext,
  onBack,
  onChangePatientType
}) => {
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(2);
  const [selectedMonth, setSelectedMonth] = useState(9); // Track selected month
  const [selectedYear, setSelectedYear] = useState(2025); // Track selected year

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    const monthName = months[currentMonth];
    updateBookingData('selectedDate', `${monthName} ${date}, ${currentYear}`);
  };

  const generateDateButtons = () => {
    const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
    const buttons = [];
    
    // Generate 7 days starting from 3 days before selected date
    for (let i = -3; i <= 3; i++) {
      const buttonDate = new Date(selectedDateObj);
      buttonDate.setDate(selectedDate + i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[buttonDate.getDay()];
      const day = buttonDate.getDate();
      const isSelected = i === 0;
      
      buttons.push({
        day: dayName,
        date: day,
        isSelected,
        fullDate: buttonDate
      });
    }
    
    return buttons;
  };

  const handleDateButtonClick = (buttonDate: Date) => {
    setSelectedDate(buttonDate.getDate());
    setSelectedMonth(buttonDate.getMonth());
    setSelectedYear(buttonDate.getFullYear());
    const monthName = months[buttonDate.getMonth()];
    updateBookingData('selectedDate', `${monthName} ${buttonDate.getDate()}, ${buttonDate.getFullYear()}`);
  };

  const renderCalendarDates = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const dates = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      dates.push(
        <div key={`empty-${i}`} className="py-1"></div>
      );
    }

    // Calendar dates
    for (let date = 1; date <= daysInMonth; date++) {
      dates.push(
        <button 
          key={date}
          onClick={() => handleDateSelect(date)}
          className={`text-center py-1 text-xs rounded-full w-7 h-7 mx-auto flex items-center justify-center transition-colors font-medium ${
            date === selectedDate && currentMonth === selectedMonth && currentYear === selectedYear
              ? 'bg-cosmo-green text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {date}
        </button>
      );
    }

    return dates;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <div className="w-full flex flex-col items-center pt-[53px] pb-[50px]">
        <h1 className="text-[24px] font-bold text-[#00b389] mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0">
          <div className="w-full lg:w-[737px]">
            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-6 flex-shrink-0">
              <ClinicInfo />
            </div>

            <div>
              <div className="mb-[30px] flex-shrink-0 border-b border-[#bfbfbf] border-dashed pb-[20px]">
                <div className="flex items-center justify-between mb-[10px]">
                  <span className="text-[20px] font-bold text-[#242424] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.patientType} Patient</span>
                  <button onClick={onChangePatientType} className="text-[14px] font-semibold text-[#242424] underline tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Change</button>
                </div>
                <span className="text-[14px] font-normal text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.reason}</span>
              </div>
              
              <div className="mb-[30px] flex-shrink-0 mt-2">
                <div className="flex items-center justify-between mb-[16px]">
                  <span className="text-[20px] font-bold text-[#242424] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {selectedDate === 2 && selectedMonth === 9 && selectedYear === 2025 
                      ? 'Today, October 2' 
                      : `${months[selectedMonth]} ${selectedDate}, ${selectedYear}`}
                  </span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowCalendar(!showCalendar)} className="w-[116px] h-[33px] border border-[#bfbfbf] rounded-[6px] text-[13px] text-black hover:bg-gray-50 transition-colors flex items-center justify-center tracking-[-0.26px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      See Calendar
                    </button>
                    <div className="hidden lg:flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600 text-lg">‹</button>
                      <button className="text-gray-400 hover:text-gray-600 text-lg">›</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-[40px] flex-shrink-0">
                <div className="flex gap-[11px] overflow-x-auto pb-2">
                  {generateDateButtons().map((button, index) => (
                    <button 
                      key={index}
                      onClick={() => handleDateButtonClick(button.fullDate)}
                      className={`w-[95px] h-[83px] rounded-[8px] text-center transition-colors flex-shrink-0 flex flex-col items-center justify-center ${
                        button.isSelected 
                          ? 'bg-[#00b389] text-white' 
                          : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      <div className="text-[16px] font-bold tracking-[-0.32px]">{button.day}</div>
                      <div className="text-[16px] font-bold tracking-[-0.32px]">{String(button.date).padStart(2, '0')}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-[14px] font-normal text-[#9f9f9f] mb-[15px] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Morning</h3>
                  <div className="flex flex-wrap gap-[12px] mb-[40px]">
                    {['9:00 AM', '9:45 AM', '10:00 AM', '10:45 AM'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => updateBookingData('selectedTime', time)} 
                        className={`w-[128px] h-[58px] rounded-[10px] text-[18px] font-medium tracking-[-0.36px] transition-colors flex items-center justify-center ${
                          bookingData.selectedTime === time 
                            ? 'bg-[#00b389] text-white' 
                            : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  
                  <h3 className="text-[14px] font-normal text-[#9f9f9f] mb-[15px] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Afternoon</h3>
                  <div className="flex flex-wrap gap-[12px] mb-4">
                    {['12:00 PM', '12:45 PM', '01:00 PM', '01:45 PM', '02:00 PM', '02:45 PM', '03:00 PM'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => updateBookingData('selectedTime', time)} 
                        className={`w-[128px] h-[58px] rounded-[10px] text-[18px] font-medium tracking-[-0.36px] transition-colors flex items-center justify-center ${
                          bookingData.selectedTime === time 
                            ? 'bg-[#00b389] text-white' 
                            : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-[30px] pb-[50px] flex justify-center lg:justify-start gap-[14px]">
                <button
                  onClick={onBack}
                  className="w-[256px] h-[55px] bg-[#f3f3f3] text-[#242424] rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Back
                </button>
                <button 
                  onClick={onNext} 
                  disabled={!bookingData.selectedTime || !bookingData.selectedDate}
                  className={`w-[256px] h-[55px] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] transition-colors flex items-center justify-center ${
                    bookingData.selectedTime && bookingData.selectedDate
                      ? 'bg-[#00b389] hover:bg-[#009673] cursor-pointer'
                      : 'bg-[#00b389] opacity-50 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Continue
                </button>
              </div>

            {/* Calendar popup - Full width modal at bottom */}
            {showCalendar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                <div className="w-full max-w-[1920px] h-[334px] bg-white rounded-t-2xl shadow-lg flex-shrink-0">
                  <div className="p-4 h-full flex flex-col">
                    {/* Calendar header */}
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => navigateMonth('prev')}
                          className="text-gray-400 hover:text-gray-600 text-base transition-colors"
                        >
                          ‹
                        </button>
                        <h3 className="text-[16px] font-bold text-[#242424] min-w-[120px] text-center tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {months[currentMonth]} {currentYear}
                        </h3>
                        <button 
                          onClick={() => navigateMonth('next')}
                          className="text-gray-400 hover:text-gray-600 text-base transition-colors"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="text-center text-[12px] text-[#9f9f9f] py-1 font-medium tracking-[-0.24px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {renderCalendarDates()}
                      </div>
                    </div>
                    
                    {/* Cancel and Confirm buttons */}
                    <div className="flex justify-center gap-4 mt-4 pb-4">
                      <button 
                        onClick={() => setShowCalendar(false)} 
                        className="px-8 py-2 border border-[#e8e8e8] rounded-md text-[14px] text-[#242424] font-semibold hover:bg-gray-50 transition-colors tracking-[-0.28px]"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedMonth(currentMonth);
                          setSelectedYear(currentYear);
                          const monthName = months[currentMonth];
                          updateBookingData('selectedDate', `${monthName} ${selectedDate}, ${currentYear}`);
                          setShowCalendar(false);
                        }} 
                        className="bg-[#00b389] text-white px-8 py-2 rounded-md text-[14px] font-semibold tracking-[-0.28px] hover:bg-[#009673] transition-colors"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default DateTimeSelection;