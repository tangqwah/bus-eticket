import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BKS eTicket — จองตั๋วรถโดยสาร",
  description: "บริษัท ขนส่ง จำกัด ระบบจองตั๋วโดยสารออนไลน์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${kanit.variable} h-full`}>
      <body className="min-h-full bg-[#f9fafb]">{children}</body>
    </html>
  );
}
