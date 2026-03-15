import React, { useState } from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

interface HomePageProps {
  onStartBooking: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartBooking }) => {
  const { settings, loading } = useWebsiteSettings();
  const [logoError, setLogoError] = useState(false);

  // Show loading state only if we don't have settings yet
  if (loading && !settings) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const headerImageUrl = settings?.header_photo_url || '/images/image-30.png';
  const logoUrl = settings?.logo_url;
  const showLogoImage = logoUrl && !logoError;

  return (
    <div className="w-screen min-h-screen bg-white font-sans overflow-x-hidden">
      <div className="w-full flex flex-col items-center">
        <div 
          className="w-full h-[310px] bg-cover bg-center bg-no-repeat relative flex-shrink-0" 
          style={{backgroundImage: `url(${headerImageUrl})`}}
        >
          <div className="w-full h-full bg-black bg-opacity-50"></div>
        </div>
        
        <div className="w-full max-w-[1242px] px-4 lg:px-0 relative">
          {/* Logo overlapping the image */}
          <div className="absolute top-[-68px]">
            <div className="w-[126px] h-[126px] bg-[#00b389] rounded-[16.8px] flex items-center justify-center p-2">
              <img 
                src={showLogoImage ? logoUrl : "/images/cosmo-dental-logo-1.png"}
                alt="Cosmo Dental Logo"
                className="w-[84.67px] h-[91.89px] object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>

          <div className="pt-[90px] pb-[50px]">
            <h1 className="text-[42px] font-bold text-[#242424] leading-[43px] tracking-[-0.84px] mb-[8px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Book your appointment at<br />Cosmodental today!
            </h1>
            <p className="text-[16px] font-normal text-[rgba(0,0,0,0.6)] leading-[normal] tracking-[-0.32px] mb-[47px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Skip the wait and enjoy your Cosmodental treatments. Book your appointment<br />in advance for a smooth and hassle-free dental experience!
            </p>
            <button 
              onClick={onStartBooking} 
              className="w-[343px] h-[58px] bg-[#00b389] text-white border-none rounded-[10px] text-[16px] font-bold tracking-[-0.32px] cursor-pointer transition-colors duration-200 hover:bg-[#009673]"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              I'll make an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;