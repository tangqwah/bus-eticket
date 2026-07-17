"use client";
import { useState } from "react";

type Route = {
  code: string;
  from: string;
  fromStation: string;
  to: string;
  toStation: string;
  distance: number;
  duration: string;
  busTypes: string[];
  baseFare: number;
  active: boolean;
  tripsPerDay: number;
};

const MOCK_ROUTES: Route[] = [
  { code: "BKK-HKT", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งสายใต้ใหม่", to: "ภูเก็ต",         toStation: "สถานีขนส่งภูเก็ต",          distance: 870, duration: "12 ชม. 30 น.", busTypes: ["รถด่วนพิเศษ", "รถด่วน"],              baseFare: 595,  active: true,  tripsPerDay: 4 },
  { code: "BKK-CNX", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งหมอชิต 2",   to: "เชียงใหม่",     toStation: "สถานีขนส่งอาเขต",            distance: 696, duration: "9 ชม. 30 น.",  busTypes: ["รถนอนปรับอากาศ", "รถด่วนพิเศษ"], baseFare: 648,  active: true,  tripsPerDay: 6 },
  { code: "BKK-KKN", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งหมอชิต 2",   to: "ขอนแก่น",       toStation: "สถานีขนส่งขอนแก่น",          distance: 445, duration: "6 ชม. 30 น.",  busTypes: ["รถด่วนพิเศษ", "รถด่วน"],              baseFare: 380,  active: true,  tripsPerDay: 8 },
  { code: "BKK-SUG", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งสายใต้ใหม่", to: "สุราษฎร์ธานี",  toStation: "สถานีขนส่งสุราษฎร์ธานี",     distance: 650, duration: "9 ชม.",         busTypes: ["รถด่วน"],                            baseFare: 445,  active: true,  tripsPerDay: 3 },
  { code: "BKK-PTY", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งเอกมัย",     to: "พัทยา",         toStation: "สถานีขนส่งพัทยาเหนือ",       distance: 147, duration: "2 ชม. 30 น.",  busTypes: ["รถปรับอากาศ"],                       baseFare: 120,  active: true,  tripsPerDay: 12 },
  { code: "BKK-CPN", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งสายใต้ใหม่", to: "ชุมพร",         toStation: "สถานีขนส่งชุมพร",            distance: 490, duration: "7 ชม.",         busTypes: ["รถด่วน"],                            baseFare: 320,  active: true,  tripsPerDay: 4 },
  { code: "BKK-UDN", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งหมอชิต 2",   to: "อุดรธานี",      toStation: "สถานีขนส่งอุดรธานี",         distance: 564, duration: "7 ชม.",         busTypes: ["รถด่วนพิเศษ", "รถด่วน"],              baseFare: 420,  active: true,  tripsPerDay: 5 },
  { code: "BKK-UBN", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งหมอชิต 2",   to: "อุบลราชธานี",   toStation: "สถานีขนส่งอุบลราชธานี",      distance: 630, duration: "9 ชม.",         busTypes: ["รถด่วน"],                            baseFare: 480,  active: true,  tripsPerDay: 3 },
  { code: "BKK-NST", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งสายใต้ใหม่", to: "นครศรีธรรมราช", toStation: "สถานีขนส่งนครศรีธรรมราช",    distance: 780, duration: "11 ชม.",        busTypes: ["รถด่วนพิเศษ"],                       baseFare: 520,  active: false, tripsPerDay: 0 },
  { code: "BKK-HDY", from: "กรุงเทพฯ", fromStation: "สถานีขนส่งสายใต้ใหม่", to: "หาดใหญ่",       toStation: "สถานีขนส่งหาดใหญ่",          distance: 950, duration: "13 ชม.",        busTypes: ["รถด่วนพิเศษ", "รถนอนปรับอากาศ"],    baseFare: 650,  active: true,  tripsPerDay: 2 },
];

export default function RoutesPage() {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const filtered = MOCK_ROUTES.filter(r => {
    if (activeOnly && !r.active) return false;
    const q = search.toLowerCase();
    return !q || r.code.toLowerCase().includes(q) || r.from.includes(q) || r.to.includes(q) || r.fromStation.includes(q) || r.toStation.includes(q);
  });

  return (
    <div className="flex flex-col gap-4 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[16px] text-[#667085]">{MOCK_ROUTES.length} เส้นทางทั้งหมด · {MOCK_ROUTES.filter(r => r.active).length} เส้นทางที่เปิดให้บริการ</p>
        <button className="flex items-center gap-2 bg-[#0f1260] text-white text-[15px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#171b82] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          เพิ่มเส้นทาง
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา รหัส, ต้นทาง, ปลายทาง..."
            className="flex-1 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#9ca3af] hover:text-[#344054]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-[15px] font-medium text-[#344054]">
          <button
            role="switch"
            aria-checked={activeOnly}
            onClick={() => setActiveOnly(v => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors ${activeOnly ? "bg-[#0f1260]" : "bg-[#d0d5dd]"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${activeOnly ? "translate-x-4" : ""}`} />
          </button>
          เฉพาะเส้นทางที่เปิดบริการ
        </label>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["รหัส", "เส้นทาง", "ระยะทาง", "ระยะเวลา", "ประเภทรถ", "ราคาเริ่มต้น", "เที่ยว/วัน", "สถานะ", ""].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[13px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f9fafb]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-[16px] text-[#9ca3af]">ไม่พบเส้นทาง</td>
              </tr>
            ) : filtered.map(r => (
              <tr key={r.code} className="hover:bg-[#f9fafb] transition-colors">
                <td className="px-5 py-4 font-mono text-[14px] font-semibold text-[#171b82]">{r.code}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-semibold text-[#101828]">{r.from}</div>
                      <div className="text-[13px] text-[#9ca3af] mt-0.5">{r.fromStation}</div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 shrink-0 px-1">
                      <div className="w-1.5 h-1.5 rounded-full border-2 border-[#171b82]" />
                      <div className="w-px h-5 bg-[#d0d5dd]" />
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="#171b82"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[#101828]">{r.to}</div>
                      <div className="text-[13px] text-[#9ca3af] mt-0.5">{r.toStation}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#667085] whitespace-nowrap">{r.distance.toLocaleString()} กม.</td>
                <td className="px-5 py-4 text-[#667085] whitespace-nowrap">{r.duration}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {r.busTypes.map(bt => (
                      <span key={bt} className="text-[12px] font-semibold bg-[#f0f2ff] text-[#171b82] px-2 py-0.5 rounded-full whitespace-nowrap">{bt}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[#101828] whitespace-nowrap">
                  {r.active ? `${r.baseFare.toLocaleString()} ฿` : <span className="text-[#9ca3af]">—</span>}
                </td>
                <td className="px-5 py-4">
                  {r.active ? (
                    <span className="font-semibold text-[#101828]">{r.tripsPerDay} เที่ยว</span>
                  ) : (
                    <span className="text-[#9ca3af]">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${r.active ? "bg-[#d1fae5] text-[#059669]" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                    {r.active ? "เปิดบริการ" : "ปิดบริการ"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button className="text-[#667085] hover:text-[#344054] p-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors" title="แก้ไข">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className={`p-1.5 rounded-lg transition-colors ${r.active ? "text-[#f04438] hover:bg-[#fff1f0]" : "text-[#059669] hover:bg-[#d1fae5]"}`} title={r.active ? "ปิดบริการ" : "เปิดบริการ"}>
                      {r.active ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#f3f4f6] flex items-center justify-between text-[14px] text-[#667085]">
          <span>แสดง {filtered.length} จาก {MOCK_ROUTES.length} เส้นทาง</span>
        </div>
      </div>
    </div>
  );
}
