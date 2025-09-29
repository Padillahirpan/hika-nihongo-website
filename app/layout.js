import "./globals.css";
import { metadata } from "./metadata";
import Providers from "./providers.jsx";

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-japan-white-off dark:bg-gray-900 transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
