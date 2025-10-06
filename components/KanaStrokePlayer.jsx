"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Stroke order paths sourced from KanjiVG (CC BY-SA 3.0).

const DRAW_KEYFRAMES = `
@keyframes kana-stroke-draw {
  to { stroke-dashoffset: 0; }
}
`;

const resolveCodepoints = (glyph) => {
  const raw = glyph.codepoint.toString();
  const upper = raw.toUpperCase();
  const lower = upper.toLowerCase();
  const paddedLower = lower.padStart(5, "0");

  return {
    local: [upper, lower, paddedLower.toUpperCase(), paddedLower],
    remote: paddedLower
  };
};

const buildSources = (glyph) => {
  const { local, remote } = resolveCodepoints(glyph);
  const localSources = local.map((segment) => `/kanjivg/${glyph.script}/${segment}.svg`);

  return [
    ...localSources,
    `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${remote}.svg`,
    `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${remote}.svg`
  ];
};

const sanitizeSvgMarkup = (markup) =>
  markup
    .replace(/<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?\]>/i, "")
    .replace(/\]\s*>/g, ">")
    .trim();

export default function KanaStrokePlayer({
  glyph,
  strokeColor = "#f43f5e",
  strokeWidth = 8,
  gap = 0.18,
  autoPlay = true
}) {
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState(null);
  const sources = useMemo(() => (glyph ? buildSources(glyph) : []), [glyph]);

  useEffect(() => {
    if (!glyph) {
      setLoadError(null);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      return;
    }

    let cancelled = false;

    const fetchSvg = async () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setLoadError(null);

      const errors = [];

      for (const url of sources) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            errors.push(`${url} (HTTP ${res.status})`);
            continue;
          }

          let markup = await res.text();
          markup = sanitizeSvgMarkup(markup);
          if (cancelled || !containerRef.current) {
            return;
          }

          containerRef.current.innerHTML = markup;
          const svgEl = containerRef.current.querySelector("svg");
          if (!svgEl) {
            errors.push(`${url} (missing <svg>)`);
            continue;
          }

          animateSVG(svgEl);
          return;
        } catch (error) {
          errors.push(`${url} (${error.message})`);
        }
      }

      if (!cancelled) {
        setLoadError(errors.join("; "));
        console.error("Failed to load KanaVG asset:", errors);
      }
    };

    const animateSVG = (svgEl) => {
      svgEl.setAttribute("width", "100%");
      svgEl.setAttribute("height", "100%");
      svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");

      const paths = Array.from(svgEl.querySelectorAll("path"));
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.fill = "none";
        path.style.stroke = strokeColor;
        path.style.strokeWidth = String(strokeWidth);
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        path.style.strokeDasharray = length.toString();
        path.style.strokeDashoffset = length.toString();
        path.style.animation = "none";

        if (autoPlay) {
          path.style.animation = `kana-stroke-draw ${Math.max(0.4, length / 220)}s ease-in-out forwards`;
          path.style.animationDelay = `${index * gap}s`;
        }
      });
    };

    fetchSvg();

    return () => {
      cancelled = true;
    };
  }, [glyph, sources, strokeColor, strokeWidth, gap, autoPlay]);

  return (
    <div className="relative flex flex-col items-center gap-3">
      <style jsx>{DRAW_KEYFRAMES}</style>
      <div className="relative w-full max-w-[220px] aspect-square rounded-2xl bg-white/80 p-4 shadow-lg sm:max-w-sm md:max-w-md md:p-6 dark:bg-gray-900/60">
        <div ref={containerRef} className="h-full w-full [&>svg]:h-full [&>svg]:w-full" />
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 p-4 text-center text-xs text-rose-600 dark:bg-gray-900/80 dark:text-rose-400">
            Unable to load stroke data. Check your internet connection or add KanjiVG assets locally.
          </div>
        )}
      </div>
      {glyph && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <div className="text-2xl font-noto-jp sm:text-3xl md:text-4xl">{glyph.kana}</div>
          <div className="uppercase tracking-wide">{glyph.romaji}</div>
        </div>
      )}
    </div>
  );
}

