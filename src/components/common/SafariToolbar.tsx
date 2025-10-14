import React from 'react';

const SafariToolbar: React.FC = () => (
  <div className="w-full h-7 bg-gray-100 border-b border-gray-300 flex items-center px-2 relative flex-shrink-0">
    <div className="flex items-center">
      <img src="/images/core-safari-big-sur-toolbar-core-traffic-lights-big-sur.svg" alt="Traffic Lights" className="h-4" />
    </div>
    <div className="flex items-center gap-2 ml-5">
      <img src="/images/core-safari-big-sur-toolbar-core-safari-big-sur-toolbar-toolbar-item.svg" alt="Toolbar Item" className="h-4" />
      <img src="/images/core-safari-big-sur-toolbar-core-safari-big-sur-toolbar-toolbar-item-7.svg" alt="Toolbar Item 7" className="h-4" />
    </div>
    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-black bg-opacity-5 rounded px-2.5 py-1 min-w-[250px] justify-center">
      <img src="/images/core-safari-big-sur-toolbar-core-safari-big-sur-lock.svg" alt="Lock" className="h-3" />
      <span className="text-xs text-gray-700">cosmodental.network.com</span>
    </div>
  </div>
);

export default SafariToolbar;