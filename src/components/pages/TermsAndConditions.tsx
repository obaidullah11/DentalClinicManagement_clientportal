import React from 'react';

interface TermsAndConditionsProps {
  onNext: () => void;
  onBack: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onNext, onBack }) => {
  return (
    <div className="w-screen h-screen max-w-[1920px] max-h-[1080px] bg-white font-sans overflow-hidden">
      <div className="w-full h-full bg-white">
        <div className="w-full h-full bg-white flex flex-col items-center justify-start p-8">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-8">Cosmodental</h2>
              <h1 className="text-2xl font-bold text-cosmo-green mb-12">Terms and Conditions</h1>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed space-y-4 mb-8">
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum
                passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33
                of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular
                during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
              </p>

              <p>
                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
                Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
              </p>
            </div>

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