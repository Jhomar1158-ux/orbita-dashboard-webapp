import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import GuideAvatar from "./components/GuideAvatar";
import GuideProvider from "./context/GuideContext";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Órbita - Orientación Vocacional",
  description: "Plataforma de orientación vocacional para estudiantes",
  icons: {
    icon: [
      { url: "/assets/logo.ico", type: "image/x-icon" },
      { url: "/assets/logo.png", type: "image/png" },
    ],
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="shortcut icon" href="/assets/logo.ico" type="image/x-icon" />
        <link rel="icon" href="/assets/logo.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <GuideProvider>
            {children}
            <GuideAvatar />
          </GuideProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
