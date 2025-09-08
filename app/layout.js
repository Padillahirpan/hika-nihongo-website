import "./globals.css";

export const metadata = {
  title: "Japanese Kana Learning App",
  description: "Learn Japanese Hiragana and Katakana characters with interactive flashcards",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-japan-white-off">{children}</body>
    </html>
  );
}
