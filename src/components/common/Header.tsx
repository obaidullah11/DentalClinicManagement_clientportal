import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="w-full bg-white h-[65px] shadow-[0px_4px_4px_0px_rgba(219,219,219,0.2)] flex justify-center">
      <div className="w-full max-w-[1342px] px-4 lg:px-0 flex items-center h-full">
        <p className="font-bold text-[16px] text-[#2a2a2a] tracking-[-0.32px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Cosmodental
        </p>
      </div>
    </div>
  );
};

export default Header;
