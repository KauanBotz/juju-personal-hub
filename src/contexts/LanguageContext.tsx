
import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    login: 'Login',
    home: 'Início',
    calendar: 'Calendário',
    notes: 'Notas',
    habits: 'Hábitos',
    actionPlan: 'Plano de Ação',
    readingList: 'Lista de Leitura',
    notebook: 'Caderno',
    settings: 'Configurações',
    welcome: 'Bem-vinda',
    logout: 'Sair'
  },
  en: {
    login: 'Login',
    home: 'Home',
    calendar: 'Calendar',
    notes: 'Notes',
    habits: 'Habits',
    actionPlan: 'Action Plan',
    readingList: 'Reading List',
    notebook: 'Notebook',
    settings: 'Settings',
    welcome: 'Welcome',
    logout: 'Logout'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
