"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";
import { readDraft, thaiDateLong, cityOf, stationOf, paxFullName, type BookingDraft } from "@/lib/bookingStore";

const BKS_LOGO = "/assets/bks-logo.png";

const GENDER_LABEL: Record<string, string> = {
  male:   "ผู้ใหญ่ (ชาย)",
  female: "ผู้ใหญ่ (หญิง)",
  child:  "เด็ก",
};

function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 60 }, (_, i) => {
    const v = ((seed.charCodeAt(i % seed.length) * (i + 1)) % 30) + 1;
    return { width: v > 20 ? 3 : v > 10 ? 2 : 1, gap: v > 15 ? 2 : 1 };
  });
  return (
    <div className="flex items-center h-12">
      {bars.map((b, i) => (
        <div key={i} className="flex" style={{ gap: `${b.gap}px` }}>
          <div style={{ width: `${b.width}px`, height: "48px", backgroundColor: "#101828" }} />
          <div style={{ width: `${b.gap}px` }} />
        </div>
      ))}
    </div>
  );
}

export default function ConfirmationPage() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const d = readDraft();
    if (!d || !d.passengers || !d.seats) return;
    setDraft(d);
    setReady(true);
  }, []);

  if (!ready || !draft || !draft.passengers || !draft.seats) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9fafb]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <p className="text-[16px] text-[#344054] font-semibold">ไม่พบข้อมูลการจอง</p>
          <Link href="/" className="text-[14px] font-semibold text-[#171b82] hover:underline">กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  const { passengers, seats, bookingNo = "BKS-XXXXXX" } = draft;
  const fromCity    = cityOf(draft.from);
  const fromStation = stationOf(draft.from) ?? fromCity;
  const toCity      = cityOf(draft.to);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={6} />

      <div className="max-w-[780px] mx-auto px-4 py-8 w-full">
        {/* Success banner */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#079455" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold text-[#101828]">ชำระเงินสำเร็จ!</h1>
          <p className="text-[15px] text-[#667085]">
            ตั๋วโดยสารอิเล็กทรอนิกส์ได้ถูกส่งไปยังอีเมลของท่านแล้ว
          </p>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-5 py-2.5 text-[14px] text-[#065f46] font-medium">
            หมายเลขการจอง: <span className="font-semibold text-[#047857]">{bookingNo}</span>
          </div>
        </div>

        {/* E-Tickets */}
        <div className="flex flex-col gap-5">
          {passengers.map((pax, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#ece9ec] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Ticket header */}
              <div className="bg-[#171b82] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={BKS_LOGO} alt="BKS" className="h-8 w-auto brightness-0 invert" />
                  <div>
                    <div className="text-white/80 text-[11px] font-medium uppercase tracking-wider">ตั๋วโดยสารอิเล็กทรอนิกส์ / E-Ticket</div>
                    <div className="text-white text-[13px] font-semibold">เที่ยวเดียว · {GENDER_LABEL[pax.gender] ?? "ผู้โดยสาร"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/70 text-[11px]">เลขที่การจอง</div>
                  <div className="text-white text-[16px] font-semibold tracking-wider">{bookingNo}</div>
                </div>
              </div>

              {/* Ticket body */}
              <div className="p-5">
                {/* Route */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-center">
                    <div className="text-[26px] font-semibold text-[#101828]">{draft.dep}</div>
                    <div className="text-[13px] font-semibold text-[#344054]">{fromCity}</div>
                    <div className="text-[11px] text-[#9ca3af] mt-0.5">{fromStation}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[11px] text-[#9ca3af]">{draft.dur}</div>
                    <div className="w-full h-px bg-[#d0d5dd] relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d0d5dd]" />
                      <svg className="absolute top-1/2 right-0 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <span className="text-[11px] bg-[#f3f4f6] text-[#667085] px-2 py-0.5 rounded-full font-medium">{draft.busType}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-[26px] font-semibold text-[#101828]">{draft.arr}</div>
                    <div className="text-[13px] font-semibold text-[#344054]">{toCity}</div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-3 gap-3 bg-[#f9fafb] rounded-xl p-4 mb-5 text-[13px]">
                  {[
                    ["วันที่เดินทาง", thaiDateLong(draft.date)],
                    ["ผู้โดยสาร", paxFullName(pax)],
                    ["ที่นั่ง", seats[i]],
                    ["เลขที่ตั๋ว", `${bookingNo}-${i + 1}`],
                    ["ราคา", `${draft.pricePerSeat.toLocaleString()} บาท`],
                    ["จุดรับ", pax.pickup],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-[#9ca3af] text-[11px] mb-0.5">{label}</div>
                      <div className={`font-semibold ${label === "ที่นั่ง" ? "text-[#cd416e] text-[16px]" : "text-[#344054]"}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Tear line */}
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#d1d5db"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18" stroke="#d1d5db" fill="none"/><path d="M16 10a4 4 0 01-8 0" stroke="#d1d5db" fill="none"/></svg>
                  <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
                </div>

                {/* Barcode */}
                <div className="flex flex-col items-center gap-3">
                  <Barcode seed={`${bookingNo}-${i}`} />
                  <div className="text-[16px] font-semibold text-[#101828] tracking-[0.2em]">{bookingNo}</div>
                  <div className="text-[12px] text-[#667085] text-center">
                    แสดงรหัสนี้ที่ช่องตรวจตั๋วก่อนขึ้นรถ
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-[#d0d5dd] bg-white text-[#344054] text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#f9fafb]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            พิมพ์ตั๋ว
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#171b82] text-white text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#131566]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
