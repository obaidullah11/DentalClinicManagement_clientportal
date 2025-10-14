import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import { BookingData } from '../../types/BookingTypes';

interface DateTimeSelectionProps {
  bookingData: BookingData;
  updateBookingData: (field: keyof BookingData, value: string) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  onNext: () => void;
  onChangePatientType: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  bookingData,
  updateBookingData,
  showCalendar,
  setShowCalendar,
  onNext,
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
      <div className="w-full bg-white">
        <div className="w-full bg-white flex flex-col lg:flex-row lg:items-start lg:justify-center p-4 lg:p-8 lg:max-w-6xl lg:mx-auto min-h-screen">
          <div className="flex-1 lg:pr-8 flex flex-col">
            <div className="mb-6 lg:mb-8 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Cosmodental</h2>
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
                  <span className="text-base font-medium text-gray-800">
                    {selectedDate === 2 && selectedMonth === 9 && selectedYear === 2025 
                      ? 'Today, October 2' 
                      : `${months[selectedMonth]} ${selectedDate}, ${selectedYear}`}
                  </span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowCalendar(!showCalendar)} className="px-4 lg:px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      See Calendar
                    </button>
                    <div className="hidden lg:flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600 text-lg">‹</button>
                      <button className="text-gray-400 hover:text-gray-600 text-lg">›</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 flex-shrink-0">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {generateDateButtons().map((button, index) => (
                    <button 
                      key={index}
                      onClick={() => handleDateButtonClick(button.fullDate)}
                      className={`px-3 lg:px-4 py-2 rounded-md text-center transition-colors flex-shrink-0 ${
                        button.isSelected 
                          ? 'bg-cosmo-green text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-xs">{button.day}</div>
                      <div className="text-sm font-medium">{String(button.date).padStart(2, '0')}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Morning</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {['9:00 AM', '9:45 AM', '10:00 AM', '10:45 AM'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => updateBookingData('selectedTime', time)} 
                        className={`px-4 py-3 rounded-md text-sm transition-colors ${
                          bookingData.selectedTime === time 
                            ? 'bg-cosmo-green text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Afternoon</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => updateBookingData('selectedTime', time)} 
                        className={`px-4 py-3 rounded-md text-sm transition-colors ${
                          bookingData.selectedTime === time 
                            ? 'bg-cosmo-green text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {['02:30 PM', '03:00 PM'].map((time) => (
                      <button 
                        key={time} 
                        onClick={() => updateBookingData('selectedTime', time)} 
                        className={`px-4 py-3 rounded-md text-sm transition-colors ${
                          bookingData.selectedTime === time 
                            ? 'bg-cosmo-green text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 pb-8">
                <button 
                  onClick={onNext} 
                  className="w-full bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
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
                        <h3 className="text-sm font-medium text-gray-800 min-w-[120px] text-center">
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
                    <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                          <div key={day} className="text-center text-xs text-gray-500 py-1 font-medium">{day}</div>
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
                        className="px-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                        className="bg-cosmo-green text-white px-8 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
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
          <div className="hidden lg:block">
            <ClinicInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;