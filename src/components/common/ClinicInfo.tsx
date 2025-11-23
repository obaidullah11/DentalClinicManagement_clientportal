import React from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

const ClinicInfo: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const clinicPhotoUrl = settings?.clinic_photo_url || '/images/rectangle-40649.png';

  return (
    <div className="w-full lg:w-[441px] lg:h-[441px] border border-gray-300 rounded-lg p-6 flex-shrink-0 mb-6 lg:mb-0">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <img 
            src={clinicPhotoUrl} 
            alt="Clinic" 
            className="w-full h-32 lg:h-32 object-cover rounded-md"
            onError={(e) => {
              // Fallback to default image if API image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/rectangle-40649.png';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Cosmodental BGC</h3>
          <p className="text-sm text-gray-600 mb-4">8th Floor Stopover Bldg, McKinley Parkway, Bonifacio Global City, Taguig, 1634, Metro Manila</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-700">(02) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-700">(+63) 917 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-700">cosmodental@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-700">Open until 7:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;