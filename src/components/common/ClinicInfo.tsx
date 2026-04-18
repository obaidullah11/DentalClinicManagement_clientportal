import React, { useState, useEffect } from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

interface ClinicSettings {
  clinic_name: string;
  address: string;
  mobile_number: string;
  telephone_number: string;
  clinic_email: string;
  clinic_hours_start: string;
  clinic_hours_end: string;
  clinic_days: string[];
}

const ClinicInfo: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
  const clinicPhotoUrl = settings?.clinic_photo_url || '/images/rectangle-40649.png';

  useEffect(() => {
    fetchClinicSettings();
  }, []);

  const fetchClinicSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/document-settings`);
      const result = await response.json();
      console.log('📋 Clinic settings API response:', result);
      if (result.success && result.data?.clinic) {
        console.log('✅ Clinic data:', result.data.clinic);
        setClinicSettings(result.data.clinic);
      } else {
        console.warn('⚠️ No clinic data in response');
      }
    } catch (error) {
      console.error('❌ Failed to fetch clinic settings:', error);
    }
  };

  return (
    <div className="w-full lg:w-[441px] lg:h-[441px] border border-[#ddd] rounded-[8px] flex-shrink-0 mb-6 lg:mb-0 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="mb-0">
          <img 
            src={clinicPhotoUrl} 
            alt="Clinic" 
            className="w-full h-[189px] object-cover rounded-tl-[8px] rounded-tr-[8px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/rectangle-40649.png';
            }}
          />
        </div>
        <div className="flex-1 px-6 pt-4">
          <h3 className="mb-2" style={{ color: '#242424', fontFamily: 'Manrope, sans-serif', fontSize: '20px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal', letterSpacing: '-0.4px' }}>
            {clinicSettings?.clinic_name && clinicSettings.clinic_name.trim() !== '' ? clinicSettings.clinic_name : 'Cosmodental BGC'}
          </h3>
          <p className="mb-4" style={{ color: '#242424', fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.28px', textDecorationLine: 'underline', textDecorationStyle: 'solid', textDecorationSkipInk: 'auto', textDecorationThickness: 'auto', textUnderlineOffset: 'auto', textUnderlinePosition: 'from-font' }}>
            {clinicSettings?.address && clinicSettings.address.trim() !== '' ? clinicSettings.address : '6th floor, Premier Bldg., McKinley Parkway, Bonifacio Global City, Taguig, 1634, Metro Manila'}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/images/phone.svg" alt="Phone" style={{ width: '18px', height: '18px', aspectRatio: '1/1' }} />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {clinicSettings?.telephone_number && clinicSettings.telephone_number.trim() !== '' ? clinicSettings.telephone_number : '(02) 123 456'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/smartphone.svg" alt="Mobile" style={{ width: '18px', height: '18px', aspectRatio: '1/1' }} />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {clinicSettings?.mobile_number && clinicSettings.mobile_number.trim() !== '' ? clinicSettings.mobile_number : '(+63) 912 345 6789'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/mail.svg" alt="Email" style={{ width: '18px', height: '18px', aspectRatio: '1/1' }} />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {clinicSettings?.clinic_email && clinicSettings.clinic_email.trim() !== '' ? clinicSettings.clinic_email : 'cosmodental@email.com'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/clock-4.svg" alt="Clock" style={{ width: '18px', height: '18px', aspectRatio: '1/1' }} />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Open until {clinicSettings?.clinic_hours_end && clinicSettings.clinic_hours_end.trim() !== '' ? clinicSettings.clinic_hours_end : '7:00 PM'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;