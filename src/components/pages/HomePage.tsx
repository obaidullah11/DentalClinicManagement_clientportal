import React, { useState } from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

interface HomePageProps {
  onStartBooking: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartBooking }) => {
  const { settings } = useWebsiteSettings();
  const [logoError, setLogoError] = useState(false);

  // Don't block UI while loading - show default content immediately
  // The dynamic color will update automatically when loaded via CSS variable

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
          {/* Logo overlapping the image - 126×126px container with 8px padding */}
          <div className="absolute top-[-68px]">
            <div className="w-[126px] h-[126px] bg-cosmo-green rounded-[16.8px] flex items-center justify-center p-2">
              <img 
                src={showLogoImage ? logoUrl : "/images/cosmo-dental-logo-1.png"}
                alt="Cosmo Dental Logo"
                className="max-w-full max-h-full object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>

          <div className="pt-[90px] pb-[50px]">
            <h1 className="mb-[8px]" style={{ color: '#242424', fontFamily: 'Inter, sans-serif', fontSize: '42px', fontStyle: 'normal', fontWeight: 700, lineHeight: '43px', letterSpacing: '-0.84px' }}>
              Book your appointment at<br />Cosmodental today!
            </h1>
            <p className="mb-[47px]" style={{ color: 'rgba(0, 0, 0, 0.60)', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.32px' }}>
              Skip the wait and enjoy your Cosmodental treatments. Book your appointment<br />in advance for a smooth and hassle-free dental experience!
            </p>
            <button 
              onClick={onStartBooking} 
              className="cursor-pointer transition-opacity duration-200 hover:opacity-90 border-none"
              style={{ width: '343px', height: '58px', borderRadius: '10px', background: '#00B389', color: '#FFF', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 700, lineHeight: '30px', letterSpacing: '-0.32px' }}
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