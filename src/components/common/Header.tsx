import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="w-full flex justify-center" style={{ height: '65px', background: '#FFF', boxShadow: '0 4px 4px 0 rgba(219, 219, 219, 0.20)' }}>
      <div className="w-full max-w-[1342px] px-4 lg:px-0 flex items-center h-full">
        <p style={{ color: '#2A2A2A', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal', letterSpacing: '-0.32px', margin: 0 }}>
          Cosmodental
        </p>
      </div>
    </div>
  );
};

export default Header;
