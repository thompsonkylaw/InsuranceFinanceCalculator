import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('zh_HK')}>繁體中文</button>
      <button onClick={() => i18n.changeLanguage('zh_CN')}>简體中文</button>
    </div>
  );
}

export default LanguageSwitcher;