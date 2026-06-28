import React, { useState, useEffect } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData } from '../../types/BookingTypes';
import { getDocumentSettings, ClinicSettingsData } from '../../services/api';

interface ClinicSettings {
  clinic_name: string;
  clinic_hours_start: string;
  clinic_hours_end: string;
  clinic_days: string[];
}

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
  // Get current date
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [error, setError] = useState<string>('');
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ morning: string[], afternoon: string[] }>({ morning: [], afternoon: [] });
  const [isClinicClosed, setIsClinicClosed] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Fetch clinic settings on mount
  useEffect(() => {
    fetchClinicSettings();
  }, []);

  // Generate time slots when clinic settings are loaded or date changes
  useEffect(() => {
    if (clinicSettings) {
      console.log('Date changed:', { selectedDate, selectedMonth, selectedYear });
      console.log('Clinic settings:', clinicSettings);
      
      // Check if clinic is open and generate slots in one go
      const date = new Date(selectedYear, selectedMonth, selectedDate);
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayOfWeek = dayNames[date.getDay()];
      
      // Safety check for clinic_days array
      const isOpen = clinicSettings.clinic_days && Array.isArray(clinicSettings.clinic_days) 
        ? clinicSettings.clinic_days.includes(dayOfWeek) 
        : false;
      
      console.log('Day of week:', dayOfWeek, 'Is open:', isOpen);
      
      setIsClinicClosed(!isOpen);
      
      if (!isOpen) {
        console.log('Clinic is closed on this day');
        setTimeSlots({ morning: [], afternoon: [] });
        updateBookingData('selectedTime', '');
        return;
      }
      
      // Generate time slots
      const { clinic_hours_start, clinic_hours_end } = clinicSettings;

      const parseTime = (timeStr: string): { hours: number, minutes: number } => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return { hours: 0, minutes: 0 };

        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return { hours, minutes };
      };

      const start = parseTime(clinic_hours_start);
      const end = parseTime(clinic_hours_end);

      const slots: string[] = [];
      let currentHour = start.hours;
      let currentMinute = start.minutes;

      while (currentHour < end.hours || (currentHour === end.hours && currentMinute <= end.minutes)) {
        const hour12 = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
        const ampm = currentHour < 12 ? 'AM' : 'PM';
        const timeStr = `${hour12}:${currentMinute.toString().padStart(2, '0')} ${ampm}`;
        slots.push(timeStr);

        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }

      const morning = slots.filter(slot => {
        const isAM = slot.includes('AM');
        return isAM;
      });
      const afternoon = slots.filter(slot => {
        const isPM = slot.includes('PM');
        return isPM;
      });

      console.log('Generated slots - Morning:', morning.length, 'Afternoon:', afternoon.length);
      setTimeSlots({ morning, afternoon });
    }
  }, [clinicSettings, selectedDate, selectedMonth, selectedYear]);

  // A slot is "past" when the selected date is today and its time is at or before now.
  // Future dates keep every slot enabled; only future times are selectable today.
  const isSlotInPast = (slot: string): boolean => {
    const match = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return false;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const slotDate = new Date(selectedYear, selectedMonth, selectedDate, h, m, 0, 0);
    return slotDate.getTime() <= Date.now();
  };

  const fetchClinicSettings = async () => {
    try {
      setIsLoadingSettings(true);
      setSettingsError(null);
      console.log('🔄 Fetching clinic settings from API...');
      
      const response = await getDocumentSettings();
      console.log('📦 API Response:', response);
      
      if (response.success && response.data?.clinic) {
        console.log('✅ Clinic settings loaded:', response.data.clinic);
        setClinicSettings(response.data.clinic);
      } else {
        console.error('❌ Invalid API response structure:', response);
        const errorMsg = 'success' in response && !response.success 
          ? response.message 
          : 'Invalid response from server';
        console.error('Error message:', errorMsg);
        setSettingsError(errorMsg);
      }
    } catch (error) {
      console.error('💥 Exception caught:', error);
      setSettingsError(error instanceof Error ? error.message : 'Network error occurred');
    } finally {
      setIsLoadingSettings(false);
      console.log('🏁 Fetch complete');
    }
  };

  const validateAppointmentDate = (dateStr: string): boolean => {
    setError('');
    
    console.log('🔍 Date Validation Debug:');
    console.log('  Input dateStr:', JSON.stringify(dateStr));
    console.log('  dateStr type:', typeof dateStr);
    console.log('  dateStr length:', dateStr?.length);
    
    if (!dateStr) {
      console.log('  ❌ No date string provided');
      setError('Please select an appointment date');
      return false;
    }

    // Parse the date string (format: "October 2, 2025" or "Today, October 2")
    let appointmentDate: Date;
    
    if (dateStr.toLowerCase().includes('today')) {
      console.log('  📅 Processing "today" date');
      appointmentDate = new Date();
      appointmentDate.setHours(0, 0, 0, 0);
    } else {
      console.log('  📅 Processing date format');
      
      // Try ISO format first: "2026-05-07"
      const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        console.log('  ✅ ISO format detected');
        const [, year, month, day] = isoMatch;
        appointmentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        appointmentDate.setHours(0, 0, 0, 0);
        console.log('  📅 Created appointmentDate from ISO:', appointmentDate.toISOString());
      } else {
        console.log('  📅 Trying text format');
        // Parse "October 2, 2025" format
        const match = dateStr.match(/(\w+)\s+(\d+),?\s+(\d{4})/);
        console.log('  Regex match result:', match);
        if (match) {
        const [, monthName, day, year] = match;
        console.log('  Extracted - monthName:', monthName, 'day:', day, 'year:', year);
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                           'july', 'august', 'september', 'october', 'november', 'december'];
        let monthIndex = monthNames.findIndex(m => m.startsWith(monthName.toLowerCase()));
        console.log('  📅 Month matching (lowercase):');
        console.log('    monthName.toLowerCase():', monthName.toLowerCase());
        console.log('    monthIndex result:', monthIndex);
        
        // If not found in lowercase, try exact match (case-insensitive)
        if (monthIndex === -1) {
          console.log('  🔍 Trying case-insensitive match...');
          const capitalizedMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
          const updatedMonthIndex = capitalizedMonths.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
          console.log('    updatedMonthIndex result:', updatedMonthIndex);
          monthIndex = updatedMonthIndex;
        }
        console.log('  ✅ Final monthIndex:', monthIndex);
        if (monthIndex !== -1) {
          appointmentDate = new Date(parseInt(year), monthIndex, parseInt(day));
          appointmentDate.setHours(0, 0, 0, 0);
          console.log('  📅 Created appointmentDate:', appointmentDate.toISOString());
        } else {
          console.log('  ❌ Month not found, showing error');
          setError('Invalid date format');
          return false;
        }
      } else {
        setError('Invalid date format');
        return false;
      }
    }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    oneYearFromNow.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      setError('Please select today or a future date');
      return false;
    }

    if (appointmentDate >= oneYearFromNow) {
      setError('Appointment date must be within 1 year');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!bookingData.selectedTime) {
      setError('Please select an appointment time');
      return;
    }
    
    if (validateAppointmentDate(bookingData.selectedDate)) {
      onNext();
    }
  };

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

  const navigateDay = (direction: 'prev' | 'next') => {
    const current = new Date(selectedYear, selectedMonth, selectedDate);
    // p72: the Back/Next arrows move the visible date strip a full week (7 days) at a time.
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Never go before today — clamp to today so the strip always starts at/after the current day.
    if (current < today) current.setTime(today.getTime());
    setSelectedDate(current.getDate());
    setSelectedMonth(current.getMonth());
    setSelectedYear(current.getFullYear());
    const dateStr = `${months[current.getMonth()]} ${current.getDate()}, ${current.getFullYear()}`;
    updateBookingData('selectedDate', dateStr);
    setError('');
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
    console.log('🗓️ handleDateSelect called:');
    console.log('  Selected date number:', date);
    console.log('  Current month:', currentMonth, 'Current year:', currentYear);
    
    setSelectedDate(date);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    const monthName = months[currentMonth];
    const dateStr = `${monthName} ${date}, ${currentYear}`;
    
    console.log('  Generated dateStr:', dateStr);
    updateBookingData('selectedDate', dateStr);
    setError(''); // Clear error when date is selected
  };

  const generateDateButtons = () => {
    const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDate);
    const buttons = [];

    // Generate 7 days: selected day + 6 ahead (web shows all 7, mobile shows first 5)
    for (let i = 0; i <= 6; i++) {
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

  const handleCalendarDateSelect = (buttonDate: Date) => {
    console.log('🗓️ handleCalendarDateSelect called:');
    console.log('  Button date:', buttonDate.toISOString());
    console.log('  Button date.getDate():', buttonDate.getDate());
    console.log('  Button date.getMonth():', buttonDate.getMonth());
    console.log('  Button date.getFullYear():', buttonDate.getFullYear());
    
    setSelectedDate(buttonDate.getDate());
    setSelectedMonth(buttonDate.getMonth());
    setSelectedYear(buttonDate.getFullYear());
    const monthName = months[buttonDate.getMonth()];
    const dateStr = `${monthName} ${buttonDate.getDate()}, ${buttonDate.getFullYear()}`;
    
    console.log('  Generated dateStr:', dateStr);
    updateBookingData('selectedDate', dateStr);
    setError(''); // Clear error when date is selected
  };

  const handleDateButtonClick = (buttonDate: Date) => {
    setSelectedDate(buttonDate.getDate());
    setSelectedMonth(buttonDate.getMonth());
    setSelectedYear(buttonDate.getFullYear());
    const monthName = months[buttonDate.getMonth()];
    const dateStr = `${monthName} ${buttonDate.getDate()}, ${buttonDate.getFullYear()}`;
    updateBookingData('selectedDate', dateStr);
    setError(''); // Clear error when date is selected
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
      // Check if this date is in the past
      const isPast = (() => {
        const dateObj = new Date(currentYear, currentMonth, date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj < today;
      })();
      
      dates.push(
        <button 
          key={date}
          onClick={() => !isPast && handleDateSelect(date)}
          disabled={isPast}
          className={`text-center py-1 text-xs rounded-full w-7 h-7 mx-auto flex items-center justify-center transition-colors font-medium ${
            isPast
              ? 'text-gray-300 cursor-not-allowed'
              : date === selectedDate && currentMonth === selectedMonth && currentYear === selectedYear
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
        <h1 className="text-[24px] font-bold text-cosmo-green mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0">
          <div className="w-full lg:w-[737px]">
            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-6 flex-shrink-0">
              <ClinicInfo />
            </div>

            <div>
              <div className="mb-[30px] flex-shrink-0 border-b border-[#dddddd] pb-[20px]">
                <span className="text-[16px] font-bold text-[#242424] tracking-[-0.32px] block mb-[8px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.patientType} Patient</span>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.reason}</span>
                  <button onClick={onChangePatientType} className="text-[12px] font-semibold text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Change</button>
                </div>
              </div>
              
              <div className="mb-[30px] flex-shrink-0 mt-2">
                <div className="flex items-center justify-between mb-[16px]">
                  <span className="text-[16px] font-bold text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {selectedDate === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
                      ? `Today, ${months[selectedMonth]} ${selectedDate}`
                      : `${months[selectedMonth]} ${selectedDate}, ${selectedYear}`}
                  </span>
                  <div className="flex items-center gap-[6px]">
                    <button onClick={() => setShowCalendar(!showCalendar)} className="w-[85px] h-[28px] border border-[#bfbfbf] rounded-[6px] text-[10px] text-black hover:bg-gray-50 transition-colors flex items-center justify-center tracking-[-0.2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      See Calendar
                    </button>
                    <button onClick={() => navigateDay('prev')} className="w-[18px] h-[18px] flex items-center justify-center hover:opacity-60 transition-opacity">
                      <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 1L1 4.5L4 8" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button onClick={() => navigateDay('next')} className="w-[18px] h-[18px] flex items-center justify-center hover:opacity-60 transition-opacity">
                      <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L4 4.5L1 8" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-[40px] flex-shrink-0">
                <div className="flex gap-[9px] lg:gap-[12px]">
                  {generateDateButtons().map((button, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateButtonClick(button.fullDate)}
                      className={`h-[83px] flex-1 lg:flex-none lg:w-[95px] rounded-[8px] text-center transition-colors flex-col items-center justify-center ${index >= 5 ? 'hidden lg:flex' : 'flex'} ${
                        button.isSelected
                          ? 'bg-cosmo-green text-white'
                          : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      <div className={`text-[16px] tracking-[-0.32px] ${button.isSelected ? 'font-bold' : 'font-normal'}`}>{button.day}</div>
                      <div className="text-[16px] font-bold tracking-[-0.32px]">{String(button.date).padStart(2, '0')}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                {isClinicClosed ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400 mb-2">Clinic is Closed</div>
                      <div className="text-sm text-gray-500">The clinic is not open on this day. Please select another date.</div>
                    </div>
                  </div>
                ) : settingsError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">Unable to Load Time Slots</div>
                      <div className="text-sm text-gray-500">Please refresh the page or contact support.</div>
                    </div>
                  </div>
                ) : isLoadingSettings ? (
                  <div className="text-center text-gray-500 py-8">
                    Loading available time slots...
                  </div>
                ) : (
                  <div className="mb-6">
                    {timeSlots.morning.length > 0 && (
                      <>
                        <h3 className="text-[14px] font-normal text-[#9f9f9f] mb-[15px] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Morning</h3>
                        <div className="grid grid-cols-3 gap-[9px] lg:flex lg:flex-wrap lg:gap-[12px] mb-[40px]">
                          {timeSlots.morning.map((time) => {
                            const past = isSlotInPast(time);
                            return (
                            <button
                              key={time}
                              disabled={past}
                              onClick={() => {
                                if (past) return;
                                updateBookingData('selectedTime', time);
                                setError('');
                              }}
                              className={`h-[47px] lg:h-[58px] lg:w-[128px] rounded-[10px] text-[14px] lg:text-[18px] font-medium tracking-[-0.28px] transition-colors flex items-center justify-center ${
                                past
                                  ? 'bg-[#f3f3f3] text-[#c4c4c4] opacity-60 cursor-not-allowed'
                                  : bookingData.selectedTime === time
                                    ? 'bg-cosmo-green text-white'
                                    : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: 'Manrope, sans-serif' }}
                            >
                              {time}
                            </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                    
                    {timeSlots.afternoon.length > 0 && (
                      <>
                        <h3 className="text-[14px] font-normal text-[#9f9f9f] mb-[15px] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Afternoon</h3>
                        <div className="grid grid-cols-3 gap-[9px] lg:flex lg:flex-wrap lg:gap-[12px] mb-4">
                          {timeSlots.afternoon.map((time) => {
                            const past = isSlotInPast(time);
                            return (
                            <button
                              key={time}
                              disabled={past}
                              onClick={() => {
                                if (past) return;
                                updateBookingData('selectedTime', time);
                                setError('');
                              }}
                              className={`h-[47px] lg:h-[58px] lg:w-[128px] rounded-[10px] text-[14px] lg:text-[18px] font-medium tracking-[-0.28px] transition-colors flex items-center justify-center ${
                                past
                                  ? 'bg-[#f3f3f3] text-[#c4c4c4] opacity-60 cursor-not-allowed'
                                  : bookingData.selectedTime === time
                                    ? 'bg-cosmo-green text-white'
                                    : 'bg-[#f3f3f3] text-[#242424] hover:bg-gray-200'
                              }`}
                              style={{ fontFamily: 'Manrope, sans-serif' }}
                            >
                              {time}
                            </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {timeSlots.morning.length === 0 && timeSlots.afternoon.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No time slots available for this date.
                      </div>
                    )}
                  </div>
                )}
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
                <div className="flex flex-col items-center">
                  <button 
                    onClick={handleNext} 
                    disabled={!bookingData.selectedTime || !bookingData.selectedDate}
                    className={`w-[256px] h-[55px] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] transition-colors flex items-center justify-center ${
                      bookingData.selectedTime && bookingData.selectedDate
                        ? 'bg-cosmo-green hover:opacity-90 cursor-pointer'
                        : 'bg-cosmo-green opacity-50 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    Continue
                  </button>
                  {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
                </div>
              </div>

            {/* Calendar popup - Full width modal at bottom */}
            {showCalendar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                <div className="w-full max-w-[1920px] max-h-[90vh] bg-white rounded-t-2xl shadow-lg flex-shrink-0 overflow-y-auto">
                  <div className="p-4 flex flex-col">
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
                        className="bg-cosmo-green text-white px-8 py-2 rounded-md text-[14px] font-semibold tracking-[-0.28px] hover:opacity-90 transition-colors"
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

