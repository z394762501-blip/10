import React from 'react';
import { LanguageContext, useLanguageProvider } from '../hooks/useLanguage';

interface LanguageProviderWrapperProps {
  children: React.ReactNode;
}

export default function LanguageProviderWrapper({ children }: LanguageProviderWrapperProps) {
  const languageContextValue = useLanguageProvider();

  return (
    <LanguageContext.Provider value={languageContextValue}>
      {children}
    </LanguageContext.Provider>
  );
}