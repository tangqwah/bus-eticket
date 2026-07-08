"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BKS_LOGO = "/assets/bks-logo.png";

type User = { username: string; name: string };

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("bks_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bks_user");
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-[#ededed] sticky top-0 z-50">
      <div className="max-w-[1512px] mx-auto px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/">
            <img src={BKS_LOGO} alt="BKS" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#344054]">
            <Link href="/" className="hover:text-[#171b82]">หน้าแรก</Link>
            <button className="flex items-center gap-1 hover:text-[#171b82]">
              จัดการการเดินทาง
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="hover:text-[#171b82] cursor-pointer">วิธีการจองและชำระเงิน</span>
            <span className="hover:text-[#171b82] cursor-pointer">สิทธิพิเศษ</span>
            <span className="hover:text-[#171b82] cursor-pointer">ติดต่อเรา</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-[15px] font-semibold text-[#222]">
            ไทย
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2.5 border border-[#d0d5dd] rounded-full pl-2 pr-3 py-1.5 hover:bg-[#f9fafb] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#171b82] flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                  {user.name.charAt(2)}
                </div>
                <span className="text-[14px] font-semibold text-[#101828] max-w-[120px] truncate">{user.name}</span>
                <svg className={`text-[#667085] transition-transform ${menuOpen ? "rotate-180" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e5e7eb] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#f3f4f6]">
                      <div className="text-[13px] font-semibold text-[#101828] truncate">{user.name}</div>
                      <div className="text-[12px] text-[#667085] truncate">@{user.username}</div>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#344054] hover:bg-[#f9fafb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                        ข้อมูลของฉัน
                      </Link>
                      <Link
                        href="/profile#bookings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#344054] hover:bg-[#f9fafb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/></svg>
                        การจองของฉัน
                      </Link>
                    </div>
                    <div className="border-t border-[#f3f4f6] py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#f04438] hover:bg-[#fff1f0]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-[#171b82] text-white text-[14px] font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#131566]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
