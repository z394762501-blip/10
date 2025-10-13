import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../hooks/useLanguage';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="en">{t('common.english')}</option>
          <option value="zh">{t('common.chinese')}</option>
        </select>
      </div>
    </div>
  );
}