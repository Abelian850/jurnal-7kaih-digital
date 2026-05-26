import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Jurnal 7KAIH Digital",
    template: "%s | Jurnal 7KAIH Digital",
  },
  description: "Sistem Jurnal Siswa Digital berbasis Guru Wali - Madrasah Modern",
  authors: [{ name: "Abyass Walker (AW)" }],
  creator: "Abyass Walker (AW)",
  publisher: "Abyass Walker (AW)",
  keywords: ["jurnal siswa", "7kaih", "madrasah", "sekolah", "guru wali", "digital"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Jurnal 7KAIH Digital",
    description: "Sistem Jurnal Siswa Digital berbasis Guru Wali",
    siteName: "Jurnal 7KAIH Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jurnal 7KAIH Digital",
    description: "Sistem Jurnal Siswa Digital berbasis Guru Wali",
    creator: "@abyasswalker",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
