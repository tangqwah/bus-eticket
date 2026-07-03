"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BKS_LOGO = "/assets/bks-logo.png";

type Gender = "male" | "female";
type IdType = "national_id" | "passport";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    prefix: "",
    firstName: "",
    lastName: "",
    gender: "male" as Gender,
    birthDate: "",
    idType: "national_id" as IdType,
    idNumber: "",
    address: "",
    phone: "",
    contactEmail: "",
  });
  const [agreed, setAgreed] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  const inputCls = "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[16px] text-[#101828] placeholder:text-[#667085] outline-none focus:border-[#cd416e] focus:ring-1 focus:ring-[#cd416e] shadow-[0px_1px_1px_rgba(16,24,40,0.05)]";
  const labelCls = "text-[14px] font-medium text-[#344054]";
  const requiredStar = <span className="text-[#f04438]"> *</span>;

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
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
                ตรวจสอบสถานะ
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

      {/* Pink hero banner */}
      <div className="bg-gradient-to-b from-[#cd416e] to-[#a43458] py-12 text-center text-white">
        <h1 className="text-[36px] font-semibold leading-[44px]">สร้างบัญชีของคุณ</h1>
        <p className="text-[20px] leading-[30px] mt-2 opacity-90">
          ลงทะเบียนเพื่อเริ่มต้นจองตั๋วรถโดยสารทั่วไทย<br />
          พร้อมรับสิทธิพิเศษสำหรับสมาชิก
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-[777px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-[10px] shadow-[0px_1px_6.5px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-6">

              {/* Section 1 — Login info */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="bg-[rgba(205,65,110,0.15)] p-2 rounded-[6px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cd416e" strokeWidth="1.8">
                      <rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-semibold text-[#1f2937]">ข้อมูลสำหรับการเข้าสู่ระบบ</span>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>อีเมล{requiredStar}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    </span>
                    <input type="email" placeholder="กรุณาระบุอีเมล" value={form.email} onChange={set("email")} required className={`${inputCls} pl-10`} />
                  </div>
                </div>

                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>รหัสผู้ใช้งาน (Username){requiredStar}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </span>
                    <input type="text" placeholder="กรุณาระบุรหัสผู้ใช้งาน" value={form.username} onChange={set("username")} required className={`${inputCls} pl-10`} />
                  </div>
                  <p className="text-[14px] text-[#475467]">กรุณาระบุเป็นภาษาอังกฤษ หรือตัวเลข ไม่เกิน 20 ตัวอักษร</p>
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>รหัสผ่าน{requiredStar}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                      </span>
                      <input type="password" placeholder="กรุณาระบุรหัสผ่าน" value={form.password} onChange={set("password")} required className={`${inputCls} pl-10`} />
                    </div>
                    <p className="text-[14px] text-[#475467]">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรและตัวเลข</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>ยืนยันรหัสผ่าน{requiredStar}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                      </span>
                      <input type="password" placeholder="กรุณาระบุรหัสผ่าน" value={form.confirmPassword} onChange={set("confirmPassword")} required className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5e7eb]" />

              {/* Section 2 — Personal info */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="bg-[rgba(205,65,110,0.15)] p-2 rounded-[6px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cd416e" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <span className="text-[20px] font-semibold text-[#1f2937]">ข้อมูลส่วนตัว</span>
                </div>

                {/* Prefix + First name + Last name */}
                <div className="flex items-end gap-4">
                  <div className="flex flex-col gap-1.5 w-[158px] shrink-0">
                    <label className={labelCls}>คำนำหน้า{requiredStar}</label>
                    <div className="relative">
                      <select value={form.prefix} onChange={set("prefix")} required className={`${inputCls} appearance-none pr-9`}>
                        <option value="">เลือกคำนำหน้า</option>
                        <option value="นาย">นาย</option>
                        <option value="นาง">นาง</option>
                        <option value="นางสาว">นางสาว</option>
                        <option value="เด็กชาย">เด็กชาย</option>
                        <option value="เด็กหญิง">เด็กหญิง</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1l6 6 6-6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className={labelCls}>ชื่อจริง{requiredStar}</label>
                    <input type="text" placeholder="ชื่อจริง" value={form.firstName} onChange={set("firstName")} required className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className={labelCls}>นามสกุล{requiredStar}</label>
                    <input type="text" placeholder="นามสกุล" value={form.lastName} onChange={set("lastName")} required className={inputCls} />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <span className={labelCls}>เพศ</span>
                  <div className="flex gap-14">
                    {([["male", "ชาย"], ["female", "หญิง"]] as [Gender, string][]).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-3 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.gender === val ? "border-[#cd416e] bg-[#cd416e]" : "border-[#d0d5dd]"}`}
                          onClick={() => setForm(prev => ({ ...prev, gender: val }))}
                        >
                          {form.gender === val && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-[16px] font-medium text-[#344054]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Birth date */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>วัน/เดือน/ปีเกิด (ไม่บังคับ)</label>
                  <input type="text" placeholder="วัน/เดือน/ปี (พ.ศ.)" value={form.birthDate} onChange={set("birthDate")} className={inputCls} />
                </div>

                {/* ID type */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-14">
                    {([["national_id", "เลขประจำตัวประชาชน"], ["passport", "เลขหนังสือเดินทาง"]] as [IdType, string][]).map(([val, label]) => (
                      <label key={val} className="flex items-center gap-3 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.idType === val ? "border-[#cd416e] bg-[#cd416e]" : "border-[#d0d5dd]"}`}
                          onClick={() => setForm(prev => ({ ...prev, idType: val }))}
                        >
                          {form.idType === val && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-[16px] font-medium text-[#344054]">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>
                      {form.idType === "national_id" ? "เลขประจำตัวประชาชน" : "เลขหนังสือเดินทาง"}{requiredStar}
                    </label>
                    <input
                      type="text"
                      placeholder={form.idType === "national_id" ? "กรุณากรอกเลขประจำตัวประชาชน" : "กรุณากรอกเลขหนังสือเดินทาง"}
                      value={form.idNumber}
                      onChange={set("idNumber")}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>ที่อยู่ (ไม่บังคับ)</label>
                  <textarea
                    placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน / แขวง-เขต / จังหวัด / รหัสไปรษณีย์"
                    value={form.address}
                    onChange={set("address")}
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Phone + Contact email */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>เบอร์โทรศัพท์{requiredStar}</label>
                    <input type="tel" placeholder="เช่น 0812345678" value={form.phone} onChange={set("phone")} required className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>อีเมล</label>
                    <input type="email" placeholder="กรุณาระบุอีเมล (ถ้ามี)" value={form.contactEmail} onChange={set("contactEmail")} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-[#d0d5dd] accent-[#cd416e] shrink-0"
                />
                <span className="text-[16px] font-medium text-[#344054] leading-[24px]">
                  ฉันได้อ่านและยอมรับ{" "}
                  <span className="text-[#cd416e] cursor-pointer hover:underline">ข้อกำหนดการใช้งาน</span>
                  {" "}และ นโยบายความเป็นส่วนตัว ของบริษัท ขนส่ง จำกัด
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!agreed}
                className="w-full bg-[#171b82] text-white text-[16px] font-semibold py-3 rounded-lg hover:bg-[#131566] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ลงทะเบียน
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-[16px] text-[#101828]">มีบัญชีอยู่แล้ว?</span>
            <Link href="/login" className="text-[16px] font-semibold text-[#cd416e] hover:text-[#a43458]">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
