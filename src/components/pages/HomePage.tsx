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
    <div className="w-screen h-screen bg-white font-sans overflow-hidden">
      <div className="w-full h-full bg-white">
        <div className="w-full h-full relative flex flex-col lg:max-w-[1920px] lg:max-h-[1080px] lg:mx-auto">
          <div 
            className="w-full h-[220px] lg:h-[220px] bg-cover bg-center bg-no-repeat relative flex-shrink-0" 
            style={{backgroundImage: `url(${headerImageUrl})`}}
          >
            <div className="w-full h-full bg-black bg-opacity-50"></div>
          </div>
          <div className="px-4 lg:px-16 py-6 bg-white flex-1 flex flex-col items-start justify-center overflow-hidden">
            <div className="mb-5">
              {showLogoImage ? (
                <img 
                  src={logoUrl} 
                  alt="Clinic Logo" 
                  className="w-16 h-16 object-contain"
                  onError={() => {
                    setLogoError(true);
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-cosmo-green rounded-lg p-3 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded"></div>
                </div>
              )}
            </div>
            <div className="max-w-full lg:max-w-[550px]">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 leading-tight mb-4">
                Book your appointment at<br className="hidden lg:block" />
                <span className="lg:hidden"> </span>Cosmodental today!
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Take the wait out of enjoying your Cosmodental treatment, book your appointment in advance for a smooth and hassle-free dental experience!
              </p>
              <button 
                onClick={onStartBooking} 
                className="w-full lg:w-auto bg-cosmo-green text-white border-none rounded-md px-6 py-3 text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-700"
              >
                I'll make an appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;