import React from 'react';

const ClinicInfo: React.FC = () => (
  <div className="w-full lg:w-[441px] lg:h-[441px] border border-gray-300 rounded-lg p-6 flex-shrink-0 mb-6 lg:mb-0">
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <img src="/images/rectangle-40649.png" alt="Cosmodental Clinic" className="w-full h-32 lg:h-32 object-cover rounded-md" />
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

export default ClinicInfo;