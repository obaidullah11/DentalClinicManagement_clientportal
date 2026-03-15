import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!bookingData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!bookingData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!bookingData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required';

    if (bookingData.patientType === 'New') {
      if (!bookingData.gender) newErrors.gender = 'Gender is required';
      if (!bookingData.civilStatus.trim()) newErrors.civilStatus = 'Civil Status is required';
      if (!bookingData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
      if (!bookingData.emailAddress.trim()) newErrors.emailAddress = 'Email Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
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
              <div className="mb-[30px] flex-shrink-0 border-b border-[#bfbfbf] border-dashed pb-[20px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[20px] font-bold text-[#242424] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.patientType} Patient</span>
                  <button onClick={onChangePatientType} className="text-[14px] font-semibold text-[#242424] underline tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Change</button>
                </div>
                <span className="text-[14px] font-normal text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.reason}</span>
              </div>
              
              <div className="mb-6 flex-shrink-0 border-b border-[#bfbfbf] border-dashed pb-[20px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[20px] font-bold text-[#242424] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bookingData.selectedDate}</span>
                  <button onClick={onChangeDateTime} className="text-[14px] font-semibold text-[#242424] underline tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Change</button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <img src="/images/clock-4.svg" alt="Clock" className="w-[18px] h-[18px]" />
                  <span className="text-[15px] font-medium text-[#242424] tracking-[-0.3px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {bookingData.selectedTime || '12:00 PM'}
                  </span>
                </div>
              </div>
              
              <div className="mt-[40px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] mb-[22px]">
                  <div className="flex flex-col relative">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      value={bookingData.firstName} 
                      onChange={(e) => updateBookingData('firstName', e.target.value)} 
                      className={`px-[20px] py-[16px] border ${errors.firstName ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {bookingData.patientType === 'New' && <span className="absolute top-[2px] right-[10px] text-red-500 text-xs">*</span>}
                    {errors.firstName && <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.firstName}</span>}
                  </div>
                  <div className="flex flex-col relative">
                    <input 
                      type="text" 
                      placeholder="Middle Name" 
                      value={bookingData.middleName} 
                      onChange={(e) => updateBookingData('middleName', e.target.value)} 
                      className="px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]" 
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                  <div className="flex flex-col relative">
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      value={bookingData.lastName} 
                      onChange={(e) => updateBookingData('lastName', e.target.value)} 
                      className={`px-[20px] py-[16px] border ${errors.lastName ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {bookingData.patientType === 'New' && <span className="absolute top-[2px] right-[10px] text-red-500 text-xs">*</span>}
                    {errors.lastName && <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px] mb-[22px]">
                  <div className="flex flex-col relative">
                    <div className="relative">
                      <select 
                        value={bookingData.gender} 
                        onChange={(e) => updateBookingData('gender', e.target.value)} 
                        className={`w-full px-[20px] py-[16px] border ${errors.gender ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium ${bookingData.gender ? 'text-[#242424]' : 'text-[#9f9f9f]'} focus:outline-none focus:border-[#00b389] tracking-[-0.32px] bg-white appearance-none cursor-pointer`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        <option value="" disabled hidden>Select Gender</option>
                        <option value="Male" className="text-[#242424]">Male</option>
                        <option value="Female" className="text-[#242424]">Female</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="#979797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <span className="absolute top-[2px] right-[10px] text-red-500 text-xs z-10">*</span>
                    {errors.gender && <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.gender}</span>}
                  </div>
                  <div className="flex flex-col relative">
                    <div className="relative">
                      <select 
                        value={bookingData.civilStatus} 
                        onChange={(e) => updateBookingData('civilStatus', e.target.value)} 
                        className={`w-full px-[20px] py-[16px] border ${errors.civilStatus ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium ${bookingData.civilStatus ? 'text-[#242424]' : 'text-[#9f9f9f]'} focus:outline-none focus:border-[#00b389] tracking-[-0.32px] bg-white appearance-none cursor-pointer`}
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                      >
                        <option value="" disabled hidden>Select Civil Status</option>
                        <option value="Single" className="text-[#242424]">Single</option>
                        <option value="Married" className="text-[#242424]">Married</option>
                        <option value="Divorced" className="text-[#242424]">Divorced</option>
                        <option value="Widowed" className="text-[#242424]">Widowed</option>
                        <option value="Separated" className="text-[#242424]">Separated</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="#979797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    {bookingData.patientType === 'New' && <span className="absolute top-[2px] right-[10px] text-red-500 text-xs z-10">*</span>}
                    {errors.civilStatus && <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.civilStatus}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px] mb-[22px]">
                  <div className="flex flex-col relative">
                    <input 
                      type="date" 
                      placeholder="Date of Birth" 
                      value={bookingData.dateOfBirth} 
                      onChange={(e) => updateBookingData('dateOfBirth', e.target.value)} 
                      className={`px-[20px] py-[16px] border ${errors.dateOfBirth ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {bookingData.patientType === 'New' && <span className="absolute top-[2px] right-[30px] text-red-500 text-xs z-10">*</span>}
                    {errors.dateOfBirth && <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.dateOfBirth}</span>}
                  </div>
                  <div className="flex flex-col relative">
                    <input 
                      type="text" 
                      placeholder="Occupation" 
                      value={bookingData.occupation} 
                      onChange={(e) => updateBookingData('occupation', e.target.value)} 
                      className="px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]" 
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px] mb-[22px]">
                  <div className="flex flex-col relative">
                    <input 
                      type="text" 
                      placeholder="Mobile Number" 
                      value={bookingData.mobileNumber} 
                      onChange={(e) => updateBookingData('mobileNumber', e.target.value)} 
                      className={`px-[20px] py-[16px] border ${errors.mobileNumber ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    <span className="absolute top-[2px] right-[10px] text-red-500 text-xs">*</span>
                    {errors.mobileNumber && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 absolute -bottom-5 left-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.mobileNumber}
                    </span>}
                  </div>
                  <div className="flex flex-col relative">
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={bookingData.emailAddress} 
                      onChange={(e) => updateBookingData('emailAddress', e.target.value)} 
                      className={`px-[20px] py-[16px] border ${errors.emailAddress ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[16px] h-[55px] font-medium placeholder:text-[#9f9f9f] focus:outline-none focus:border-[#00b389] tracking-[-0.32px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {bookingData.patientType === 'New' && <span className="absolute top-[2px] right-[10px] text-red-500 text-xs">*</span>}
                    {errors.emailAddress && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 absolute -bottom-5 left-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.emailAddress}
                    </span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-[30px] flex justify-center lg:justify-start gap-[14px]">
                <button 
                  onClick={() => onChangeDateTime()} 
                  className="w-[256px] h-[55px] bg-[#f3f3f3] text-[#242424] rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Back
                </button>
                <button 
                  onClick={handleNext} 
                  className="w-[256px] h-[55px] bg-[#00b389] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-[#009673] transition-colors flex items-center justify-center cursor-pointer"
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

export default PatientDetailsForm;