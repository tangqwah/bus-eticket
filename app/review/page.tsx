"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";

const PASSENGERS = [
  { name: "นายบ๊อบบี้ คิ้วบาก", idNumber: "1234567890123", seat: "A3", pickup: "สถานีขนส่งสายใต้ใหม่" },
  { name: "นางสาวฮันนี่ สะเต้อ", idNumber: "9876543210987", seat: "B3", pickup: "สถานีขนส่งสายใต้ใหม่" },
];

export default function ReviewPage() {
  const router = useRouter();
  const total = 427 * PASSENGERS.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={4} />

      <div className="max-w-[1100px] mx-auto px-4 py-6 w-full flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {/* Trip details */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-[#f9fafb] border-b border-[#ece9ec] px-5 py-3 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#101828]">รายละเอียดเที่ยวรถ</h3>
              <button onClick={() => router.push("/search")} className="text-[13px] font-semibold text-[#171b82] hover:underline">แก้ไข</button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-[28px] font-semibold text-[#101828]">09:00</div>
                  <div className="text-[13px] text-[#667085]">กรุงเทพมหานคร</div>
                  <div className="text-[12px] text-[#9ca3af]">สถานีขนส่งสายใต้ใหม่</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[12px] text-[#667085]">6ชม. 30น.</div>
                  <div className="flex-1 w-full h-px bg-[#d0d5dd] relative">
                    <svg className="absolute top-1/2 right-0 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <span className="text-[12px] text-[#667085] bg-[#f3f4f6] px-2 py-0.5 rounded-full">รถด่วน</span>
                </div>
                <div className="text-center">
                  <div className="text-[28px] font-semibold text-[#101828]">15:30</div>
                  <div className="text-[13px] text-[#667085]">ขอนแก่น</div>
                  <div className="text-[12px] text-[#9ca3af]">สถานีขนส่งขอนแก่น</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-[#f9fafb] rounded-lg p-3 text-[13px]">
                {[
                  ["วันที่เดินทาง", "ศ. 26 มิ.ย. 2569"],
                  ["ชั้นรถ", "รถด่วน"],
                  ["จำนวนผู้โดยสาร", `${PASSENGERS.length} คน`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[#667085] mb-0.5">{label}</div>
                    <div className="font-semibold text-[#344054]">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Passenger details */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-[#f9fafb] border-b border-[#ece9ec] px-5 py-3 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#101828]">ข้อมูลผู้โดยสาร</h3>
              <button onClick={() => router.push("/passenger")} className="text-[13px] font-semibold text-[#171b82] hover:underline">แก้ไข</button>
            </div>
            <div className="divide-y divide-[#f3f4f6]">
              {PASSENGERS.map((p, i) => (
                <div key={i} className="p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#fff0f4] flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-semibold text-[#cd416e]">{i + 1}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px]">
                    <div>
                      <span className="text-[#667085]">ชื่อ-นามสกุล: </span>
                      <span className="font-semibold text-[#344054]">{p.name}</span>
                    </div>
                    <div>
                      <span className="text-[#667085]">ที่นั่ง: </span>
                      <span className="font-semibold text-[#cd416e]">{p.seat}</span>
                    </div>
                    <div>
                      <span className="text-[#667085]">เลขบัตร: </span>
                      <span className="font-semibold text-[#344054]">{p.idNumber.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")}</span>
                    </div>
                    <div>
                      <span className="text-[#667085]">จุดรับ: </span>
                      <span className="font-semibold text-[#344054]">{p.pickup}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat summary */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-[#f9fafb] border-b border-[#ece9ec] px-5 py-3 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#101828]">ที่นั่ง</h3>
              <button onClick={() => router.push("/seat")} className="text-[13px] font-semibold text-[#171b82] hover:underline">แก้ไข</button>
            </div>
            <div className="p-5 flex gap-3">
              {PASSENGERS.map((p, i) => (
                <div key={i} className="flex-1 bg-[#fff0f4] rounded-lg p-3 text-center">
                  <div className="text-[22px] font-semibold text-[#cd416e]">{p.seat}</div>
                  <div className="text-[12px] text-[#667085] mt-0.5">ผู้โดยสารที่ {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[300px] shrink-0">
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4 sticky top-[70px]">
            <h4 className="text-[15px] font-semibold text-[#101828] mb-4">สรุปการชำระเงิน</h4>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <div className="flex justify-between text-[#667085]">
                <span>ค่าตั๋ว ({PASSENGERS.length} ใบ)</span>
                <span className="text-[#344054]">{total.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>ค่าบริการ</span>
                <span className="text-[#344054]">0 บาท</span>
              </div>
              <div className="border-t border-[#f3f4f6] pt-3 mt-1 flex justify-between font-semibold text-[#101828] text-[16px]">
                <span>รวมทั้งหมด</span>
                <span className="text-[#a43458]">{total.toLocaleString()} บาท</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[#f0fdf4] rounded-lg">
              <p className="text-[12.5px] text-[#065f46]">
                ✓ ราคานี้รวมภาษีและค่าธรรมเนียมทั้งหมดแล้ว
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] py-4">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/seat")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#344054] hover:text-[#101828]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            กลับ
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[20px] font-semibold text-[#a43458]">{total.toLocaleString()} บาท</div>
              <div className="text-[12px] text-[#667085]">ราคารวม</div>
            </div>
            <button
              onClick={() => router.push("/payment")}
              className="bg-[#171b82] text-white text-[15px] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#131566]"
            >
              ถัดไป · ชำระเงิน
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
