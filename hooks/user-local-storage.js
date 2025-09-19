'use client';

import { useState, useEffect } from 'react';
import { checkUnlockConditions } from '../util/unlock-logic';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const getCurrentKanaProgress = (key) => {
  const [data, setData] = useState({ masteredKana: 0, totalKana: 0 });

  useEffect(() => {
    try {
      // ambil dari localStorage
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);

        // hitung dataA (point > 80)
        const passedKana = parsed
          .filter(item => item.character !== '-')
          .filter(item => item.points >= 80).length;

        // hitung dataB (total data)
        const totalKana = parsed
          .filter(item => item.character !== '-')
          .length;

        setData({ masteredKana: passedKana, totalKana: totalKana });
      }
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
    }
  }, [key]);

  return data;
}

export const getCurrentDakuonProgress = (key) => {
  const [data, setData] = useState({ masteredDakuon: 0, totalDakuon: 0 });

  useEffect(() => {
    try {
      // ambil dari localStorage
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);

        // hitung dataA (point > 80)
        const dataA = parsed.filter(item => item.points >= 80).length;

        // hitung dataB (total data)
        const dataB = parsed.length;

        setData({ masteredDakuon: dataA, totalDakuon: dataB });
      }
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
    }
  }, [key]);

  return data;
}

export const getLocalHiraganaData = (key, initialValue) => {
  // Always start with initialValue to prevent hydration mismatch
  const [value, setValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated and load from localStorage
    setIsHydrated(true);
    
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        const { data, changed } = checkUnlockConditions(parsed);

        if (changed) {
          window.localStorage.setItem(key, JSON.stringify(data));
          setValue(data);
        } else {
          setValue(parsed);
        }
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setValue(initialValue);
      }
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
      setValue(initialValue);
    }
  }, [key]);

  // Update localStorage when value changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error("Error saving to localStorage:", err);
      }
    }
  }, [key, value, isHydrated]);

  return [value, setValue];
}