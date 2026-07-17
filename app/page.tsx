"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const HERO_BG = "/assets/hero-bg.jpg";
const BKS_LOGO = "/assets/bks-logo.png";

const STATIONS: { region: string; stations: string[] }[] = [
  {
    region: "กรุงเทพมหานครและปริมณฑล",
    stations: [
      "กรุงเทพฯ (สถานีขนส่งสายใต้ใหม่)",
      "กรุงเทพฯ (สถานีขนส่งหมอชิต 2)",
      "กรุงเทพฯ (สถานีขนส่งเอกมัย)",
      "นนทบุรี",
      "ปทุมธานี",
      "นครปฐม",
    ],
  },
  {
    region: "ภาคเหนือ",
    stations: [
      "เชียงใหม่",
      "เชียงราย",
      "ลำปาง",
      "ลำพูน",
      "แพร่",
      "น่าน",
      "พะเยา",
      "แม่ฮ่องสอน",
      "พิษณุโลก",
      "สุโขทัย",
      "ตาก",
      "อุตรดิตถ์",
      "กำแพงเพชร",
      "นครสวรรค์",
      "พิจิตร",
    ],
  },
  {
    region: "ภาคตะวันออกเฉียงเหนือ",
    stations: [
      "ขอนแก่น",
      "อุดรธานี",
      "หนองคาย",
      "นครราชสีมา",
      "บุรีรัมย์",
      "สุรินทร์",
      "อุบลราชธานี",
      "ร้อยเอ็ด",
      "มหาสารคาม",
      "ชัยภูมิ",
      "สกลนคร",
      "นครพนม",
      "มุกดาหาร",
      "ยโสธร",
      "อำนาจเจริญ",
      "เลย",
      "หนองบัวลำภู",
      "กาฬสินธุ์",
      "ศรีสะเกษ",
    ],
  },
  {
    region: "ภาคกลาง",
    stations: [
      "สุพรรณบุรี",
      "กาญจนบุรี",
      "ราชบุรี",
      "เพชรบุรี",
      "ประจวบคีรีขันธ์",
      "สมุทรสาคร",
      "อยุธยา",
      "สระบุรี",
      "ลพบุรี",
      "สิงห์บุรี",
      "ชัยนาท",
      "อ่างทอง",
    ],
  },
  {
    region: "ภาคตะวันออก",
    stations: [
      "ชลบุรี",
      "พัทยา",
      "ระยอง",
      "จันทบุรี",
      "ตราด",
      "สระแก้ว",
      "ปราจีนบุรี",
      "ฉะเชิงเทรา",
    ],
  },
  {
    region: "ภาคใต้",
    stations: [
      "ชุมพร",
      "สุราษฎร์ธานี",
      "นครศรีธรรมราช",
      "สงขลา (หาดใหญ่)",
      "ภูเก็ต",
      "กระบี่",
      "ตรัง",
      "พัทลุง",
      "สตูล",
      "ปัตตานี",
      "ยะลา",
      "นราธิวาส",
      "ระนอง",
      "พังงา",
      "สุราษฎร์ธานี (เกาะสมุย)",
    ],
  },
];

const ALL_STATIONS = STATIONS.flatMap(g => g.stations);

function StationSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? ALL_STATIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : ALL_STATIONS;

  const grouped = STATIONS.map(g => ({
    region: g.region,
    stations: g.stations.filter(s => filtered.includes(s)),
  })).filter(g => g.stations.length > 0);

  const handleSelect = (station: string) => {
    onChange(station);
    setOpen(false);
    setQuery("");
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="flex-1 relative" ref={ref}>
      <label className="block text-[12px] text-[#667085] mb-1.5">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center gap-2 border rounded-lg px-3 py-2.5 text-left transition-all ${
          open
            ? "border-[#171b82] ring-1 ring-[#171b82]"
            : "border-[#d0d5dd] hover:border-[#9ca3af]"
        }`}
      >
        <svg className="text-[#667085] shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
        <span className={`flex-1 text-[14px] font-medium truncate ${value ? "text-[#101828]" : "text-[#9ca3af]"}`}>
          {value || `เลือก${label}`}
        </span>
        <svg className={`shrink-0 text-[#667085] transition-transform ${open ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[#f3f4f6]">
            <div className="flex items-center gap-2 bg-[#f9fafb] rounded-lg px-3 py-2">
              <svg className="text-[#9ca3af] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ค้นหาสถานี..."
                className="flex-1 text-[13px] text-[#101828] outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[#9ca3af] hover:text-[#344054]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Station list */}
          <div className="max-h-[280px] overflow-y-auto">
            {grouped.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#9ca3af]">ไม่พบสถานี</div>
            ) : (
              grouped.map(group => (
                <div key={group.region}>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider bg-[#f9fafb] sticky top-0">
                    {group.region}
                  </div>
                  {group.stations.map(station => (
                    <button
                      key={station}
                      type="button"
                      onClick={() => handleSelect(station)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[14px] hover:bg-[#f0f2ff] transition-colors ${
                        station === value ? "bg-[#f0f2ff] text-[#171b82] font-semibold" : "text-[#344054]"
                      }`}
                    >
                      <svg className={station === value ? "text-[#171b82]" : "text-[#d0d5dd]"} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                      </svg>
                      {station}
                      {station === value && (
                        <svg className="ml-auto text-[#171b82]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round">("one-way");
  const [from, setFrom] = useState("กรุงเทพฯ (สถานีขนส่งสายใต้ใหม่)");
  const [to, setTo] = useState("ขอนแก่น");
  const [date, setDate] = useState("2026-06-26");
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171b82]/60 via-[#171b82]/40 to-[#0d0e2a]/70" />

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-[900px] mx-auto py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={BKS_LOGO} alt="BKS" className="h-14 w-auto brightness-0 invert" />
            <h1 className="text-white text-[30px] font-semibold leading-tight">
              จองตั๋วรถโดยสารออนไลน์
            </h1>
            <p className="text-white/75 text-[15px] font-light">บริษัท ขนส่ง จำกัด (บขส)</p>
          </div>

          {/* Search card */}
          <div className="w-full bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex gap-6">
              {(["one-way", "round"] as const).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === t}
                    onChange={() => setTripType(t)}
                    className="accent-[#cd416e] w-4 h-4"
                  />
                  <span className="text-[14px] font-medium text-[#344054]">
                    {t === "one-way" ? "เที่ยวเดียว" : "ไป-กลับ"}
                  </span>
                </label>
              ))}
            </div>

            {/* From / To */}
            <div className="flex items-end gap-3">
              <StationSelect label="ต้นทาง" value={from} onChange={setFrom} />

              <button
                onClick={handleSwap}
                className="mb-0.5 w-9 h-9 rounded-full border border-[#d0d5dd] flex items-center justify-center hover:bg-[#f0f0f0] shrink-0"
                title="สลับต้นทาง-ปลายทาง"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </button>

              <StationSelect label="ปลายทาง" value={to} onChange={setTo} />
            </div>

            {/* Date / Passengers / Search */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[12px] text-[#667085] mb-1.5">วันที่เดินทาง</label>
                <div className="flex items-center border border-[#d0d5dd] rounded-lg px-3 py-2.5 gap-2 hover:border-[#9ca3af]">
                  <svg className="text-[#667085] shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="flex-1 text-[14px] font-medium text-[#101828] outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="w-[180px]">
                <label className="block text-[12px] text-[#667085] mb-1.5">ผู้โดยสาร</label>
                <div className="flex items-center border border-[#d0d5dd] rounded-lg px-3 py-2.5 gap-2">
                  <svg className="text-[#667085] shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <div className="flex items-center gap-3 flex-1 justify-between">
                    <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-5 h-5 rounded-full border border-[#d0d5dd] flex items-center justify-center text-[#344054] hover:bg-[#f9fafb] text-lg leading-none">−</button>
                    <span className="text-[14px] font-semibold text-[#101828]">{passengers} คน</span>
                    <button onClick={() => setPassengers(Math.min(9, passengers + 1))} className="w-5 h-5 rounded-full border border-[#d0d5dd] flex items-center justify-center text-[#344054] hover:bg-[#f9fafb] text-lg leading-none">+</button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/search")}
                className="bg-[#171b82] text-white text-[15px] font-semibold px-7 py-[11px] rounded-lg flex items-center gap-2 hover:bg-[#131566] shrink-0"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
                </svg>
                ค้นหาเที่ยวรถ
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-8">
            {[
              { icon: "🛡️", text: "ชำระเงินปลอดภัย" },
              { icon: "💰", text: "ราคารวมทุกอย่าง" },
              { icon: "🎫", text: "ได้รับ E-Ticket" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2 text-white/90 text-[14px] font-medium">
                <span className="text-lg">{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
