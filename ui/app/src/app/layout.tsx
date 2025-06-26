// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/Layout/ClientLayout";
import { PageTitleProvider } from "@/context/PageTitleContext";
import Notifications from "@/components/Notifications";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rightmetrics Dashboard",
  description: "Healthcare Analytics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <PageTitleProvider>
          <AuthProvider>
            <ClientLayout>
              <Notifications />
              <SettingsProvider>
                {children}
                <Toaster />
              </SettingsProvider>
            </ClientLayout>
          </AuthProvider>
        </PageTitleProvider>
      </body>
    </html>
  );
}
