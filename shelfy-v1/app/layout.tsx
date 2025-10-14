import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLogo from "@/components/AppLogo";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import AuthSection from "@/components/LoginLogout/AuthSection";
import SessionProvider from "@/app/lib/SessionProvider";

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
  description: "Online tool to search and modify an inventory",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      // Main page layout consisting of a header with logo, search bar, and auth section
      // and a main content area for displaying child components
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
      {/* Contents are wrapped in the SessionProvider context to provide children with the authentication state */}
      <SessionProvider  initialSession={{isAuthenticated: false, user: null}}>
          <header className="shrink-0">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-2 ">
                  <div className="mb-16 flex justify-start">
                      {/* First AuthSection for login/logout functionality */}
                      <AuthSection />
                  </div>
                  <div className="flex flex-col items-center gap-1 w-full col-start-2 col-end-3">
                      <Link href={"/"}>
                          <AppLogo />
                      </Link>
                      <SearchBar />
                  </div>
                  {/* Second AuthSection keep the page symmetrical */}
                  <div className="mb-16 flex justify-end invisible">
                      <AuthSection />
                  </div>
              </div>
          </header>
          <main className="flex-1 min-h-0">
              {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
