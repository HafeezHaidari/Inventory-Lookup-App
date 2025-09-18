import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLogo from "@/components/AppLogo";
import SearchBar from "@/components/SearchBar";
import LoginButton from "@/components/LoginButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Search",
  description: "Online tool to search an inventory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
      <header className="shrink-0">
          <div className="flex items-center justify-between gap-4 px-4 py-2 ">
              <div className="mb-16">
                  <LoginButton />
              </div>
              <div className="flex flex-col items-center gap-1 justify-center items w-full">
                  <AppLogo />
                  <SearchBar />
              </div>
          </div>
      </header>
      <main className="flex-1 min-h-0">
          {children}
      </main>
      </body>
    </html>
  );
}
