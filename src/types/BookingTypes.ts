export interface BookingData {
  patientType: string;
  reason: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  civilStatus: string;
  dateOfBirth: string;
  occupation: string;
  mobileNumber: string;
  emailAddress: string;
  selectedDate: string;
  selectedTime: string;
  howDidYouKnow: string;
  notes: string;
  medicalHistory: MedicalHistory;
}

export interface MedicalHistory {
  generalHealth: string;
  medicalTreatment: string;
  medicalCondition: string;
  services: string;
  hospitalized: string;
  hospitalizedWhy: string;
  prescriptionMedication: string;
  prescriptionSpecify: string;
  tobacco: string;
  alcohol: string;
  allergic: string;
  allergicItems: {
    localAnesthetic: boolean;
    penicillin: boolean;
    sulfa: boolean;
    aspirin: boolean;
    latex: boolean;
    others: boolean;
  };
  bleedingTime: string;
  forWomenOnly: {
    pregnant: string;
    nursing: string;
    birthControl: string;
  };
  bloodType: string;
  bloodPressure: string;
  followingConditions: string[];
}