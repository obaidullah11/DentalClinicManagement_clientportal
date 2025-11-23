import React from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

interface TermsAndConditionsProps {
  onNext: () => void;
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onNext, onBack }) => {
  const { settings, loading } = useWebsiteSettings();

  const termsContent = settings?.terms_and_conditions || '<p>No terms and conditions available.</p>';

  if (loading && !settings) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen max-w-[1920px] max-h-[1080px] bg-white font-sans overflow-hidden">
      <div className="w-full h-full bg-white">
        <div className="w-full h-full bg-white flex flex-col items-center justify-start p-8 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-8">Cosmodental</h2>
              <h1 className="text-2xl font-bold text-cosmo-green mb-12">Terms and Conditions</h1>
            </div>

            <div 
              className="text-sm text-gray-700 leading-relaxed space-y-4 mb-8 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: termsContent }}
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button onClick={onNext} className="bg-cosmo-green text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;