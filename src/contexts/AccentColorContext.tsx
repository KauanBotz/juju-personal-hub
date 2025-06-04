import React, { createContext, useContext, useEffect, useState } from 'react';

type AccentColor = 'pink' | 'purple' | 'blue' | 'green';

interface AccentColorContextType {
  color: AccentColor;
  setColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

const colorMap: Record<AccentColor, string> = {
  pink: '330.4 81% 60%',
  purple: '270.7 91% 65%',
  blue: '217.2 91% 60%',
  green: '160.1 84% 39%',
};

const applyColor = (color: AccentColor) => {
  const value = colorMap[color];
  document.documentElement.style.setProperty('--primary', value);
  document.documentElement.style.setProperty('--sidebar-ring', value);
};

export const AccentColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<AccentColor>('pink');

  useEffect(() => {
    const saved = localStorage.getItem('accentColor') as AccentColor | null;
    if (saved) {
      setColor(saved);
      applyColor(saved);
    } else {
      applyColor('pink');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accentColor', color);
    applyColor(color);
  }, [color]);

  return (
    <AccentColorContext.Provider value={{ color, setColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};
