// useSpeechSynthesis.js
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * React hook for Web Speech API (speechSynthesis)
 * @param {string} defaultLang e.g. "ja-JP"
 */
export function useSpeechSynthesis(defaultLang = "ja-JP") {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(!!isSupported);
    if (!isSupported) return;

    const synth = window.speechSynthesis;

    const load = () => {
      const list = synth.getVoices();
      if (list && list.length) {
        voicesLoadedRef.current = true;
        setVoices(list);
      }
    };

    load();
    synth.onvoiceschanged = load;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const pickVoice = useCallback(
    (lang, voiceName) => {
      if (!voices.length) return undefined;
      if (voiceName) {
        const v = voices.find((v) => v.name === voiceName);
        if (v) return v;
      }
      return (
        voices.find((v) => v.lang === lang) ||
        voices.find((v) =>
          v.lang?.toLowerCase().startsWith(lang.toLowerCase().split("-")[0]),
        ) ||
        voices[0]
      );
    },
    [voices],
  );

  const speak = useCallback(
    (text, opts = {}) => {
      if (!supported || !text?.trim()) return;
      const synth = window.speechSynthesis;

      if (synth.paused) synth.resume();
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = opts.lang || defaultLang;
      utter.rate = opts.rate ?? 1;
      utter.pitch = opts.pitch ?? 1;
      utter.volume = opts.volume ?? 1;

      const voice = pickVoice(utter.lang, opts.voiceName);
      if (voice) utter.voice = voice;

      if (opts.onStart) utter.onstart = opts.onStart;
      if (opts.onEnd) utter.onend = opts.onEnd;
      if (opts.onError) utter.onerror = opts.onError;

      synth.speak(utter);
    },
    [supported, defaultLang, pickVoice],
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
  }, [supported]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
  }, [supported]);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { supported, voices, speak, cancel, pause, resume };
}
