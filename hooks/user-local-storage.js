'use client';

import { useState, useEffect } from 'react';

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

export const getCurrentHiragnaProgress = (key) => {
  const [data, setData] = useState({ masteredHiragana: 0, totalHiragana: 0 });

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

        setData({ masteredHiragana: dataA, totalHiragana: dataB });
      }
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
    }
  }, [key]);

  return data;
}