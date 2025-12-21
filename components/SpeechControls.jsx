import React, { useState } from 'react';
import { useSpeechService } from '../hooks/useSpeechService';

export function SpeechControls({ onSettingsChange, showAdvanced = false }) {
  const {
    isSupported,
    isSpeaking,
    speak,
    stop,
    pause,
    resume,
    updateSettings,
    getSettings,
    voices,
    selectedVoice,
    setVoice
  } = useSpeechService();

  const [settings, setSettings] = useState(getSettings());

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-yellow-800 dark:text-yellow-200">
            Speech synthesis is not supported in your browser
          </span>
        </div>
      </div>
    );
  }

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings(newSettings);
    if (onSettingsChange) onSettingsChange(newSettings);
  };

  const testSpeech = () => {
    speak('こんにちは', {
      onStart: () => console.log('Test speech started'),
      onEnd: () => console.log('Test speech ended'),
      onError: (error) => console.error('Test speech error:', error)
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Speech Settings
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={testSpeech}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Test
          </button>
          <button
            onClick={isSpeaking ? stop : undefined}
            className={`px-3 py-1 rounded-md text-sm ${
              isSpeaking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isSpeaking}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rate Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Speech Rate: {settings.rate?.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={settings.rate || 1}
            onChange={(e) => handleSettingChange('rate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Pitch Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pitch: {settings.pitch?.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.pitch || 1}
            onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Volume: {settings.volume}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={settings.volume || 5}
            onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        {/* Voice Selection */}
        {showAdvanced && voices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voice
            </label>
            <select
              value={voices.findIndex(v => v === selectedVoice)}
              onChange={(e) => setVoice(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {voices.map((voice, index) => (
                <option key={index} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Advanced</h4>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRetry"
              checked={settings.autoRetry !== false}
              onChange={(e) => handleSettingChange('autoRetry', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRetry" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Auto-retry on error
            </label>
          </div>

          <div className="flex items-center">
            <label htmlFor="maxRetries" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              Max retries:
            </label>
            <input
              type="number"
              id="maxRetries"
              min="0"
              max="10"
              value={settings.maxRetries || 3}
              onChange={(e) => handleSettingChange('maxRetries', parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          isSpeaking ? 'bg-green-500' : 'bg-gray-300'
        }`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isSpeaking ? 'Speaking...' : 'Ready'}
        </span>
      </div>
    </div>
  );
}