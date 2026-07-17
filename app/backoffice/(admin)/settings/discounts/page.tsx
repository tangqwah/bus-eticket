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

/* ── Modal ───────────────────────────────────────────────────── */

type DiscountModalProps = {
  title: string;
  value: number;
  onClose: () => void;
  onSave: (v: number) => void;
};

function DiscountModal({ title, value: initial, onClose, onSave }: DiscountModalProps) {
  const [draft, setDraft] = useState(initial);
  const presets = [0, 25, 50, 75, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[440px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="text-[15px] font-bold text-[#101828]">แก้ไขส่วนลด — {title}</div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#344054] p-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Big value display */}
          <div className="flex items-center justify-center">
            <div className="text-[72px] font-black text-[#101828] leading-none tabular-nums">{draft}</div>
            <div className="text-[28px] font-bold text-[#667085] self-end mb-3 ml-1">%</div>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={draft}
              onChange={e => setDraft(Number(e.target.value))}
              className="w-full accent-[#171b82] h-2"
            />
            <div className="flex justify-between text-[10px] text-[#9ca3af] font-medium">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setDraft(p)}
                className={`flex-1 text-[12px] font-bold py-2 rounded-lg transition-colors ${
                  draft === p
                    ? "bg-[#0f1260] text-white"
                    : "bg-[#f3f4f6] text-[#667085] hover:bg-[#e5e7eb]"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex items-center gap-3">
            <label className="text-[12px] font-semibold text-[#344054] shrink-0">กำหนดเอง:</label>
            <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden">
              <input
                type="number"
                min={0}
                max={100}
                value={draft}
                onChange={e => setDraft(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-16 px-2 py-2 text-[13px] text-center text-[#101828] outline-none"
              />
              <span className="pr-3 text-[13px] text-[#667085] font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f3f4f6] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-[13px] font-semibold text-[#667085] hover:text-[#344054] px-4 py-2.5 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="flex items-center gap-2 text-[13px] font-bold px-5 py-2.5 rounded-xl bg-[#0f1260] text-white hover:bg-[#171b82] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

type RenewalModalProps = {
  value: number;
  onClose: () => void;
  onSave: (v: number) => void;
};

function RenewalModal({ value: initial, onClose, onSave }: RenewalModalProps) {
  const [draft, setDraft] = useState(initial);
  const presets = [7, 14, 30, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[440px] mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="text-[15px] font-bold text-[#101828]">แก้ไขการแจ้งเตือนก่อนหมดอายุ</div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#344054] p-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="text-[72px] font-black text-[#b45309] leading-none tabular-nums">{draft}</div>
            <div className="text-[18px] font-bold text-[#667085] self-end mb-4 ml-2">วัน</div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={7}
              max={90}
              step={1}
              value={draft}
              onChange={e => setDraft(Number(e.target.value))}
              className="w-full accent-[#b45309] h-2"
            />
            <div className="flex justify-between text-[10px] text-[#9ca3af] font-medium">
              <span>7 วัน</span><span>30 วัน</span><span>60 วัน</span><span>90 วัน</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {presets.map(d => (
              <button
                key={d}
                onClick={() => setDraft(d)}
                className={`text-[12px] font-bold px-4 py-2 rounded-lg transition-colors ${
                  draft === d
                    ? "bg-[#b45309] text-white"
                    : "bg-[#f3f4f6] text-[#667085] hover:bg-[#e5e7eb]"
                }`}
              >
                {d} วัน
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[12px] font-semibold text-[#344054] shrink-0">กำหนดเอง:</label>
            <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden">
              <input
                type="number"
                min={7}
                max={90}
                value={draft}
                onChange={e => setDraft(Math.min(90, Math.max(7, Number(e.target.value))))}
                className="w-16 px-2 py-2 text-[13px] text-center text-[#101828] outline-none"
              />
              <span className="pr-3 text-[12px] text-[#667085] font-medium whitespace-nowrap">วัน</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#f3f4f6] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-[13px] font-semibold text-[#667085] hover:text-[#344054] px-4 py-2.5 rounded-lg hover:bg-[#f3f4f6] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => { onSave(draft); onClose(); }}
            className="flex items-center gap-2 text-[13px] font-bold px-5 py-2.5 rounded-xl bg-[#0f1260] text-white hover:bg-[#171b82] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Display Card ─────────────────────────────────────────────── */

type CardConfig = {
  key: keyof Settings;
  title: string;
  subtitle: string;
  iconBg: string;
  icon: React.ReactNode;
  unit: string;
};

function SettingCard({
  config,
  value,
  onEdit,
}: {
  config: CardConfig;
  value: number;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex items-center gap-5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-[#101828]">{config.title}</div>
        <div className="text-[12px] text-[#667085] mt-0.5">{config.subtitle}</div>
      </div>
      <div className="text-right mr-2 shrink-0">
        <div className="text-[32px] font-black text-[#101828] leading-none tabular-nums">{value}{config.unit}</div>
        <div className="text-[10px] text-[#9ca3af] font-medium mt-1">ค่าปัจจุบัน</div>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#171b82] border border-[#c7caee] bg-[#f0f2ff] hover:bg-[#e0e3ff] px-3.5 py-2 rounded-lg transition-colors shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        แก้ไข
      </button>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

type ModalKey = keyof Settings | null;

export default function DiscountSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<ModalKey>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bks_discount_settings");
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const handleSave = (key: keyof Settings, value: number) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem("bks_discount_settings", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    localStorage.setItem("bks_discount_settings", JSON.stringify(DEFAULTS));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const discountCards: CardConfig[] = [
    {
      key: "employeeDiscount",
      title: "พนักงาน บขส.",
      subtitle: "ส่วนลดค่าโดยสารสำหรับพนักงาน บขส.",
      iconBg: "bg-[#f0f2ff] text-[#171b82]",
      unit: "%",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
    },
    {
      key: "officialDiscount",
      title: "ข้าราชการ/ทหาร",
      subtitle: "ส่วนลดค่าโดยสารสำหรับข้าราชการและทหาร",
      iconBg: "bg-[#f5f3ff] text-[#6d28d9]",
      unit: "%",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      key: "seniorDiscount",
      title: "ผู้สูงอายุ",
      subtitle: "อายุ 60 ปีขึ้นไป — ยืนยันด้วยบัตรประชาชน (ไม่มีวันหมดอายุ)",
      iconBg: "bg-[#fffbeb] text-[#b45309]",
      unit: "%",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
    },
    {
      key: "studentDiscount",
      title: "เด็กนักเรียน/นักศึกษา",
      subtitle: "ยืนยันด้วยบัตรนักเรียน/นักศึกษา (ต่ออายุปีละครั้ง)",
      iconBg: "bg-[#f0fdfa] text-[#0f766e]",
      unit: "%",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
    },
    {
      key: "disabledDiscount",
      title: "ผู้พิการ",
      subtitle: "ยืนยันด้วยบัตรประจำตัวคนพิการ (ต่ออายุตามกำหนด)",
      iconBg: "bg-[#fff1f2] text-[#9f1239]",
      unit: "%",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="4" r="2"/>
          <path d="M9 10h4l2 8M9 10v5"/>
          <circle cx="8" cy="19" r="2"/>
          <circle cx="16" cy="19" r="2"/>
          <path d="M15 15l1.5 4"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-[720px]">
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

      {/* Discount cards — 1 per row */}
      {discountCards.map(card => (
        <SettingCard
          key={card.key}
          config={card}
          value={settings[card.key] as number}
          onEdit={() => setModal(card.key)}
        />
      ))}

      {/* Renewal reminder card */}
      <SettingCard
        config={{
          key: "renewalReminderDays",
          title: "การแจ้งเตือนก่อนหมดอายุ",
          subtitle: "แจ้งเตือนเมื่อสิทธิ์สมาชิกใกล้หมดอายุ",
          iconBg: "bg-[#fffbeb] text-[#b45309]",
          unit: " วัน",
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          ),
        }}
        value={settings.renewalReminderDays}
        onEdit={() => setModal("renewalReminderDays")}
      />

      {/* Footer bar */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex items-center justify-between">
        <div className="text-[12px] text-[#9ca3af]">
          พนักงาน {settings.employeeDiscount}% · ข้าราชการ {settings.officialDiscount}% · ผู้สูงอายุ {settings.seniorDiscount}% · นักเรียน {settings.studentDiscount}% · ผู้พิการ {settings.disabledDiscount}% · แจ้งเตือน {settings.renewalReminderDays} วัน
        </div>
        <button
          onClick={handleReset}
          className="text-[12px] font-semibold text-[#667085] hover:text-[#344054] px-3 py-2 rounded-lg hover:bg-[#f3f4f6] transition-colors shrink-0"
        >
          คืนค่าเริ่มต้น
        </button>
      </div>

      {/* Modals */}
      {modal && modal !== "renewalReminderDays" && (
        <DiscountModal
          title={discountCards.find(c => c.key === modal)?.title ?? ""}
          value={settings[modal] as number}
          onClose={() => setModal(null)}
          onSave={v => handleSave(modal, v)}
        />
      )}
      {modal === "renewalReminderDays" && (
        <RenewalModal
          value={settings.renewalReminderDays}
          onClose={() => setModal(null)}
          onSave={v => handleSave("renewalReminderDays", v)}
        />
      )}
    </div>
  );
}
