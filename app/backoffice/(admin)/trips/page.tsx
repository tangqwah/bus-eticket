"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_TRIPS, TRIP_STATUS_MAP, type TripStatus } from "@/lib/mockTrips";

const STATUS_TABS: { key: TripStatus | "all"; label: string }[] = [
  { key: "all",       label: "ทั้งหมด" },
  { key: "scheduled", label: "กำหนดการ" },
  { key: "ontime",    label: "กำลังดำเนินการ" },
  { key: "departed",  label: "เสร็จสิ้น" },
  { key: "cancelled", label: "ยกเลิก" },
];

export default function TripsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_TRIPS.filter(t => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || t.id.toLowerCase().includes(q) || t.from.includes(q) || t.to.includes(q) || t.route.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] text-[#667085]">{MOCK_TRIPS.length} เที่ยวรถทั้งหมด</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f1260] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#171b82] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          เพิ่มเที่ยวรถ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา รหัส, เส้นทาง..."
            className="flex-1 text-[13px] text-[#101828] placeholder:text-[#9ca3af] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#9ca3af] hover:text-[#344054]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === tab.key
                  ? "bg-[#0f1260] text-white"
                  : "text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["รหัสเที่ยว", "วันที่", "เส้นทาง", "เวลาออก", "ประเภทรถ", "ที่นั่ง", "รายได้", "สถานะ", ""].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f9fafb]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-[14px] text-[#9ca3af]">ไม่พบเที่ยวรถ</td>
              </tr>
            ) : filtered.map(t => {
              const pct = Math.round((t.sold / t.total) * 100);
              const st = TRIP_STATUS_MAP[t.status];
              return (
                <tr
                  key={t.id}
                  onClick={() => router.push(`/backoffice/trips/${t.id}`)}
                  className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono text-[12px] font-semibold text-[#344054]">{t.id}</td>
                  <td className="px-5 py-3.5 text-[#667085] whitespace-nowrap">{t.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-[#101828]">{t.from}</div>
                    <div className="text-[#9ca3af] text-[11px] flex items-center gap-1 mt-0.5">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      {t.to}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#101828]">{t.depart}</td>
                  <td className="px-5 py-3.5 text-[#667085] whitespace-nowrap">{t.type}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 w-[120px]">
                      <div className="flex-1 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 90 ? "bg-[#f04438]" : pct >= 70 ? "bg-[#f59e0b]" : "bg-[#059669]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#667085] shrink-0">{t.sold}/{t.total}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#101828] whitespace-nowrap">
                    {t.status === "cancelled" ? (
                      <span className="text-[#9ca3af]">—</span>
                    ) : (
                      `${t.revenue.toLocaleString()} ฿`
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] font-semibold text-[#171b82] hover:underline whitespace-nowrap">ดูรายละเอียด →</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#f3f4f6] flex items-center justify-between text-[12px] text-[#667085]">
          <span>แสดง {filtered.length} จาก {MOCK_TRIPS.length} รายการ</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors">← ก่อนหน้า</button>
            <button className="px-2.5 py-1.5 rounded-lg bg-[#0f1260] text-white font-semibold">1</button>
            <button className="px-2.5 py-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors">ถัดไป →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
