"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const HERO_BG = "/assets/hero-bg.jpg";
const BKS_LOGO = "/assets/bks-logo.png";

export default function Home() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round">("one-way");
  const [from, setFrom] = useState("กรุงเทพมหานคร");
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

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171b82]/60 via-[#171b82]/40 to-[#0d0e2a]/70" />

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-[900px] mx-auto py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={BKS_LOGO} alt="BKS" className="h-14 w-auto brightness-0 invert" />
            <h1 className="text-white text-[30px] font-bold leading-tight">
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
              <div className="flex-1">
                <label className="block text-[12px] text-[#667085] mb-1.5">ต้นทาง</label>
                <div className="flex items-center border border-[#d0d5dd] rounded-lg px-3 py-2.5 gap-2 focus-within:ring-1 focus-within:ring-[#171b82] focus-within:border-[#171b82]">
                  <svg className="text-[#667085] shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <input
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="flex-1 text-[14px] font-medium text-[#101828] outline-none bg-transparent"
                    placeholder="เลือกต้นทาง"
                  />
                </div>
              </div>

              <button
                onClick={handleSwap}
                className="mb-0.5 w-9 h-9 rounded-full border border-[#d0d5dd] flex items-center justify-center hover:bg-[#f0f0f0] shrink-0"
                title="สลับต้นทาง-ปลายทาง"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#344054" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
              </button>

              <div className="flex-1">
                <label className="block text-[12px] text-[#667085] mb-1.5">ปลายทาง</label>
                <div className="flex items-center border border-[#d0d5dd] rounded-lg px-3 py-2.5 gap-2 focus-within:ring-1 focus-within:ring-[#171b82] focus-within:border-[#171b82]">
                  <svg className="text-[#667085] shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <input
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="flex-1 text-[14px] font-medium text-[#101828] outline-none bg-transparent"
                    placeholder="เลือกปลายทาง"
                  />
                </div>
              </div>
            </div>

            {/* Date / Passengers / Search */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[12px] text-[#667085] mb-1.5">วันที่เดินทาง</label>
                <div className="flex items-center border border-[#d0d5dd] rounded-lg px-3 py-2.5 gap-2">
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
