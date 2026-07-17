import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "BKS eTicket — จองตั๋วรถโดยสาร",
  description: "บริษัท ขนส่ง จำกัด ระบบจองตั๋วโดยสารออนไลน์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${googleSans.variable} h-full`}>
      <body className="min-h-full bg-[#f9fafb]">{children}</body>
    </html>
  );
}
