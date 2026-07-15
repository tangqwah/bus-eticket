"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BKS_LOGO = "/assets/bks-logo.png";

const ADMIN_USERS = [
  { username: "admin", password: "admin1234", name: "ผู้ดูแลระบบ", role: "admin" },
];

export default function BackofficeLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = ADMIN_USERS.find(u => u.username === username && u.password === password);
    if (!user) {
      setError("รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    localStorage.setItem("bks_admin", JSON.stringify({ username: user.username, name: user.name, role: user.role }));
    router.push("/backoffice/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-[#0f1260] rounded-2xl p-4">
            <img src={BKS_LOGO} alt="BKS" className="h-10 w-auto brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#101828]">ระบบหลังบ้าน</h1>
            <p className="text-[14px] text-[#667085] mt-0.5">บริษัท ขนส่ง จำกัด (บขส) · เฉพาะเจ้าหน้าที่เท่านั้น</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 flex flex-col gap-5">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">รหัสผู้ใช้งาน</label>
              <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3.5 py-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="username"
                  className="flex-1 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">รหัสผ่าน</label>
              <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3.5 py-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none bg-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-[#fef3f2] border border-[#fecdca] rounded-lg px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f04438" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-[13px] text-[#f04438]">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0f1260] text-white text-[15px] font-semibold py-3 rounded-lg hover:bg-[#171b82] transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="bg-[#f9fafb] rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#9ca3af] font-medium">บัญชีทดสอบ: admin / admin1234</p>
          </div>
        </div>

        <p className="text-center text-[13px] text-[#9ca3af]">
          ระบบนี้สงวนไว้สำหรับเจ้าหน้าที่ผู้ได้รับอนุญาตเท่านั้น
        </p>
      </div>
    </div>
  );
}
