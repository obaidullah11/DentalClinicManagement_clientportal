import React from 'react';
import ClinicInfo from '../common/ClinicInfo';
import { BookingData, MedicalHistory } from '../../types/BookingTypes';

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
  const handleYesNoChange = (field: keyof MedicalHistory, value: string) => {
    updateMedicalHistory(field, value);
  };

  const handleTextChange = (field: keyof MedicalHistory, value: string) => {
    updateMedicalHistory(field, value);
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
    <div className="mb-4">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
          {number}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 mb-3">{question}</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={field}
                value="Yes"
                checked={bookingData.medicalHistory[field] === 'Yes'}
                onChange={(e) => handleYesNoChange(field, e.target.value)}
                className="text-blue-500"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={field}
                value="No"
                checked={bookingData.medicalHistory[field] === 'No'}
                onChange={(e) => handleYesNoChange(field, e.target.value)}
                className="text-blue-500"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-full bg-white">
        <div className="w-full bg-white flex flex-col lg:flex-row lg:items-start lg:justify-center p-4 lg:p-8 lg:max-w-6xl lg:mx-auto min-h-screen">
          <div className="flex-1 flex flex-col lg:pr-8">
              <div className="mb-6 lg:mb-8 flex-shrink-0">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Cosmodental</h2>
                <h1 className="text-xl lg:text-2xl font-bold text-cosmo-green mb-6 lg:mb-8">Book your Appointment</h1>
              </div>

              {/* Clinic Info - Mobile Only */}
              <div className="lg:hidden mb-6 flex-shrink-0">
                <ClinicInfo />
              </div>

              <div className="mb-6 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Medical History</h2>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 lg:-mr-4">

              {/* Question 1 */}
              <YesNoRadio 
                field="generalHealth" 
                question="Are you in good health?" 
                number={1} 
              />

              {/* Question 2 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Are you under medical treatment now?</p>
                    <div className="flex gap-6 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="medicalTreatment"
                          value="Yes"
                          checked={bookingData.medicalHistory.medicalTreatment === 'Yes'}
                          onChange={(e) => handleYesNoChange('medicalTreatment', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="medicalTreatment"
                          value="No"
                          checked={bookingData.medicalHistory.medicalTreatment === 'No'}
                          onChange={(e) => handleYesNoChange('medicalTreatment', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.medicalTreatment === 'Yes' && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">If so, what is the condition being treated?</p>
                        <input
                          type="text"
                          placeholder="State your answer here..."
                          value={bookingData.medicalHistory.medicalCondition || ''}
                          onChange={(e) => handleTextChange('medicalCondition', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Have you ever had serious illness or surgical operation?</p>
                    <div className="flex gap-6 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="services"
                          value="Yes"
                          checked={bookingData.medicalHistory.services === 'Yes'}
                          onChange={(e) => handleYesNoChange('services', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="services"
                          value="No"
                          checked={bookingData.medicalHistory.services === 'No'}
                          onChange={(e) => handleYesNoChange('services', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.services === 'Yes' && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">If so, what illness or operation?</p>
                        <input
                          type="text"
                          placeholder="State your answer here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question 4 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Have you ever been hospitalized</p>
                    <div className="flex gap-6 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="Yes"
                          checked={bookingData.medicalHistory.hospitalized === 'Yes'}
                          onChange={(e) => handleYesNoChange('hospitalized', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="No"
                          checked={bookingData.medicalHistory.hospitalized === 'No'}
                          onChange={(e) => handleYesNoChange('hospitalized', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.hospitalized === 'Yes' && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">If so, when and why?</p>
                        <input
                          type="text"
                          placeholder="State your answer here..."
                          value={bookingData.medicalHistory.hospitalizedWhy || ''}
                          onChange={(e) => handleTextChange('hospitalizedWhy', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Question 5 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Are you taking any prescription/non-prescription medication?</p>
                    <div className="flex gap-6 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="prescriptionMedication"
                          value="Yes"
                          checked={bookingData.medicalHistory.prescriptionMedication === 'Yes'}
                          onChange={(e) => handleYesNoChange('prescriptionMedication', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="prescriptionMedication"
                          value="No"
                          checked={bookingData.medicalHistory.prescriptionMedication === 'No'}
                          onChange={(e) => handleYesNoChange('prescriptionMedication', e.target.value)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    {bookingData.medicalHistory.prescriptionMedication === 'Yes' && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">If so, please specify</p>
                        <input
                          type="text"
                          placeholder="State your answer here..."
                          value={bookingData.medicalHistory.prescriptionSpecify || ''}
                          onChange={(e) => handleTextChange('prescriptionSpecify', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
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
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    8
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Are you allergic to any of the following</p>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.localAnesthetic || false}
                          onChange={(e) => handleAllergicItemChange('localAnesthetic', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Local Anesthetic (ex. Lidocaine)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.penicillin || false}
                          onChange={(e) => handleAllergicItemChange('penicillin', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Penicillin, Antibiotics</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.latex || false}
                          onChange={(e) => handleAllergicItemChange('latex', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Latex</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.sulfa || false}
                          onChange={(e) => handleAllergicItemChange('sulfa', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Sulfa Drugs</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.aspirin || false}
                          onChange={(e) => handleAllergicItemChange('aspirin', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Aspirin</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={bookingData.medicalHistory.allergicItems?.others || false}
                          onChange={(e) => handleAllergicItemChange('others', e.target.checked)}
                          className="text-blue-500"
                        />
                        <span className="text-sm text-gray-700">Others</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 9 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    9
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Bleeding Time</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.bleedingTime || ''}
                      onChange={(e) => handleTextChange('bleedingTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Question 10 - For women only */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    10
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">For women only</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Are you pregnant?</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pregnant"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.pregnant === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('pregnant', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pregnant"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.pregnant === 'No'}
                              onChange={(e) => handleWomenOnlyChange('pregnant', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-2">Are you nursing?</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="nursing"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.nursing === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('nursing', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="nursing"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.nursing === 'No'}
                              onChange={(e) => handleWomenOnlyChange('nursing', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-2">Are you taking birth control pills?</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="birthControl"
                              value="Yes"
                              checked={bookingData.medicalHistory.forWomenOnly?.birthControl === 'Yes'}
                              onChange={(e) => handleWomenOnlyChange('birthControl', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="birthControl"
                              value="No"
                              checked={bookingData.medicalHistory.forWomenOnly?.birthControl === 'No'}
                              onChange={(e) => handleWomenOnlyChange('birthControl', e.target.value)}
                              className="text-blue-500"
                            />
                            <span className="text-sm text-gray-700">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 11 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    11
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Blood Type</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.bloodType || ''}
                      onChange={(e) => handleTextChange('bloodType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Question 12 */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    12
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-3">Blood Pressure</p>
                    <input
                      type="text"
                      placeholder="State your answer here..."
                      value={bookingData.medicalHistory.bloodPressure || ''}
                      onChange={(e) => handleTextChange('bloodPressure', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Question 13 - Medical Conditions */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-6 h-6 bg-cosmo-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    13
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-4">Do you have or have you had any of the following? Check which apply</p>
                    
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-xs">
                      {[
                        'High Blood Pressure', 'Heart Disease', 'Cancer / Tumors',
                        'Low Blood Pressure', 'Heart Murmur', 'Anemia',
                        'Epilepsy / Convulsions', 'Hepatitis / Liver Disease', 'Angina',
                        'AIDS or HIV Infection', 'Rheumatic Fever', 'Emphysema',
                        'Sexually Transmitted Disease', 'Respiratory Problems', 'Bleeding Problems',
                        'Stomach Troubles / Ulcers', 'Hepatitis / Jaundice', 'Blood Diseases',
                        'Fainting Seizure', 'Tuberculosis', 'Head Injuries',
                        'Rapid Healing / Slow Healing', 'Swollen Ankles', 'Blood Diseases',
                        'Joint Replacement / Implant', 'Kidney Disease', 'Arthritis / Rheumatism',
                        'Radiation Therapy', 'Sinus Trouble', 'Other',
                        'Heart Surgery', 'Kidney Disease',
                        'Heart Attack', 'Chest Pain',
                        'Thyroid Problems', 'Stroke'
                      ].map((condition) => (
                        <label key={condition} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={bookingData.medicalHistory.followingConditions?.includes(condition) || false}
                            onChange={(e) => handleConditionChange(condition, e.target.checked)}
                            className="text-blue-500"
                          />
                          <span className="text-gray-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent and Acknowledgement */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-cosmo-green mb-4">Consent and Acknowledgement</h3>
                
                <div className="mb-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="text-blue-500 mt-1"
                    />
                    <span className="text-xs text-gray-700 leading-relaxed">
                      I acknowledge that I have TRUTHFULLY completed this questionnaire and understand the guidelines. I will seek 
                      assistance from the dental staff if needed. I agree to disclose any diseases, medical, and dental history, and 
                      understand that providing incorrect information about medications, allergies, or illnesses can be harmful to my 
                      health. I will inform the dentist or staff of any changes to my health at my next appointment.
                    </span>
                  </label>
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="text-blue-500 mt-1"
                    />
                    <span className="text-xs text-gray-700">
                      I agree and accept all the details above as well as <span className="text-cosmo-green underline">Terms and Conditions</span> and <span className="text-cosmo-green underline">Privacy Policy</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Buttons - Fixed at bottom with proper spacing */}
              <div className="flex-shrink-0 pt-6 pb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <button 
                    onClick={onBack}
                    className="w-full lg:w-auto px-8 py-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={onNext}
                    className="w-full lg:w-auto bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Clinic Info - Desktop Only */}
            <div className="hidden lg:block flex-shrink-0">
              <ClinicInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryComponent;