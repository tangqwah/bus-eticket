"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const BKS_LOGO = "/assets/bks-logo.png";

const NAV = [
  {
    href: "/backoffice/dashboard",
    label: "แดชบอร์ด",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: "/backoffice/trips",
    label: "เที่ยวรถ",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="22" height="16" rx="2"/><path d="M8 19v2M16 19v2M1 10h22"/>
      </svg>
    ),
  },
  {
    href: "/backoffice/bookings",
    label: "การจอง",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    href: "/backoffice/routes",
    label: "เส้นทาง",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/>
        <path d="M5 8v10a2 2 0 002 2h10M19 16V6a2 2 0 00-2-2H7"/>
      </svg>
    ),
  },
  {
    href: "/backoffice/members",
    label: "สมาชิก",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    href: "/backoffice/settings/discounts",
    label: "ตั้งค่า",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/backoffice/dashboard") return "แดชบอร์ด";
  if (pathname === "/backoffice/trips") return "เที่ยวรถและกำหนดการ";
  if (pathname === "/backoffice/bookings") return "การจองทั้งหมด";
  if (pathname === "/backoffice/routes") return "จัดการเส้นทาง";
  if (pathname === "/backoffice/members") return "จัดการสมาชิก";
  if (pathname.startsWith("/backoffice/members/")) return "รายละเอียดสมาชิก";
  if (pathname.startsWith("/backoffice/settings")) return "ตั้งค่า";
  return "ระบบหลังบ้าน";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bks_admin");
    if (!raw) { router.push("/backoffice/login"); return; }
    setAdmin(JSON.parse(raw));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bks_admin");
    router.push("/backoffice/login");
  };

  if (!admin) return null;

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#0f1260] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={BKS_LOGO} alt="BKS" className="h-7 w-auto brightness-0 invert shrink-0" />
            <div className="min-w-0">
              <div className="text-white text-[13px] font-bold leading-tight">ระบบหลังบ้าน</div>
              <div className="text-white/50 text-[10px] font-medium mt-0.5">BKS Backoffice</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(item => {
            const activePrefix = item.href === "/backoffice/settings/discounts" ? "/backoffice/settings" : item.href;
            const active = pathname === item.href || pathname.startsWith(activePrefix + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white/90"
                }`}
              >
                <span className={active ? "text-white" : "text-white/50"}>{item.icon}</span>
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#cd416e]" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-[13px] font-semibold truncate">{admin.name}</div>
              <div className="text-white/50 text-[11px]">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f4f6]">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#e5e7eb] flex items-center px-6 gap-4 shrink-0">
          <div className="flex-1">
            <h1 className="text-[16px] font-bold text-[#101828]">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#667085] hover:text-[#344054] border border-[#e5e7eb] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              หน้าลูกค้า
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
