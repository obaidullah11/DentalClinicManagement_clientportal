import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '1241px', height: '1px', background: '#DDD', maxWidth: '100%' }} />
      <div className="w-full max-w-[1241px] flex justify-between items-end px-4 lg:px-0 pt-[18px] pb-[32px]">
        <div className="flex flex-col gap-[2px]">
          <span style={{ color: 'rgba(42, 42, 42, 0.50)', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.24px' }}>
            Branding and Contents by
          </span>
          <span style={{ color: '#2A2A2A', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal', letterSpacing: '-0.32px' }}>
            Cosmodental
          </span>
        </div>
        <div className="flex flex-col gap-[2px] items-end">
          <span style={{ color: 'rgba(42, 42, 42, 0.50)', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal', letterSpacing: '-0.24px' }}>
            Brought to you by
          </span>
          <span style={{ color: '#2A2A2A', fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal', letterSpacing: '-0.32px' }}>
            © 2025, Cosmodental powered by Reserva
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
