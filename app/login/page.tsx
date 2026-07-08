"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BKS_LOGO = "/assets/bks-logo.png";
const HERO_BG = "/assets/hero-bg.jpg";

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const TEST_USERS = [
  { username: "testuser", password: "test1234" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = TEST_USERS.some(u => u.username === username && u.password === password);
    if (!valid) {
      setError("รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    setError("");
    localStorage.setItem("bks_user", JSON.stringify({ username, name: "นายทดสอบ ระบบ", email: "testuser@example.com", phone: "0812345678" }));
    router.push("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#ededed] sticky top-0 z-50 shrink-0">
        <div className="max-w-[1512px] mx-auto px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/">
              <img src={BKS_LOGO} alt="BKS" className="h-9 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#344054]">
              <Link href="/" className="hover:text-[#171b82]">หน้าแรก</Link>
              <button className="flex items-center gap-1 hover:text-[#171b82]">
                จัดการการเดินทาง
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <span className="hover:text-[#171b82] cursor-pointer">วิธีการจองและชำระเงิน</span>
              <span className="hover:text-[#171b82] cursor-pointer">สิทธิพิเศษ</span>
              <span className="hover:text-[#171b82] cursor-pointer">ติดต่อเรา</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-[15px] font-semibold text-[#222]">
              ไทย
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <Link href="/login" className="bg-[#171b82] text-white text-[14px] font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#131566]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel — hero */}
        <div
          className="hidden lg:flex relative w-1/2 flex-col items-center justify-center overflow-hidden"
          style={{ minHeight: "calc(100vh - 72px)" }}
        >
          {/* Background image */}
          <img
            src={HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          {/* Pink gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(205,65,110,0.4)] to-[#cd416e]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
            {/* Logo box */}
            <div className="bg-white rounded-[7.8px] flex items-center justify-center px-4 py-3">
              <img src={BKS_LOGO} alt="BKS" className="h-8 w-auto object-contain" />
            </div>

            {/* Welcome text */}
            <div className="text-white">
              <h1 className="text-[36px] font-semibold leading-[44px]">ยินดีต้อนรับกลับ</h1>
              <p className="text-[20px] font-medium leading-[30px] mt-1 opacity-90">
                เข้าสู่ระบบเพื่อจองตั๋ว ตรวจสอบการเดินทาง<br />
                และจัดการบัญชีของคุณได้ทุกที่ทุกเวลา
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-2.5 items-start mt-2">
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "ชำระเงินปลอดภัย หลากหลายช่องทาง" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><circle cx="8" cy="8" r="5"/><circle cx="16" cy="16" r="5"/></svg>, text: "ราคารวมทุกอย่าง (ไม่มีค่าธรรมเนียมแอบแฝง)" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/></svg>, text: "ได้รับ E-Ticket ทันทีทาง SMS และอีเมล" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white text-[16px]">
                  {icon}
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-[#f9fafb] flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-[475px] flex flex-col gap-6">
            {/* Heading */}
            <div>
              <h2 className="text-[24px] font-semibold text-[#101828] leading-[32px]">เข้าสู่ระบบ</h2>
              <p className="text-[16px] text-[#344054] mt-1">กรอกข้อมูลเพื่อเข้าใช้งานบัญชีของคุณ</p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-[10px] shadow-[0px_1px_6.5px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-5">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-medium text-[#344054]">รหัสผู้ใช้งาน (Username)</label>
                  <div className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 shadow-[0px_1px_1px_rgba(16,24,40,0.05)]">
                    <IconUser />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="flex-1 text-[16px] text-[#101828] placeholder:text-[#667085] outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-medium text-[#344054]">รหัสผ่าน</label>
                    <button type="button" className="text-[14px] font-semibold text-[#cd416e] hover:text-[#a43458]">
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 shadow-[0px_1px_1px_rgba(16,24,40,0.05)]">
                    <IconLock />
                    <input
                      type="password"
                      placeholder="••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="flex-1 text-[16px] text-[#101828] placeholder:text-[#667085] outline-none bg-transparent"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-[14px] text-[#f04438] bg-[#fef3f2] border border-[#fecdca] rounded-lg px-3 py-2">{error}</p>
                )}

                {/* Remember me */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-5 h-5 rounded border-[#d0d5dd] accent-[#cd416e]"
                  />
                  <span className="text-[16px] font-medium text-[#344054]">จดจำการเข้าสู่ระบบ</span>
                </label>

                {/* Login button */}
                <button
                  type="submit"
                  className="w-full bg-[#171b82] text-white text-[16px] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#131566]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  เข้าสู่ระบบ
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#e5e7eb]" />
                <span className="text-[12px] text-[#667085]">หรือ</span>
                <div className="flex-1 h-px bg-[#e5e7eb]" />
              </div>

              {/* Social login */}
              <div className="flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-4 py-2.5 text-[16px] font-semibold text-[#344054] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#f9fafb]">
                  <IconGoogle />
                  เข้าสู่ระบบด้วย Google
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#d0d5dd] rounded-lg px-4 py-2.5 text-[16px] font-semibold text-[#344054] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#f9fafb]">
                  <IconFacebook />
                  เข้าสู่ระบบด้วย Facebook
                </button>
              </div>

              {/* Sign up link */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[16px] text-[#101828]">ยังไม่มีบัญชี?</span>
                <Link href="/register" className="text-[16px] font-semibold text-[#cd416e] hover:text-[#a43458]">
                  สมัครสมาชิก
                </Link>
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#475467] hover:text-[#344054] self-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              กลับสู่หน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
