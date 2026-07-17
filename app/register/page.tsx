"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MEMBER_TYPE_LABELS,
  MEMBER_TYPE_NEEDS_DOC,
  MEMBER_TYPE_HAS_EXPIRY,
  MEMBER_TYPE_DOC_LABEL,
  type MemberType,
} from "@/lib/mockMembers";

const BKS_LOGO = "/assets/bks-logo.png";

type Gender = "male" | "female";
type IdType = "national_id" | "passport";

const MEMBER_TYPE_ORDER: MemberType[] = ["general", "employee", "official", "senior", "student", "disabled"];

const MEMBER_TYPE_DESCRIPTIONS: Record<MemberType, string> = {
  general: "สมาชิกทั่วไป ใช้บริการจองตั๋วออนไลน์",
  employee: "พนักงาน บขส. รับส่วนลดพิเศษ",
  official: "ข้าราชการ/ทหาร รับส่วนลดพิเศษ",
  senior: "ผู้มีอายุ 60 ปีขึ้นไป รับสิทธิ์ส่วนลด",
  student: "นักเรียน/นักศึกษา รับส่วนลดค่าโดยสาร",
  disabled: "ผู้พิการ รับสิทธิ์ส่วนลดพิเศษ",
};

const MEMBER_TYPE_ICON_BG: Record<MemberType, string> = {
  general: "bg-[#f3f4f6]",
  employee: "bg-[#f0f2ff]",
  official: "bg-[#f5f3ff]",
  senior: "bg-[#fffbeb]",
  student: "bg-[#f0fdfa]",
  disabled: "bg-[#fff1f2]",
};

const MEMBER_TYPE_ICON_COLOR: Record<MemberType, string> = {
  general: "#667085",
  employee: "#171b82",
  official: "#6d28d9",
  senior: "#b45309",
  student: "#0f766e",
  disabled: "#9f1239",
};

const MEMBER_TYPE_SELECTED_BORDER: Record<MemberType, string> = {
  general: "border-[#667085]",
  employee: "border-[#171b82]",
  official: "border-[#6d28d9]",
  senior: "border-[#b45309]",
  student: "border-[#0f766e]",
  disabled: "border-[#9f1239]",
};

function MemberTypeIcon({ type, size = 20 }: { type: MemberType; size?: number }) {
  const color = MEMBER_TYPE_ICON_COLOR[type];
  return (
    <>
      {type === "general" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      )}
      {type === "employee" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      )}
      {type === "official" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      )}
      {type === "senior" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      )}
      {type === "student" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      )}
      {type === "disabled" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="4" r="2"/>
          <path d="M9 10h4l2 8M9 10v5"/>
          <circle cx="8" cy="19" r="2"/>
          <circle cx="16" cy="19" r="2"/>
          <path d="M15 15l1.5 4"/>
        </svg>
      )}
    </>
  );
}

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
  const [memberType, setMemberType] = useState<MemberType>("general");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState("");

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleDocFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDocFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = ev => setDocPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setDocPreview("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  const inputCls = "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-[16px] text-[#101828] placeholder:text-[#667085] outline-none focus:border-[#171b82] focus:ring-1 focus:ring-[#171b82] shadow-[0px_1px_1px_rgba(16,24,40,0.05)]";
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

              {/* Divider */}
              <div className="h-px bg-[#e5e7eb]" />

              {/* Section 3 — Member type */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="bg-[rgba(205,65,110,0.15)] p-2 rounded-[6px]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cd416e" strokeWidth="1.8">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <span className="text-[20px] font-semibold text-[#1f2937]">ประเภทสมาชิก</span>
                </div>

                <p className="text-[14px] text-[#475467] -mt-2">
                  เลือกประเภทสมาชิกที่ตรงกับคุณ หากเป็นกลุ่มสิทธิพิเศษ กรุณาเตรียมเอกสารประกอบเพื่ออัปโหลด
                </p>

                {/* Type cards grid */}
                <div className="grid grid-cols-3 gap-3">
                  {MEMBER_TYPE_ORDER.map(type => {
                    const selected = memberType === type;
                    const color = MEMBER_TYPE_ICON_COLOR[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setMemberType(type); setDocFile(null); setDocPreview(""); }}
                        className={`relative flex flex-col gap-2.5 p-4 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? `${MEMBER_TYPE_SELECTED_BORDER[type]} bg-white shadow-sm`
                            : "border-[#e5e7eb] bg-[#f9fafb] hover:border-[#d0d5dd] hover:bg-white"
                        }`}
                      >
                        {selected && (
                          <div
                            className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: color }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                        )}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${MEMBER_TYPE_ICON_BG[type]}`}>
                          <MemberTypeIcon type={type} size={18} />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#101828] leading-tight">{MEMBER_TYPE_LABELS[type]}</div>
                          <div className="text-[11px] text-[#667085] mt-0.5 leading-snug">{MEMBER_TYPE_DESCRIPTIONS[type]}</div>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={MEMBER_TYPE_NEEDS_DOC[type] ? color : "#9ca3af"} strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <span className="text-[10px] font-medium" style={{ color: MEMBER_TYPE_NEEDS_DOC[type] ? color : "#9ca3af" }}>
                            {MEMBER_TYPE_NEEDS_DOC[type] ? MEMBER_TYPE_DOC_LABEL[type] : "ไม่ต้องใช้เอกสาร"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Document upload (shown for all types that require a doc) */}
                {MEMBER_TYPE_NEEDS_DOC[memberType] && (
                  <div className="flex flex-col gap-3">
                    <label className={labelCls}>
                      อัปโหลด {MEMBER_TYPE_DOC_LABEL[memberType]}{requiredStar}
                    </label>

                    {docFile ? (
                      <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#86efac] rounded-xl px-4 py-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#15803d] truncate">{docFile.name}</div>
                          <div className="text-[11px] text-[#16a34a] mt-0.5">ไฟล์พร้อมส่ง</div>
                        </div>
                        {docPreview && (
                          <img src={docPreview} alt="preview" className="w-12 h-12 object-cover rounded-lg border border-[#86efac] shrink-0" />
                        )}
                        <button
                          type="button"
                          onClick={() => { setDocFile(null); setDocPreview(""); }}
                          className="text-[12px] font-semibold text-[#667085] hover:text-[#344054] underline shrink-0"
                        >
                          เปลี่ยนไฟล์
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-[#d0d5dd] rounded-xl py-8 hover:border-[#cd416e] hover:bg-[#fff5f7] transition-colors">
                        <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-[14px] font-semibold text-[#344054]">คลิกหรือลากไฟล์มาวางที่นี่</div>
                          <div className="text-[12px] text-[#9ca3af] mt-0.5">รองรับ JPG, PNG, PDF ขนาดไม่เกิน 5 MB</div>
                        </div>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleDocFileChange} />
                      </label>
                    )}

                    {/* Expiry / no-expiry info note */}
                    {MEMBER_TYPE_HAS_EXPIRY[memberType] ? (
                      <div className="flex items-start gap-2.5 bg-[#fffbeb] border border-[#fcd34d] rounded-lg px-3.5 py-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" className="shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p className="text-[12px] text-[#92400e] leading-relaxed">
                          สิทธิ์สมาชิกประเภทนี้<strong>มีอายุ 1 ปี</strong> ต้องต่ออายุก่อนหมดอายุเพื่อรักษาสิทธิ์ส่วนลดค่าโดยสาร
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 bg-[#f0fdf4] border border-[#86efac] rounded-lg px-3.5 py-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <p className="text-[12px] text-[#15803d] leading-relaxed">
                          สิทธิ์สมาชิกผู้สูงอายุ<strong>ไม่มีวันหมดอายุ</strong> หลังผ่านการตรวจสอบและอนุมัติเอกสารแล้ว
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
