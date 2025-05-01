import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SettingsContext = createContext();

// Custom hook to use the settings context
export function useSettings() {
  return useContext(SettingsContext);
}

// Provider component
export function SettingsProvider({ children, initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(!initialSettings);

  // Fetch settings if not provided as props
  useEffect(() => {
    if (!initialSettings) {
      const fetchSettings = async () => {
        try {
          const response = await fetch('/api/settings');
          if (!response.ok) {
            throw new Error('Failed to fetch settings');
          }
          const data = await response.json();
          setSettings(data);
        } catch (error) {
          console.error('Error fetching settings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSettings();
    }
  }, [initialSettings]);

  const value = {
    settings,
    loading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
