import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WebsiteSettings {
  id: number;
  clinic_id: number | null;
  header_photo_url: string;
  clinic_photo_url: string;
  logo_url: string;
  primary_color: string;
  procedure_choices: string[];
  terms_and_conditions: string;
  privacy_policy: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_name: string;
}

interface WebsiteSettingsContextType {
  settings: WebsiteSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextType | undefined>(undefined);

export const useWebsiteSettings = () => {
  const context = useContext(WebsiteSettingsContext);
  if (!context) {
    throw new Error('useWebsiteSettings must be used within WebsiteSettingsProvider');
  }
  return context;
};

interface WebsiteSettingsProviderProps {
  children: ReactNode;
}

const API_URL = 'http://127.0.0.1:8000/api/public/website-settings';

export const WebsiteSettingsProvider: React.FC<WebsiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setSettings(result.data);
          
          // Update CSS variable for primary color dynamically
          if (result.data.primary_color) {
            document.documentElement.style.setProperty('--primary-color', result.data.primary_color);
          }
        } else {
          throw new Error(result.message || 'Failed to load website settings');
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? (err.name === 'AbortError' 
          ? 'Request timeout. Please check your connection.' 
          : err.message)
        : 'An error occurred while fetching website settings';
      setError(errorMessage);
      console.error('Error fetching website settings:', err);
      
      // Set default primary color on error
      document.documentElement.style.setProperty('--primary-color', '#00B389');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, error, refetch: fetchSettings }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};

