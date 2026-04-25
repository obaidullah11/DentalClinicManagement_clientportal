import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData, MedicalHistory } from '../../types/BookingTypes';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';
import { useToast } from '../../contexts/ToastContext';

interface MedicalHistoryProps {
  bookingData: BookingData;
  updateMedicalHistory: (field: keyof MedicalHistory, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MedicalHistoryComponent: React.FC<MedicalHistoryProps> = ({
  bookingData,
  updateMedicalHistory,
  onNext,
  onBack
}) => {
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { settings } = useWebsiteSettings();
  const { showToast } = useToast();

  const handleYesNoChange = (field: keyof MedicalHistory, value: string) => {
    updateMedicalHistory(field, value);
    // Clear error for this field when user selects a value
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    // Clear related errors when changing
    if (field === 'hospitalized' && value === 'No') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.hospitalizedWhy;
        return newErrors;
      });
    }
    if (field === 'prescriptionMedication' && value === 'No') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.prescriptionSpecify;
        return newErrors;
      });
    }
  };

  const handleTextChange = (field: keyof MedicalHistory, value: string) => {
    updateMedicalHistory(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    
    // Validate required Yes/No questions (1-7)
    const requiredYesNoFields: Array<keyof MedicalHistory> = [
      'generalHealth', 'medicalTreatment', 'services', 'hospitalized', 
      'prescriptionMedication', 'tobacco', 'alcohol'
    ];
    
    requiredYesNoFields.forEach(field => {
      const value = bookingData.medicalHistory[field];
      if (!value || value === '' || value === undefined || value === null) {
        newErrors[field] = 'Required';
      }
    });

    // Validate conditional required fields
    if (bookingData.medicalHistory.hospitalized === 'Yes') {
      if (!bookingData.medicalHistory.hospitalizedWhy || !bookingData.medicalHistory.hospitalizedWhy.trim()) {
        newErrors.hospitalizedWhy = 'Required';
      } else if (bookingData.medicalHistory.hospitalizedWhy.length > 500) {
        newErrors.hospitalizedWhy = 'Response must not exceed 500 characters';
      }
    }

    if (bookingData.medicalHistory.prescriptionMedication === 'Yes') {
      if (!bookingData.medicalHistory.prescriptionSpecify || !bookingData.medicalHistory.prescriptionSpecify.trim()) {
        newErrors.prescriptionSpecify = 'Required';
      } else if (bookingData.medicalHistory.prescriptionSpecify.length > 500) {
        newErrors.prescriptionSpecify = 'Response must not exceed 500 characters';
      }
    }

    // Validate bleeding time (Question 9)
    if (!bookingData.medicalHistory.bleedingTime || !bookingData.medicalHistory.bleedingTime.trim()) {
      newErrors.bleedingTime = 'Required';
    } else if (bookingData.medicalHistory.bleedingTime.length > 100) {
      newErrors.bleedingTime = 'Response must not exceed 100 characters';
    }

    // Validate allergies (Question 8) - at least one allergy should be selected
    const allergicItems = bookingData.medicalHistory.allergicItems;
    if (!allergicItems || Object.values(allergicItems).every(value => !value)) {
      newErrors.allergies = 'Required';
    }

    // Validate for women only (Question 10) - only if patient is female
    if (bookingData.gender === 'Female') {
      const forWomenOnly = bookingData.medicalHistory.forWomenOnly;
      if (!forWomenOnly.pregnant || !forWomenOnly.nursing || !forWomenOnly.birthControl || 
          forWomenOnly.pregnant === '' || forWomenOnly.nursing === '' || forWomenOnly.birthControl === '') {
        newErrors.forWomenOnly = 'Required';
      }
    }

    // Validate medical conditions (Question 13) - at least one condition should be selected
    const followingConditions = bookingData.medicalHistory.followingConditions;
    if (!followingConditions || followingConditions.length === 0) {
      newErrors.followingConditions = 'Required';
    }

    // Validate blood type (Question 11) - required field
    if (!bookingData.medicalHistory.bloodType || !bookingData.medicalHistory.bloodType.trim()) {
      newErrors.bloodType = 'Required';
    } else if (bookingData.medicalHistory.bloodType.length > 20) {
      newErrors.bloodType = 'Blood type must not exceed 20 characters';
    }

    // Validate blood pressure (Question 12) - required field
    if (!bookingData.medicalHistory.bloodPressure || !bookingData.medicalHistory.bloodPressure.trim()) {
      newErrors.bloodPressure = 'Required';
    } else {
      const bpPattern = /^\d{2,3}\/\d{2}$/;
      if (!bpPattern.test(bookingData.medicalHistory.bloodPressure.trim())) {
        newErrors.bloodPressure = 'Invalid format. Use XXX/XX (e.g., 120/80)';
      } else if (bookingData.medicalHistory.bloodPressure.length > 20) {
        newErrors.bloodPressure = 'Blood pressure must not exceed 20 characters';
      }
    }

    // Validate text field max lengths
    const textFields: Array<keyof MedicalHistory> = [
      'generalHealth', 'medicalTreatment', 'medicalCondition', 'services', 'bleedingTime'
    ];
    
    textFields.forEach(field => {
      const value = bookingData.medicalHistory[field];
      if (value && typeof value === 'string') {
        const maxLength = field === 'bleedingTime' ? 100 : 500;
        if (value.length > maxLength) {
          newErrors[field] = `Response must not exceed ${maxLength} characters`;
        }
      }
    });

    // Check consent checkboxes
    if (!consentAcknowledged || !termsAccepted) {
      newErrors.consent = 'Please acknowledge the consent and accept terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return consentAcknowledged && termsAccepted;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    } else {
      showToast('Please answer all required questions', 'error');
    }
  };

  const handleAllergicItemChange = (item: keyof MedicalHistory['allergicItems'], checked: boolean) => {
    const currentItems = bookingData.medicalHistory.allergicItems || {
      localAnesthetic: false,
      penicillin: false,
      sulfa: false,
      aspirin: false,
      latex: false,
      others: false
    };
    
    updateMedicalHistory('allergicItems', {
      ...currentItems,
      [item]: checked
    });

    // Clear allergies error when user selects any allergy
    if (checked) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.allergies;
        return newErrors;
      });
    }
  };

  const handleWomenOnlyChange = (field: keyof MedicalHistory['forWomenOnly'], value: string) => {
    const currentWomenOnly = bookingData.medicalHistory.forWomenOnly || {
      pregnant: '',
      nursing: '',
      birthControl: ''
    };
    
    updateMedicalHistory('forWomenOnly', {
      ...currentWomenOnly,
      [field]: value
    });

    // Clear forWomenOnly error when user answers any field
    if (value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.forWomenOnly;
        return newErrors;
      });
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = bookingData.medicalHistory.followingConditions || [];
    
    if (checked) {
      updateMedicalHistory('followingConditions', [...currentConditions, condition]);
      
      // Clear followingConditions error when user selects any condition
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.followingConditions;
        return newErrors;
      });
    } else {
      updateMedicalHistory('followingConditions', currentConditions.filter(c => c !== condition));
    }
  };

  const YesNoRadio = ({ field, question, number }: { field: keyof MedicalHistory, question: string, number: number }) => (
    <div className="mb-[30px]">
      <div className="flex items-start gap-[16px]">
        <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
          {number}
        </div>
        <div className="flex-1">
          <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>{number}. {question}</p>
          <div className="flex gap-[40px]">
            <label className="flex items-center gap-[8px] cursor-pointer">
              <input
                type="radio"
                name={field}
                value="Yes"
                checked={bookingData.medicalHistory[field] === 'Yes'}
                onChange={(e) => handleYesNoChange(field, e.target.value)}
                className={`w-[18px] h-[18px] ${errors[field] ? 'border-red-500' : 'text-cosmo-green focus:ring-cosmo-green'} border-[#e8e8e8]`}
              />
              <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
            </label>
            <label className="flex items-center gap-[8px] cursor-pointer">
              <input
                type="radio"
                name={field}
                value="No"
                checked={bookingData.medicalHistory[field] === 'No'}
                onChange={(e) => handleYesNoChange(field, e.target.value)}
                className={`w-[18px] h-[18px] ${errors[field] ? 'border-red-500' : 'text-cosmo-green focus:ring-cosmo-green'} border-[#e8e8e8]`}
              />
              <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
            </label>
          </div>
          {errors[field] && (
            <span className="text-red-500 text-xs mt-1 block">{errors[field]}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col h-screen">
      <Header />
      <div className="w-full flex flex-col items-center pt-[53px] pb-[50px] overflow-hidden flex-1">
        <h1 className="text-[24px] font-bold text-cosmo-green mb-[45px] text-center tracking-[-0.48px] shrink-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Book your Appointment
        </h1>

        <div className="w-full max-w-[1241px] flex justify-between items-start px-4 lg:px-0 flex-1 overflow-hidden min-h-0">
          <div className="w-full lg:w-[673px] flex flex-col h-full">
            {/* Clinic Info - Mobile Only */}
            <div className="lg:hidden mb-[53px] flex-shrink-0">
              <ClinicInfo />
            </div>

            <div className="flex-1 flex flex-col w-full h-full min-h-0">
              <div className="mb-[53px] flex-shrink-0">
                <h2 className="text-[20px] font-bold text-[#242424] tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Medical History</h2>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-[20px]">

              {/* Question 1 */}
              <YesNoRadio 
                field="generalHealth" 
                question="Are you in good health?" 
                number={1} 
              />

              {/* Question 2 */}
              <div className="mb-[30px]">
                <YesNoRadio 
                  field="medicalTreatment" 
                  question="Are you under medical treatment now?" 
                  number={2} 
                />
                {bookingData.medicalHistory.medicalTreatment === 'Yes' && (
                  <div className="mt-[15px] ml-[40px]">
                    <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>If so, what is the condition being treated?</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.medicalCondition || ''}
                      onChange={(e) => handleTextChange('medicalCondition', e.target.value)}
                      className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div className="mb-[30px]">
                <YesNoRadio 
                  field="services" 
                  question="Have you ever had serious illness or surgical operation?" 
                  number={3} 
                />
                {bookingData.medicalHistory.services === 'Yes' && (
                  <div className="mt-[15px] ml-[40px]">
                    <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>If so, what illness or operation?</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.services || ''}
                      onChange={(e) => handleTextChange('services', e.target.value)}
                      className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                )}
              </div>

              {/* Question 4 */}
              <div className="mb-[30px]">
                <YesNoRadio 
                  field="hospitalized" 
                  question="Have you ever been hospitalized?" 
                  number={4} 
                />
                {bookingData.medicalHistory.hospitalized === 'Yes' && (
                  <div className="mt-[15px] ml-[40px]">
                    <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>If so, when and why?</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.hospitalizedWhy || ''}
                      onChange={(e) => handleTextChange('hospitalizedWhy', e.target.value)}
                      className={`w-full px-[20px] py-[16px] border ${errors.hospitalizedWhy ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {errors.hospitalizedWhy && <span className="text-red-500 text-xs mt-1 block">{errors.hospitalizedWhy}</span>}
                  </div>
                )}
              </div>

              {/* Question 5 */}
              <div className="mb-[30px]">
                <YesNoRadio 
                  field="prescriptionMedication" 
                  question="Are you taking any prescription/non-prescription medication?" 
                  number={5} 
                />
                {bookingData.medicalHistory.prescriptionMedication === 'Yes' && (
                  <div className="mt-[15px] ml-[40px]">
                    <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>If so, please specify</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.prescriptionSpecify || ''}
                      onChange={(e) => handleTextChange('prescriptionSpecify', e.target.value)}
                      className={`w-full px-[20px] py-[16px] border ${errors.prescriptionSpecify ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {errors.prescriptionSpecify && <span className="text-red-500 text-xs mt-1 block">{errors.prescriptionSpecify}</span>}
                  </div>
                )}
              </div>

              {/* Question 6 */}
              <YesNoRadio 
                field="tobacco" 
                question="Do you use tobacco products?" 
                number={6} 
              />

              {/* Question 7 */}
              <YesNoRadio 
                field="alcohol" 
                question="Do you use alcohol, cocaine or other dangerous drugs?" 
                number={7} 
              />

              {/* Question 8 - Allergies */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    8
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>8. Are you allergic to any of the following?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[15px] gap-x-[20px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.localAnesthetic || false}
                          onChange={(e) => handleAllergicItemChange('localAnesthetic', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Local Anesthetic (ex. Lidocaine)</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.penicillin || false}
                          onChange={(e) => handleAllergicItemChange('penicillin', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Penicillin, Antibiotics</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.latex || false}
                          onChange={(e) => handleAllergicItemChange('latex', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Latex</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.sulfa || false}
                          onChange={(e) => handleAllergicItemChange('sulfa', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Sulfa Drugs</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.aspirin || false}
                          onChange={(e) => handleAllergicItemChange('aspirin', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Aspirin</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.others || false}
                          onChange={(e) => handleAllergicItemChange('others', e.target.checked)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                        />
                        <span className="text-[14px] font-medium text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Others</span>
                      </label>
                    </div>
                    {errors.allergies && (
                      <span className="text-red-500 text-xs mt-1 block">{errors.allergies}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Question 9 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    9
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>9. Bleeding Time</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.bleedingTime || ''}
                      onChange={(e) => handleTextChange('bleedingTime', e.target.value)}
                      className={`w-full px-[20px] py-[16px] border ${errors.bleedingTime ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {errors.bleedingTime && <span className="text-red-500 text-xs mt-1 block">{errors.bleedingTime}</span>}
                  </div>
                </div>
              </div>

              {/* Question 10 - For women only */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    10
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>10. For women only</p>
                    
                    <div className="space-y-[15px]">
                      <div>
                        <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Are you pregnant?</p>
                        <div className="flex gap-[40px]">
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="pregnant"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.pregnant === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('pregnant', e.target.value)}
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                          </label>
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="pregnant"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.pregnant === 'No'}
                              onChange={(e) => handleWomenOnlyChange('pregnant', e.target.value)}
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Are you nursing?</p>
                        <div className="flex gap-[40px]">
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="nursing"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.nursing === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('nursing', e.target.value)}
                              className={`w-[18px] h-[18px] ${errors.forWomenOnly ? 'border-red-500' : 'text-cosmo-green focus:ring-cosmo-green'} border-[#e8e8e8]`}
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                          </label>
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="nursing"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.nursing === 'No'}
                              onChange={(e) => handleWomenOnlyChange('nursing', e.target.value)}
                              className={`w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]`}
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Are you taking birth control pills?</p>
                        <div className="flex gap-[40px]">
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="birthControl"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.birthControl === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('birthControl', e.target.value)}
                              className={`w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]`}
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                          </label>
                          <label className="flex items-center gap-[8px] cursor-pointer">
                            <input
                              type="radio"
                              name="birthControl"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.birthControl === 'No'}
                              onChange={(e) => handleWomenOnlyChange('birthControl', e.target.value)}
                              className={`w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]`}
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                          </label>
                        </div>
                      </div>
                      
                      {errors.forWomenOnly && (
                        <span className="text-red-500 text-xs mt-1 block">{errors.forWomenOnly}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 11 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    11
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>11. Blood Type</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.bloodType || ''}
                      onChange={(e) => handleTextChange('bloodType', e.target.value)}
                      className={`w-full px-[20px] py-[16px] border ${errors.bloodType ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {errors.bloodType && <span className="text-red-500 text-xs mt-1 block">{errors.bloodType}</span>}
                  </div>
                </div>
              </div>

              {/* Question 12 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    12
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>12. Blood Pressure</p>
                    <input
                      type="text"
                      placeholder="Format: 120/80"
                      value={bookingData.medicalHistory.bloodPressure || ''}
                      onChange={(e) => handleTextChange('bloodPressure', e.target.value)}
                      className={`w-full px-[20px] py-[16px] border ${errors.bloodPressure ? 'border-red-500' : 'border-[#e8e8e8]'} rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]`}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                    {errors.bloodPressure && <span className="text-red-500 text-xs mt-1 block">{errors.bloodPressure}</span>}
                  </div>
                </div>
              </div>

              {/* Question 13 - Medical Conditions */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    13
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>13. Do you have or have you had any of the following? Check which apply</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[15px] gap-x-[20px]">
                      {[
                        'High Blood Pressure', 'Heart Disease', 'Cancer / Tumors',
                        'Low Blood Pressure', 'Heart Murmur', 'Anemia',
                        'Epilepsy / Convulsions', 'Hepatitis / Liver Disease', 'Angina',
                        'AIDS or HIV Infection', 'Rheumatic Fever', 'Emphysema',
                        'Sexually Transmitted Disease', 'Respiratory Problems', 'Bleeding Problems',
                        'Stomach Troubles / Ulcers', 'Hepatitis / Jaundice', 'Blood Diseases',
                        'Fainting Seizure', 'Tuberculosis', 'Head Injuries',
                        'Rapid Healing / Slow Healing', 'Swollen Ankles', 'Joint Replacement / Implant',
                        'Kidney Disease', 'Arthritis / Rheumatism', 'Radiation Therapy',
                        'Sinus Trouble', 'Heart Surgery', 'Heart Attack',
                        'Chest Pain', 'Thyroid Problems', 'Stroke', 'Other'
                      ].map((condition) => (
                        <label key={condition} className="flex items-center gap-[8px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bookingData.medicalHistory.followingConditions?.includes(condition) || false}
                            onChange={(e) => handleConditionChange(condition, e.target.checked)}
                            className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px]"
                          />
                          <span className="text-[13px] font-normal text-[#303030] leading-[normal]" style={{ fontFamily: 'Inter, sans-serif' }}>{condition}</span>
                        </label>
                      ))}
                    </div>
                    {errors.followingConditions && (
                      <span className="text-red-500 text-xs mt-1 block">{errors.followingConditions}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Consent and Acknowledgement */}
              <div className="mb-[30px] border border-[#e8e8e8] rounded-[10px] p-[24px]">
                <h3 className="text-[16px] font-semibold text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Inter, sans-serif' }}>Consent and Acknowledgement</h3>
                
                <div className="mb-[15px]">
                  <label className="flex items-start gap-[8px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAcknowledged}
                      onChange={(e) => setConsentAcknowledged(e.target.checked)}
                      className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px] mt-1 shrink-0"
                    />
                    <span className="text-[13px] font-normal text-[#303030] leading-[normal]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      I acknowledge that I have TRUTHFULLY completed this questionnaire and understand the guidelines. I will seek 
                      assistance from the dental staff if needed. I agree to disclose any past illnesses, medical, and dental history, and 
                      understand that providing incorrect information about medications, allergies, or illnesses can be harmful to my 
                      health. I will inform the dentist or staff of any changes in my health at my next appointment.
                    </span>
                  </label>
                </div>

                <div className="mb-0">
                  <label className="flex items-start gap-[8px]">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8] rounded-[4px] mt-1 shrink-0"
                    />
                    <span className="text-[13px] font-normal text-[#303030] leading-[normal]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      I agree and accept all the details above as well as{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="font-medium text-[#303030] underline hover:text-cosmo-green cursor-pointer bg-transparent border-none p-0"
                      >
                        Terms and Conditions
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPrivacyModal(true);
                        }}
                        className="font-medium text-[#303030] underline hover:text-cosmo-green cursor-pointer bg-transparent border-none p-0"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>
              </div>
              </div>
              <div className="flex-shrink-0 pt-[30px] flex justify-center lg:justify-start gap-[14px]">
                <button 
                  onClick={onBack}
                  className="w-[256px] h-[55px] bg-[#f3f3f3] text-[#242424] rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!isFormValid()}
                  className={`w-[256px] h-[55px] text-white rounded-[8px] text-[16px] font-semibold tracking-[-0.32px] transition-colors flex items-center justify-center ${
                    isFormValid() 
                      ? 'bg-cosmo-green hover:opacity-90 cursor-pointer' 
                      : 'bg-cosmo-green opacity-50 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  Submit
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

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-[24px] font-bold text-[#242424]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Terms and Conditions
              </h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div 
                className="text-[14px] text-[#303030] leading-relaxed prose prose-sm max-w-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
                dangerouslySetInnerHTML={{ 
                  __html: settings?.terms_and_conditions || '<p>Terms and Conditions content not available.</p>' 
                }}
              />
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-cosmo-green text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-[24px] font-bold text-[#242424]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Privacy Policy
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div 
                className="text-[14px] text-[#303030] leading-relaxed prose prose-sm max-w-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
                dangerouslySetInnerHTML={{ 
                  __html: settings?.privacy_policy || '<p>Privacy Policy content not available.</p>' 
                }}
              />
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-cosmo-green text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryComponent;

