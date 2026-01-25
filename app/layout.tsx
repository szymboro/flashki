import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashki - Nauka z fiszkami",
  description: "Aplikacja do łatwej nauki przez fiszki",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className="min-h-screen bg-gray-900">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
