import React from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';
import Header from '../common/Header';

interface PrivacyPolicyProps {
  onNext?: () => void;
  onBack?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNext, onBack }) => {
  const { settings, loading } = useWebsiteSettings();

  const privacyContent = settings?.privacy_policy || `<p style="margin-bottom: 0;">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p><p style="margin-bottom: 0;">&nbsp;</p><p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>`;

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#242424] font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      <div className="flex-1 w-full bg-white flex flex-col items-center pt-[53px] pb-[100px]">
        <h1 
          className="m-0 mb-[47px]" 
          style={{ color: '#00B389', fontFamily: 'Manrope, sans-serif', fontSize: '24px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal', letterSpacing: '-0.48px' }}
        >
          Privacy Policy
        </h1>

        <div 
          className="w-full max-w-[1288px] px-4 lg:px-0"
          style={{ color: '#242424', fontFamily: 'Manrope, sans-serif', fontSize: '18px', fontStyle: 'normal', fontWeight: 500, lineHeight: '30px', letterSpacing: '-0.36px' }}
          dangerouslySetInnerHTML={{ __html: privacyContent }}
        />
        
        {(onBack || onNext) && (
          <div className="flex justify-center gap-4 mt-12 w-full max-w-[1288px]">
            {onBack && (
              <button 
                onClick={onBack} 
                className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Back
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext} 
                className="bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;

