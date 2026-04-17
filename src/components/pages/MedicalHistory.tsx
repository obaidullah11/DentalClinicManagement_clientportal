import React, { useState } from 'react';
import ClinicInfo from '../common/ClinicInfo';
import Header from '../common/Header';
import { BookingData, MedicalHistory } from '../../types/BookingTypes';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

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

  const handleYesNoChange = (field: keyof MedicalHistory, value: string) => {
    updateMedicalHistory(field, value);
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

    // Validate conditional required fields
    if (bookingData.medicalHistory.hospitalized === 'Yes') {
      if (!bookingData.medicalHistory.hospitalizedWhy || !bookingData.medicalHistory.hospitalizedWhy.trim()) {
        newErrors.hospitalizedWhy = 'Please specify when and why you were hospitalized';
      } else if (bookingData.medicalHistory.hospitalizedWhy.length > 500) {
        newErrors.hospitalizedWhy = 'Response must not exceed 500 characters';
      }
    }

    if (bookingData.medicalHistory.prescriptionMedication === 'Yes') {
      if (!bookingData.medicalHistory.prescriptionSpecify || !bookingData.medicalHistory.prescriptionSpecify.trim()) {
        newErrors.prescriptionSpecify = 'Please specify the medication you are taking';
      } else if (bookingData.medicalHistory.prescriptionSpecify.length > 500) {
        newErrors.prescriptionSpecify = 'Response must not exceed 500 characters';
      }
    }

    // Validate blood pressure format if provided
    if (bookingData.medicalHistory.bloodPressure && bookingData.medicalHistory.bloodPressure.trim()) {
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
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = bookingData.medicalHistory.followingConditions || [];
    
    if (checked) {
      updateMedicalHistory('followingConditions', [...currentConditions, condition]);
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
                className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
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
                className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
              />
              <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
            </label>
          </div>
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
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>2. Are you under medical treatment now?</p>
                    <div className="flex gap-[40px] mb-[15px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="medicalTreatment"
                          value="Yes"
                          checked={bookingData.medicalHistory.medicalTreatment === 'Yes'}
                          onChange={(e) => handleYesNoChange('medicalTreatment', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="medicalTreatment"
                          value="No"
                          checked={bookingData.medicalHistory.medicalTreatment === 'No'}
                          onChange={(e) => handleYesNoChange('medicalTreatment', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.medicalTreatment === 'Yes' && (
                      <div className="mt-[15px]">
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
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>3. Have you ever had serious illness or surgical operation?</p>
                    <div className="flex gap-[40px] mb-[15px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="services"
                          value="Yes"
                          checked={bookingData.medicalHistory.services === 'Yes'}
                          onChange={(e) => handleYesNoChange('services', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="services"
                          value="No"
                          checked={bookingData.medicalHistory.services === 'No'}
                          onChange={(e) => handleYesNoChange('services', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.services === 'Yes' && (
                      <div className="mt-[15px]">
                        <p className="text-[14px] text-[#303030] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>If so, what illness or operation?</p>
                        <input
                          type="text"
                          placeholder="State your answer here..."
                          className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]"
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question 4 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>4. Have you ever been hospitalized?</p>
                    <div className="flex gap-[40px] mb-[15px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="Yes"
                          checked={bookingData.medicalHistory.hospitalized === 'Yes'}
                          onChange={(e) => handleYesNoChange('hospitalized', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="No"
                          checked={bookingData.medicalHistory.hospitalized === 'No'}
                          onChange={(e) => handleYesNoChange('hospitalized', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.hospitalized === 'Yes' && (
                      <div className="mt-[15px]">
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
                </div>
              </div>

              {/* Question 5 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    5
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>5. Are you taking any prescription/non-prescription medication?</p>
                    <div className="flex gap-[40px] mb-[15px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="prescriptionMedication"
                          value="Yes"
                          checked={bookingData.medicalHistory.prescriptionMedication === 'Yes'}
                          onChange={(e) => handleYesNoChange('prescriptionMedication', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="prescriptionMedication"
                          value="No"
                          checked={bookingData.medicalHistory.prescriptionMedication === 'No'}
                          onChange={(e) => handleYesNoChange('prescriptionMedication', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.prescriptionMedication === 'Yes' && (
                      <div className="mt-[15px]">
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
                </div>
              </div>

              {/* Question 6 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    6
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>6. Do you use tobacco products?</p>
                    <div className="flex gap-[40px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="tobacco"
                          value="Yes"
                          checked={bookingData.medicalHistory.tobacco === 'Yes'}
                          onChange={(e) => handleYesNoChange('tobacco', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="tobacco"
                          value="No"
                          checked={bookingData.medicalHistory.tobacco === 'No'}
                          onChange={(e) => handleYesNoChange('tobacco', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 7 */}
              <div className="mb-[30px]">
                <div className="flex items-start gap-[16px]">
                  <div className="w-[24px] h-[24px] bg-cosmo-green text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    7
                  </div>
                  <div className="flex-1">
                    <p className="text-[16px] font-normal text-[#242424] mb-[15px] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>7. Do you use alcohol, cocaine or other dangerous drugs?</p>
                    <div className="flex gap-[40px]">
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="alcohol"
                          value="Yes"
                          checked={bookingData.medicalHistory.alcohol === 'Yes'}
                          onChange={(e) => handleYesNoChange('alcohol', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="alcohol"
                          value="No"
                          checked={bookingData.medicalHistory.alcohol === 'No'}
                          onChange={(e) => handleYesNoChange('alcohol', e.target.value)}
                          className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                        />
                        <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

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
                      className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
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
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
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
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
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
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
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
                              className="w-[18px] h-[18px] text-cosmo-green focus:ring-cosmo-green border-[#e8e8e8]"
                            />
                            <span className="text-[16px] font-medium text-[#242424] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>No</span>
                          </label>
                        </div>
                      </div>
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
                      className="w-full px-[20px] py-[16px] border border-[#e8e8e8] rounded-[8px] text-[14px] h-[55px] font-medium focus:outline-none focus:border-cosmo-green placeholder:text-[#9f9f9f] tracking-[-0.28px]"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
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

