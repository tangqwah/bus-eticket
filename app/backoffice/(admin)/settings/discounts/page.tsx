"use client";
import { useState, useEffect } from "react";

type Settings = {
  employeeDiscount: number;
  officialDiscount: number;
  seniorDiscount: number;
  studentDiscount: number;
  disabledDiscount: number;
  renewalReminderDays: number;
};

const DEFAULTS: Settings = {
  employeeDiscount: 50,
  officialDiscount: 50,
  seniorDiscount: 30,
  studentDiscount: 30,
  disabledDiscount: 40,
  renewalReminderDays: 30,
};

function DiscountCard({
  title,
  subtitle,
  icon,
  iconBg,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <div className="text-[14px] font-bold text-[#101828]">{title}</div>
          <div className="text-[12px] text-[#667085] mt-0.5">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-[44px] font-black text-[#101828] leading-none w-24 text-center">{value}</div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[12px] font-semibold text-[#667085]">ปรับส่วนลด (%)</div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full accent-[#171b82] h-2"
          />
          <div className="flex justify-between text-[10px] text-[#9ca3af] font-medium">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {[0, 25, 50, 75, 100].map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`flex-1 text-[12px] font-bold py-2 rounded-lg transition-colors ${
              value === preset
                ? "bg-[#0f1260] text-white"
                : "bg-[#f3f4f6] text-[#667085] hover:bg-[#e5e7eb]"
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="text-[12px] font-semibold text-[#344054]">กำหนดเอง:</div>
        <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
            className="w-16 px-2 py-2 text-[13px] text-center text-[#101828] outline-none"
          />
          <span className="pr-3 text-[13px] text-[#667085] font-medium">%</span>
        </div>
      </div>
    </div>
  );
}

export default function DiscountSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("bks_discount_settings");
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const update = (key: keyof Settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("bks_discount_settings", JSON.stringify(settings));
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    setDirty(true);
    setSaved(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[860px]">
      {/* Success toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#071a0c] text-white text-[13px] font-semibold px-4 py-3 rounded-xl shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          บันทึกการตั้งค่าเรียบร้อยแล้ว
        </div>
      )}

      {/* Intro */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#f0f2ff] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#171b82" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </div>
        <div>
          <div className="text-[14px] font-bold text-[#101828]">ตั้งค่าส่วนลดสมาชิก</div>
          <div className="text-[13px] text-[#667085] mt-1 leading-relaxed">
            กำหนดเปอร์เซ็นต์ส่วนลดค่าโดยสารสำหรับสมาชิกประเภทต่างๆ รวมถึงระยะเวลาแจ้งเตือนก่อนสิทธิ์หมดอายุ
            การเปลี่ยนแปลงจะมีผลกับสมาชิกที่ได้รับการอนุมัติใหม่เท่านั้น
          </div>
        </div>
      </div>

      {/* Discount cards — existing types */}
      <div className="grid grid-cols-2 gap-4">
        <DiscountCard
          title="พนักงาน บขส."
          subtitle="ส่วนลดค่าโดยสารสำหรับพนักงาน"
          iconBg="bg-[#f0f2ff] text-[#171b82]"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
            </svg>
          }
          value={settings.employeeDiscount}
          onChange={v => update("employeeDiscount", v)}
        />
        <DiscountCard
          title="ข้าราชการ/ทหาร"
          subtitle="ส่วนลดค่าโดยสารสำหรับข้าราชการ"
          iconBg="bg-[#f5f3ff] text-[#6d28d9]"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          }
          value={settings.officialDiscount}
          onChange={v => update("officialDiscount", v)}
        />
      </div>

      {/* Discount cards — new types */}
      <div className="grid grid-cols-3 gap-4">
        <DiscountCard
          title="ผู้สูงอายุ"
          subtitle="อายุ 60 ปีขึ้นไป (ไม่มีวันหมดอายุ)"
          iconBg="bg-[#fffbeb] text-[#b45309]"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          }
          value={settings.seniorDiscount}
          onChange={v => update("seniorDiscount", v)}
        />
        <DiscountCard
          title="เด็กนักเรียน/นักศึกษา"
          subtitle="บัตรนักเรียน/นักศึกษา (ต่ออายุปีละครั้ง)"
          iconBg="bg-[#f0fdfa] text-[#0f766e]"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          }
          value={settings.studentDiscount}
          onChange={v => update("studentDiscount", v)}
        />
        <DiscountCard
          title="ผู้พิการ"
          subtitle="บัตรประจำตัวคนพิการ (ต่ออายุตามกำหนด)"
          iconBg="bg-[#fff1f2] text-[#9f1239]"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="4" r="2"/>
              <path d="M9 10h4l2 8M9 10v5"/>
              <circle cx="8" cy="19" r="2"/>
              <circle cx="16" cy="19" r="2"/>
              <path d="M15 15l1.5 4"/>
            </svg>
          }
          value={settings.disabledDiscount}
          onChange={v => update("disabledDiscount", v)}
        />
      </div>

      {/* Renewal reminder */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#fffbeb] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#101828]">การแจ้งเตือนก่อนหมดอายุ</div>
            <div className="text-[12px] text-[#667085] mt-0.5">แจ้งเตือนเมื่อสิทธิ์สมาชิกใกล้หมดอายุ</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1 max-w-xs">
            <label className="block text-[12px] font-semibold text-[#344054] mb-2">จำนวนวันก่อนหมดอายุ</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={7}
                max={90}
                step={1}
                value={settings.renewalReminderDays}
                onChange={e => update("renewalReminderDays", Number(e.target.value))}
                className="flex-1 accent-[#b45309]"
              />
              <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden">
                <input
                  type="number"
                  min={7}
                  max={90}
                  value={settings.renewalReminderDays}
                  onChange={e => update("renewalReminderDays", Math.min(90, Math.max(7, Number(e.target.value))))}
                  className="w-14 px-2 py-2 text-[13px] text-center text-[#101828] outline-none"
                />
                <span className="pr-3 text-[12px] text-[#667085] font-medium whitespace-nowrap">วัน</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1 font-medium">
              <span>7 วัน</span>
              <span>30 วัน</span>
              <span>60 วัน</span>
              <span>90 วัน</span>
            </div>
          </div>

          <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-xl px-5 py-4">
            <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">แจ้งเตือนเมื่อ</div>
            <div className="text-[24px] font-black text-[#b45309] leading-none">{settings.renewalReminderDays}</div>
            <div className="text-[12px] text-[#b45309] font-semibold mt-1">วัน ก่อนหมดอายุ</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[7, 14, 30, 60, 90].map(d => (
            <button
              key={d}
              onClick={() => update("renewalReminderDays", d)}
              className={`text-[12px] font-semibold px-4 py-2 rounded-lg transition-colors ${
                settings.renewalReminderDays === d
                  ? "bg-[#b45309] text-white"
                  : "bg-[#f3f4f6] text-[#667085] hover:bg-[#e5e7eb]"
              }`}
            >
              {d} วัน
            </button>
          ))}
        </div>
      </div>

      {/* Save/Reset bar */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex items-center justify-between">
        <div className="text-[13px] text-[#667085]">
          {dirty ? (
            <span className="flex items-center gap-2 text-[#b45309]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
            </span>
          ) : (
            <span className="text-[#9ca3af]">พนักงาน {settings.employeeDiscount}% · ข้าราชการ {settings.officialDiscount}% · ผู้สูงอายุ {settings.seniorDiscount}% · นักเรียน {settings.studentDiscount}% · ผู้พิการ {settings.disabledDiscount}% · แจ้งเตือน {settings.renewalReminderDays} วัน</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-[13px] font-semibold text-[#667085] hover:text-[#344054] px-4 py-2 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            คืนค่าเริ่มต้น
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="flex items-center gap-2 text-[13px] font-bold px-5 py-2.5 rounded-xl transition-colors bg-[#0f1260] text-white hover:bg-[#171b82] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}
