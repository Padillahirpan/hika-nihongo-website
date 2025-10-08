'use client';

import { useEffect, useState } from 'react';
import { checkUnlockConditions } from '../util/unlock-logic';

// Shared constants
const PASS_THRESHOLD = 80;

// Safe JSON helpers for localStorage
const readJSON = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error reading localStorage for key:', key, err);
    return null;
  }
};

const writeJSON = (key, value) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error('Error writing localStorage for key:', key, err);
  }
};

/**
 * Hook: useLocalStorage
 * Mirrors a piece of state to localStorage under `key`.
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const parsed = readJSON(key);
    return parsed ?? initialValue;
  });

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue];
};

/**
 * Hook: useKanaProgress
 * Computes mastered and total kana counts from localStorage array at `key`.
 */
export const useKanaProgress = (key) => {
  const [progress, setProgress] = useState({ masteredKana: 0, totalKana: 0 });

  useEffect(() => {
    const parsed = readJSON(key);
    if (!Array.isArray(parsed)) return;

    const filtered = parsed.filter((item) => item && item.character !== '-');
    const masteredKana = filtered.filter((item) => Number(item.points) >= PASS_THRESHOLD).length;
    const totalKana = filtered.length;

    setProgress({ masteredKana, totalKana });
  }, [key]);

  return progress;
};

/** Backward-compatible alias */
export const getCurrentKanaProgress = useKanaProgress;

/**
 * Hook: useLocalHiraganaData
 * Loads, validates (via unlock conditions), and persists hiragana data under `key`.
 * Starts with `initialValue` to avoid hydration mismatches.
 */
export const useLocalHiraganaData = (key, initialValue) => {
  console.log(`ini adalah useLocalHiraganaData`)
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const parsed = readJSON(key);

    if (parsed != null) {
      const { data, changed } = checkUnlockConditions(parsed);
      if (changed) {
        writeJSON(key, data);
        setValue(data);

      console.log(`this is parse not null CHANGED`)

      } else {
      console.log(`this is parse not null NOT CHANGED`)

        setValue(parsed);
      }
    } else {
      console.log(`this is parse null`)

      writeJSON(key, initialValue);
      setValue(initialValue);
    }
  }, [key]);

  // Persist whenever value changes (post-hydration only)
  useEffect(() => {
    if (hydrated) {
      writeJSON(key, value);
    }
  }, [key, value, hydrated]);

  return [value, setValue];
};

/** Backward-compatible alias */
export const getLocalHiraganaData = useLocalHiraganaData;
