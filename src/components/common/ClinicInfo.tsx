import React from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

const ClinicInfo: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const clinicPhotoUrl = settings?.clinic_photo_url || '/images/rectangle-40649.png';

  return (
    <div className="w-full lg:w-[441px] lg:h-[441px] border border-[#ddd] rounded-[8px] flex-shrink-0 mb-6 lg:mb-0 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="mb-0">
          <img 
            src={clinicPhotoUrl} 
            alt="Clinic" 
            className="w-full h-[189px] object-cover rounded-tl-[8px] rounded-tr-[8px]"
            onError={(e) => {
              // Fallback to default image if API image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/rectangle-40649.png';
            }}
          />
        </div>
        <div className="flex-1 px-6 pt-4">
          <h3 className="text-[20px] font-bold text-[#242424] mb-2 tracking-[-0.4px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Cosmodental BGC</h3>
          <p className="text-[14px] text-[#242424] mb-4 tracking-[-0.28px] underline" style={{ fontFamily: 'Manrope, sans-serif' }}>6th floor, Premier Bldg., McKinley Parkway, Bonifacio Global City, Taguig, 1634, Metro Manila</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/images/phone.svg" alt="Phone" className="w-[18px] h-[18px]" />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>(02) 123 456</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/smartphone.svg" alt="Mobile" className="w-[18px] h-[18px]" />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>(+63) 912 345 6789</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/mail.svg" alt="Email" className="w-[18px] h-[18px]" />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>cosmodental@email.com</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="/images/clock-4.svg" alt="Clock" className="w-[18px] h-[18px]" />
              <span className="text-[14px] text-[#242424] tracking-[-0.28px]" style={{ fontFamily: 'Manrope, sans-serif' }}>Open until 7:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;