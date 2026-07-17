"use client";
import { useParams, useRouter } from "next/navigation";
import { MOCK_TRIPS, MOCK_TRIP_PASSENGERS, TRIP_STATUS_MAP, type TripPassenger } from "@/lib/mockTrips";
import { MEMBER_TYPE_LABELS, MEMBER_TYPE_COLORS } from "@/lib/mockMembers";
import type { MemberType } from "@/lib/mockMembers";

type BookingUserType = MemberType | "guest";

const PASSENGER_STATUS_MAP: Record<TripPassenger["status"], { label: string; cls: string }> = {
  confirmed: { label: "ยืนยันแล้ว",    cls: "bg-[#d1fae5] text-[#059669]" },
  pending:   { label: "รอดำเนินการ",   cls: "bg-[#fef3c7] text-[#b45309]" },
  cancelled: { label: "ยกเลิก",        cls: "bg-[#fee2e2] text-[#dc2626]" },
};

function UserTypePill({ userType }: { userType: BookingUserType }) {
  if (userType === "guest") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#667085]">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ไม่ได้เข้าสู่ระบบ
      </span>
    );
  }
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${MEMBER_TYPE_COLORS[userType]}`}>
      {MEMBER_TYPE_LABELS[userType]}
    </span>
  );
}

function SeatGrid({ sold, total }: { sold: number; total: number }) {
  const cols = 4;
  const rows = Math.ceil(total / cols);
  const seats = Array.from({ length: total }, (_, i) => i < sold);

  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-1">
          {Array.from({ length: cols }, (_, c) => {
            const idx = r * cols + c;
            if (idx >= total) return <div key={c} className="w-6 h-5" />;
            const occupied = seats[idx];
            return (
              <div
                key={c}
                title={`ที่นั่ง ${idx + 1}`}
                className={`w-6 h-5 rounded-sm border text-[9px] font-bold flex items-center justify-center ${
                  occupied
                    ? "bg-[#171b82] border-[#171b82] text-white"
                    : "bg-[#f9fafb] border-[#e5e7eb] text-[#9ca3af]"
                }`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center gap-4 mt-2 text-[11px] text-[#667085]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#171b82] inline-block" /> จองแล้ว ({sold})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#f9fafb] border border-[#e5e7eb] inline-block" /> ว่าง ({total - sold})
        </span>
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const trip = MOCK_TRIPS.find(t => t.id === id);
  const passengers = MOCK_TRIP_PASSENGERS[id] ?? [];

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[16px] text-[#667085]">ไม่พบเที่ยวรถ {id}</p>
        <button
          onClick={() => router.push("/backoffice/trips")}
          className="text-[13px] font-semibold text-[#171b82] hover:underline"
        >
          ← กลับไปรายการเที่ยวรถ
        </button>
      </div>
    );
  }

  const st = TRIP_STATUS_MAP[trip.status];
  const pct = Math.round((trip.sold / trip.total) * 100);
  const confirmedCount = passengers.filter(p => p.status === "confirmed").length;
  const cancelledCount = passengers.filter(p => p.status === "cancelled").length;
  const pendingCount   = passengers.filter(p => p.status === "pending").length;

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/backoffice/trips")}
        className="flex items-center gap-1.5 text-[13px] text-[#667085] hover:text-[#344054] self-start transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        กลับไปรายการเที่ยวรถ
      </button>

      {/* Trip overview card */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[13px] font-semibold text-[#344054] bg-[#f3f4f6] px-2.5 py-1 rounded-lg">{trip.id}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {trip.status === "scheduled" && (
              <button className="text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#f04438] text-[#dc2626] hover:bg-[#fee2e2] transition-colors">
                ยกเลิกเที่ยวรถ
              </button>
            )}
          </div>
        </div>

        {/* Grid of info */}
        <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5">
          {/* Route */}
          <div className="col-span-2">
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">เส้นทาง</p>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[18px] font-bold text-[#101828] leading-tight">{trip.from}</p>
                <p className="text-[11px] text-[#9ca3af]">ต้นทาง</p>
              </div>
              <div className="flex flex-col items-center gap-0.5 flex-1 max-w-[80px]">
                <p className="text-[10px] text-[#9ca3af] font-semibold">{trip.route}</p>
                <div className="flex items-center w-full">
                  <div className="flex-1 h-[1px] bg-[#d0d5dd]" />
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#9ca3af" className="shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#101828] leading-tight">{trip.to}</p>
                <p className="text-[11px] text-[#9ca3af]">ปลายทาง</p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">วันที่เดินทาง</p>
            <p className="text-[15px] font-semibold text-[#101828]">{trip.date}</p>
          </div>

          {/* Bus type */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">ประเภทรถ</p>
            <p className="text-[15px] font-semibold text-[#101828]">{trip.type}</p>
          </div>

          {/* Depart */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">เวลาออก</p>
            <p className="text-[15px] font-semibold text-[#101828]">{trip.depart} น.</p>
          </div>

          {/* Arrive */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">เวลาถึง</p>
            <p className="text-[15px] font-semibold text-[#101828]">{trip.arrive} น.</p>
          </div>

          {/* Revenue */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">รายได้</p>
            <p className={`text-[15px] font-semibold ${trip.status === "cancelled" ? "text-[#9ca3af]" : "text-[#101828]"}`}>
              {trip.status === "cancelled" ? "—" : `${trip.revenue.toLocaleString()} ฿`}
            </p>
          </div>

          {/* Occupancy */}
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">ที่นั่ง ({pct}%)</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct >= 90 ? "bg-[#f04438]" : pct >= 70 ? "bg-[#f59e0b]" : "bg-[#059669]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[13px] font-semibold text-[#101828]">{trip.sold}/{trip.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom two-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
        {/* Passenger manifest */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#101828]">รายชื่อผู้โดยสาร</h2>
            <div className="flex items-center gap-3 text-[12px] text-[#667085]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#059669] inline-block" />
                ยืนยัน {confirmedCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block" />
                รอ {pendingCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f04438] inline-block" />
                ยกเลิก {cancelledCount}
              </span>
            </div>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                {["รหัสการจอง", "ผู้โดยสาร", "ประเภท", "ที่นั่ง", "ชำระด้วย", "สถานะ"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f9fafb]">
              {passengers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#9ca3af]">ยังไม่มีผู้โดยสาร</td>
                </tr>
              ) : passengers.map(p => {
                const ps = PASSENGER_STATUS_MAP[p.status];
                return (
                  <tr key={p.bookingId} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-[#344054]">{p.bookingId}</td>
                    <td className="px-5 py-3.5 font-medium text-[#101828]">{p.name}</td>
                    <td className="px-5 py-3.5"><UserTypePill userType={p.userType} /></td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-semibold text-[#344054]">{p.seats}</span>
                      <span className="text-[10px] text-[#9ca3af] ml-1">({p.seatCount} ที่นั่ง)</span>
                    </td>
                    <td className="px-5 py-3.5 text-[#667085] whitespace-nowrap">{p.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${ps.cls}`}>{ps.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Seat occupancy card */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex flex-col gap-5">
          <h2 className="text-[14px] font-semibold text-[#101828]">ผังที่นั่ง</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#f0f2ff] rounded-xl py-3">
              <p className="text-[20px] font-bold text-[#171b82]">{trip.sold}</p>
              <p className="text-[10px] text-[#667085] font-semibold mt-0.5">จองแล้ว</p>
            </div>
            <div className="bg-[#f0fdf4] rounded-xl py-3">
              <p className="text-[20px] font-bold text-[#059669]">{trip.total - trip.sold}</p>
              <p className="text-[10px] text-[#667085] font-semibold mt-0.5">ว่าง</p>
            </div>
            <div className="bg-[#f9fafb] rounded-xl py-3">
              <p className="text-[20px] font-bold text-[#344054]">{trip.total}</p>
              <p className="text-[10px] text-[#667085] font-semibold mt-0.5">ทั้งหมด</p>
            </div>
          </div>

          {/* Seat grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] mb-1">
              <div className="w-8 text-center font-semibold">คนขับ</div>
              <div className="flex-1 h-[1px] bg-[#f3f4f6]" />
            </div>
            <div className="flex justify-center">
              <SeatGrid sold={trip.sold} total={trip.total} />
            </div>
          </div>

          {/* Occupancy rate */}
          <div className="pt-3 border-t border-[#f3f4f6]">
            <div className="flex justify-between text-[12px] text-[#667085] mb-2">
              <span>อัตราการจอง</span>
              <span className="font-semibold text-[#101828]">{pct}%</span>
            </div>
            <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-[#f04438]" : pct >= 70 ? "bg-[#f59e0b]" : "bg-[#059669]"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className={`text-[11px] font-semibold mt-1.5 ${pct >= 90 ? "text-[#dc2626]" : pct >= 70 ? "text-[#b45309]" : "text-[#059669]"}`}>
              {pct >= 90 ? "เต็มเกือบหมด" : pct >= 70 ? "มีที่นั่งเหลือน้อย" : "ยังมีที่นั่งว่าง"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
