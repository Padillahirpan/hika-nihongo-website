"use client";

import { ThemeProvider } from "../contexts/theme-context";
import { LanguageProvider } from "../contexts/language-context";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}