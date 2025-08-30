import "./globals.css";

export const metadata = {
  title: "Hiragana Learning App",
  description: "Learn Japanese Hiragana characters with interactive flashcards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
