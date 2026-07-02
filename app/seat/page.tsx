"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";

const BOOKED = ["A1", "B2", "C1", "D1", "C2", "A4", "B4", "D3", "C5", "D6", "A7", "B6", "C7"];

const PASSENGERS = [
  { name: "นายบ๊อบบี้ คิ้วบาก" },
  { name: "นางสาวฮันนี่ สะเต้อ" },
];

const ROWS = 9;

export default function SeatPage() {
  const router = useRouter();
  // seats[i] = seat ID assigned to passenger i, or null if unassigned
  const [seats, setSeats] = useState<(string | null)[]>(PASSENGERS.map(() => null));
  // which passenger is currently being assigned a seat
  const [activePax, setActivePax] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 45);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const ownerOf = (id: string) => seats.findIndex(s => s === id);

  const handleSeatClick = (id: string) => {
    if (BOOKED.includes(id)) return;

    const owner = ownerOf(id);

    if (owner === activePax) {
      // Deselect own seat
      setSeats(prev => prev.map((s, i) => i === activePax ? null : s));
      return;
    }

    if (owner !== -1) {
      // Seat belongs to another passenger — do nothing
      return;
    }

    // Assign to active passenger
    setSeats(prev => prev.map((s, i) => i === activePax ? id : s));

    // Auto-advance to next passenger without a seat
    const next = seats.findIndex((s, i) => s === null && i !== activePax);
    if (next !== -1) setActivePax(next);
  };

  const allAssigned = seats.every(s => s !== null);

  const SeatCell = ({ id }: { id: string }) => {
    const owner = ownerOf(id);
    const isBooked = BOOKED.includes(id);
    const isOwnedByActive = owner === activePax;
    const isOwnedByOther = owner !== -1 && owner !== activePax;

    let cls = "";
    let content: React.ReactNode = <span className="text-[11px]">{id}</span>;

    if (isBooked) {
      cls = "bg-[#f3f4f6] border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed";
      content = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
    } else if (isOwnedByActive) {
      cls = "bg-[#cd416e] border-[#cd416e] text-white";
      content = <span className="text-[13px] font-bold">{owner + 1}</span>;
    } else if (isOwnedByOther) {
      cls = "bg-[#171b82] border-[#171b82] text-white cursor-default";
      content = <span className="text-[13px] font-bold">{owner + 1}</span>;
    } else {
      cls = "bg-white border-[#079455] text-[#079455] hover:bg-[#f0fdf4]";
    }

    return (
      <button
        onClick={() => handleSeatClick(id)}
        disabled={isBooked || isOwnedByOther}
        className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all ${cls}`}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={3} />

      {/* Timer */}
      <div className="bg-[#fffbeb] border-b border-[#fde68a]">
        <div className="max-w-[1100px] mx-auto px-4 py-2.5 flex items-center gap-2 text-[14px] font-medium text-[#92400e]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          กรุณาเลือกที่นั่งภายใน{" "}
          <span className="font-bold text-[#b45309]">{mm}:{ss}</span>
          {" "}นาที มิฉะนั้นการจองจะถูกยกเลิก
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 w-full flex gap-6">
        {/* Seat map */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-[15px] font-semibold text-[#101828] mb-4">ผังที่นั่ง</h3>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-5">
              {[
                { cls: "border-[#079455] bg-white", label: "ว่าง" },
                { cls: "bg-[#f3f4f6] border-[#e5e7eb]", label: "ถูกจองแล้ว" },
                { cls: "bg-[#cd416e] border-[#cd416e]", label: "ที่นั่งที่กำลังเลือก" },
                { cls: "bg-[#171b82] border-[#171b82]", label: "ผู้โดยสารอื่น" },
              ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded border-2 ${cls}`} />
                  <span className="text-[13px] text-[#667085]">{label}</span>
                </div>
              ))}
            </div>

            {/* Column headers */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-[280px] bg-[#f9fafb] rounded-lg py-2 text-center text-[12px] text-[#9ca3af] font-medium border border-[#e5e7eb] mb-2">
                🚌 คนขับ
              </div>

              {/* Column labels */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5" />
                <span className="w-10 text-center text-[11px] font-semibold text-[#9ca3af]">A</span>
                <span className="w-10 text-center text-[11px] font-semibold text-[#9ca3af]">B</span>
                <span className="w-5" />
                <span className="w-10 text-center text-[11px] font-semibold text-[#9ca3af]">C</span>
                <span className="w-10 text-center text-[11px] font-semibold text-[#9ca3af]">D</span>
              </div>

              {/* Seat rows */}
              <div className="flex flex-col gap-2">
                {Array.from({ length: ROWS }, (_, i) => i + 1).map(row => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-5 text-[12px] text-[#9ca3af] text-right">{row}</span>
                    <SeatCell id={`A${row}`} />
                    <SeatCell id={`B${row}`} />
                    <div className="w-5" />
                    <SeatCell id={`C${row}`} />
                    <SeatCell id={`D${row}`} />
                  </div>
                ))}
              </div>

              {/* Special rows */}
              <div className="w-full max-w-[280px] mt-2 flex flex-col gap-1">
                {["ประตูฉุกเฉิน", "ห้องน้ำ", "ห้องนอน พขร."].map(label => (
                  <div key={label} className="bg-[#f9fafb] rounded-lg py-2 text-center text-[12px] text-[#9ca3af] font-medium border border-[#e5e7eb]">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[300px] shrink-0 flex flex-col gap-4">
          {/* Passenger selector */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4">
            <h4 className="text-[14px] font-semibold text-[#101828] mb-1">เลือกผู้โดยสาร</h4>
            <p className="text-[12px] text-[#667085] mb-3">คลิกชื่อผู้โดยสาร แล้วเลือกที่นั่งในผัง</p>
            <div className="flex flex-col gap-2">
              {PASSENGERS.map((pax, i) => {
                const isActive = activePax === i;
                const hasSeat = seats[i] !== null;
                return (
                  <button
                    key={i}
                    onClick={() => setActivePax(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? "border-[#cd416e] bg-[#fff0f4]"
                        : "border-[#e5e7eb] bg-white hover:border-[#d0d5dd]"
                    }`}
                  >
                    {/* Number badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                      isActive ? "bg-[#cd416e] text-white" : hasSeat ? "bg-[#171b82] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"
                    }`}>
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-semibold truncate ${isActive ? "text-[#cd416e]" : "text-[#344054]"}`}>
                        {pax.name}
                      </div>
                      {isActive && !hasSeat && (
                        <div className="text-[11px] text-[#cd416e] mt-0.5">กำลังเลือกที่นั่ง...</div>
                      )}
                    </div>

                    {/* Seat badge */}
                    <div className={`text-[14px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                      hasSeat
                        ? isActive ? "bg-[#cd416e] text-white" : "bg-[#171b82] text-white"
                        : "bg-[#f3f4f6] text-[#9ca3af] text-[12px]"
                    }`}>
                      {hasSeat ? seats[i] : "—"}
                    </div>
                  </button>
                );
              })}
            </div>

            {!allAssigned && (
              <p className="text-[12px] text-[#cd416e] mt-3">
                ยังเหลืออีก {seats.filter(s => s === null).length} ที่นั่งที่ต้องเลือก
              </p>
            )}
            {allAssigned && (
              <p className="text-[12px] text-[#079455] mt-3 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                เลือกที่นั่งครบแล้ว
              </p>
            )}
          </div>

          {/* Price */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4">
            <h4 className="text-[14px] font-semibold text-[#101828] mb-3">สรุปราคา</h4>
            <div className="flex justify-between text-[13.5px] text-[#667085] mb-2">
              <span>เที่ยวไป x {PASSENGERS.length}</span>
              <span className="text-[#344054]">{(427 * PASSENGERS.length).toLocaleString()} บาท</span>
            </div>
            <div className="border-t border-[#f3f4f6] pt-2 flex justify-between font-bold text-[#101828] text-[15px]">
              <span>รวมทั้งหมด</span>
              <span className="text-[#a43458]">{(427 * PASSENGERS.length).toLocaleString()} บาท</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] py-4">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/passenger")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#344054] hover:text-[#101828]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            กลับ
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[20px] font-bold text-[#a43458]">{(427 * PASSENGERS.length).toLocaleString()} บาท</div>
              <div className="text-[12px] text-[#667085]">ราคารวม</div>
            </div>
            <button
              onClick={() => router.push("/review")}
              disabled={!allAssigned}
              className="bg-[#171b82] text-white text-[15px] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#131566] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป · ตรวจสอบ
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
