import React from 'react';
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext';

const BookingDisabled: React.FC = () => {
  const { settings } = useWebsiteSettings();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Online Booking Currently Unavailable
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          We're sorry, but online appointment booking is temporarily disabled. 
          Please contact us directly to schedule your appointment.
        </p>

        {/* Contact Information */}
        {settings && (
          <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
            <h2 className="font-semibold text-gray-900 mb-3">Contact Us:</h2>
            
            {settings.clinic_name && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">{settings.clinic_name}</p>
                </div>
              </div>
            )}

            {settings.mobile_number && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Mobile: {settings.mobile_number}</p>
                </div>
              </div>
            )}

            {settings.telephone_number && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Phone: {settings.telephone_number}</p>
                </div>
              </div>
            )}

            {settings.clinic_email && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Email: {settings.clinic_email}</p>
                </div>
              </div>
            )}

            {settings.address && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">{settings.address}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Message */}
        <p className="text-sm text-gray-500 mt-6">
          We apologize for any inconvenience and look forward to serving you.
        </p>
      </div>
    </div>
  );
};

export default BookingDisabled;
