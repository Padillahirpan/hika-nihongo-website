'use client';

import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import { useTheme } from '../../contexts/theme-context';
import { useLanguage } from '../../contexts/language-context';
import Modal from '../../components/Modal';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const resetData = () => {
    localStorage.removeItem('hiraganaDataProgress');
    localStorage.removeItem('katakanaDataProgress');
    router.refresh();
  };

  const handleBackToHome = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-japan-white-off dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* Back Button */}
        <BackButton 
          handleBackToHome={handleBackToHome}
        />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 mt-8">
          {t('settings.title')}
        </h1>

        {/* Settings Section */}
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('settings.theme')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('settings.theme.description')}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={t('settings.theme.toggle')}
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('settings.language')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('settings.language.description')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-japan-navy text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('id')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  language === 'id'
                    ? 'bg-japan-navy text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ID
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t('settings.resetdata')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('settings.resetdata.description')}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={t('settings.resetdata.toggle')}
            >
              {t('settings.button.reset')}
            </button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => {
                resetData();
                setIsModalOpen(false);
              }}
              title={t('settings.resetdata')}
              message={t('settings.resetdata.confirm')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}