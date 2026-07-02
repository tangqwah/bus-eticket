"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";

const BUS_LOGO = "/assets/bks-bus-logo.png";

const BUSES = [
  { id: 1, route: "กรุงเทพฯ-ขอนแก่น", type: "รถด่วน", typeColor: "#f59e0b", dep: "09:00", arr: "15:30", dur: "6ชม. 30น.", seats: 12, price: 427 },
  { id: 2, route: "กรุงเทพฯ-กระนวน-บ้านแพง", type: "ม.1ข", typeColor: "#6b7280", dep: "18:00", arr: "01:30", dur: "7ชม. 30น.", seats: 8, price: 578 },
  { id: 3, route: "กรุงเทพฯ-ขอนแก่น", type: "รถด่วน", typeColor: "#f59e0b", dep: "20:00", arr: "02:30", dur: "6ชม. 30น.", seats: 24, price: 427 },
  { id: 4, route: "กรุงเทพฯ-ขอนแก่น", type: "ม.1ก", typeColor: "#6b7280", dep: "21:00", arr: "03:30", dur: "6ชม. 30น.", seats: 3, price: 380 },
  { id: 5, route: "กรุงเทพฯ-ขอนแก่น (VIP)", type: "รถด่วนพิเศษ", typeColor: "#7c3aed", dep: "21:30", arr: "04:00", dur: "6ชม. 30น.", seats: 20, price: 620 },
  { id: 6, route: "กรุงเทพฯ-ขอนแก่น", type: "รถด่วน", typeColor: "#f59e0b", dep: "22:00", arr: "04:30", dur: "6ชม. 30น.", seats: 16, price: 427 },
  { id: 7, route: "กรุงเทพฯ-ขอนแก่น", type: "ม.1ข", typeColor: "#6b7280", dep: "23:00", arr: "05:30", dur: "6ชม. 30น.", seats: 5, price: 380 },
];

export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={1} />

      {/* Summary bar */}
      <div className="bg-[#cd416e] text-white py-3">
        <div className="max-w-[900px] mx-auto px-4 flex items-center justify-between text-[14px] font-medium">
          <div className="flex items-center gap-3">
            <span className="font-semibold">กรุงเทพมหานคร</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span className="font-semibold">ขอนแก่น</span>
            <span className="text-white/70 mx-2">·</span>
            <span>ศ. 26 มิ.ย. 2569</span>
            <span className="text-white/70 mx-2">·</span>
            <span>1 ผู้โดยสาร</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[13px] font-semibold"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4v16h16v-7"/><path d="M9 15L20 4"/><path d="M15 4h5v5"/></svg>
            แก้ไข
          </button>
        </div>
      </div>

      {/* Bus list */}
      <div className="max-w-[900px] mx-auto px-4 py-6 w-full flex flex-col gap-3">
        <p className="text-[13px] text-[#667085]">พบ {BUSES.length} เที่ยวรถ</p>

        {BUSES.map(bus => (
          <div key={bus.id} className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4">
            {/* Logo */}
            <img src={BUS_LOGO} alt="BKS" className="w-14 h-14 object-contain shrink-0" />

            {/* Route + Type */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[15px] font-semibold text-[#101828] truncate">{bus.route}</span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                  style={{ backgroundColor: bus.typeColor }}
                >
                  {bus.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[12.5px] text-[#667085]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ใช้เวลา {bus.dur}
              </div>
            </div>

            {/* Times */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <div className="text-[20px] font-bold text-[#101828]">{bus.dep}</div>
                <div className="text-[11px] text-[#667085]">ออกเดินทาง</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-px bg-[#d0d5dd] relative">
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[20px] font-bold text-[#101828]">{bus.arr}</div>
                <div className="text-[11px] text-[#667085]">ถึงปลายทาง</div>
              </div>
            </div>

            {/* Seats + Price + Button */}
            <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
              <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${bus.seats <= 5 ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#d1fae5] text-[#065f46]"}`}>
                เหลือ {bus.seats} ที่นั่ง
              </span>
              <div className="text-right">
                <div className="text-[22px] font-bold text-[#a43458]">{bus.price.toLocaleString()}</div>
                <div className="text-[11px] text-[#667085]">บาท/ที่นั่ง</div>
              </div>
              <button
                onClick={() => router.push("/passenger")}
                className="bg-[#171b82] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#131566] whitespace-nowrap"
              >
                เลือกเที่ยวรถนี้
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
