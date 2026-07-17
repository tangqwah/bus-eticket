"use client";

const STATS = [
  {
    label: "การจองวันนี้",
    value: "124",
    unit: "รายการ",
    change: "+12%",
    positive: true,
    sub: "จากเมื่อวาน",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/>
      </svg>
    ),
    color: "bg-[#f0f2ff] text-[#171b82]",
  },
  {
    label: "รายได้เดือนนี้",
    value: "924,350",
    unit: "฿",
    change: "+8.2%",
    positive: true,
    sub: "จากเดือนที่แล้ว",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    color: "bg-[#d1fae5] text-[#059669]",
  },
  {
    label: "เที่ยวรถวันนี้",
    value: "18",
    unit: "เที่ยว",
    change: "3 กำลังดำเนินการ",
    positive: true,
    sub: "",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="22" height="16" rx="2"/><path d="M8 19v2M16 19v2M1 10h22"/>
      </svg>
    ),
    color: "bg-[#fef3f2] text-[#cd416e]",
  },
  {
    label: "อัตราการเต็ม",
    value: "78",
    unit: "%",
    change: "-2.1%",
    positive: false,
    sub: "เฉลี่ยทุกเที่ยว",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    color: "bg-[#fff7ed] text-[#f59e0b]",
  },
];

const RECENT_BOOKINGS = [
  { id: "BKS-5W2X89", name: "นายทดสอบ ระบบ", route: "สายใต้ใหม่ → ภูเก็ต", date: "15 ก.ค. 69", total: 1190, status: "confirmed" },
  { id: "BKS-4K9R22", name: "นางสาวสมหญิง ดีดี", route: "หมอชิต 2 → เชียงใหม่", date: "16 ก.ค. 69", total: 648, status: "confirmed" },
  { id: "BKS-8P1Q45", name: "นายวิทยา ใจดี", route: "สายใต้ใหม่ → สุราษฎร์ฯ", date: "16 ก.ค. 69", total: 890, status: "pending" },
  { id: "BKS-2M7T88", name: "นางบุญมี รักดี", route: "เอกมัย → พัทยา", date: "15 ก.ค. 69", total: 220, status: "cancelled" },
  { id: "BKS-6N3H71", name: "นายประทีป ศรีดี", route: "หมอชิต 2 → ขอนแก่น", date: "17 ก.ค. 69", total: 760, status: "confirmed" },
];

const TODAY_TRIPS = [
  { time: "07:00", route: "สายใต้ใหม่ → ชุมพร", type: "รถด่วน", sold: 35, total: 40, status: "departed" },
  { time: "08:30", route: "สายใต้ใหม่ → ภูเก็ต", type: "รถด่วนพิเศษ", sold: 36, total: 42, status: "departed" },
  { time: "09:00", route: "หมอชิต 2 → ขอนแก่น", type: "รถด่วน", sold: 40, total: 44, status: "ontime" },
  { time: "09:30", route: "สายใต้ใหม่ → สุราษฎร์ฯ", type: "รถด่วน", sold: 28, total: 40, status: "ontime" },
  { time: "10:00", route: "เอกมัย → พัทยา", type: "รถปรับอากาศ", sold: 22, total: 30, status: "ontime" },
  { time: "20:00", route: "หมอชิต 2 → เชียงใหม่", type: "รถนอนปรับอากาศ", sold: 18, total: 44, status: "scheduled" },
  { time: "21:00", route: "สายใต้ใหม่ → ภูเก็ต", type: "รถด่วนพิเศษ", sold: 30, total: 42, status: "scheduled" },
];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "ยืนยันแล้ว", cls: "bg-[#d1fae5] text-[#059669]" },
  pending:   { label: "รอชำระ",   cls: "bg-[#fef9c3] text-[#b45309]" },
  cancelled: { label: "ยกเลิก",   cls: "bg-[#fee2e2] text-[#dc2626]" },
};

const TRIP_STATUS: Record<string, { label: string; cls: string }> = {
  departed:  { label: "ออกเดินทาง", cls: "text-[#667085]" },
  ontime:    { label: "กำลังดำเนินการ", cls: "text-[#059669]" },
  scheduled: { label: "กำหนดการ", cls: "text-[#171b82]" },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <span className={`text-[12px] font-semibold flex items-center gap-1 ${s.positive ? "text-[#059669]" : "text-[#dc2626]"}`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {s.positive ? <path d="M12 19V5M5 12l7-7 7 7"/> : <path d="M12 5v14M5 12l7 7 7-7"/>}
                </svg>
                {s.change}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-semibold text-[#101828]">{s.value}</span>
              <span className="text-[14px] text-[#667085] font-medium">{s.unit}</span>
            </div>
            <div className="text-[13px] text-[#667085] mt-0.5">{s.label}{s.sub ? ` · ${s.sub}` : ""}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
            <span className="text-[15px] font-semibold text-[#101828]">การจองล่าสุด</span>
            <a href="/backoffice/bookings" className="text-[13px] font-semibold text-[#171b82] hover:text-[#0f1260]">ดูทั้งหมด →</a>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                {["เลขที่จอง", "ผู้โดยสาร", "เส้นทาง", "วันเดินทาง", "ยอดรวม", "สถานะ"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f9fafb]">
              {RECENT_BOOKINGS.map(b => {
                const s = STATUS_BADGE[b.status];
                return (
                  <tr key={b.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[12px] font-semibold text-[#344054]">{b.id}</td>
                    <td className="px-5 py-3.5 font-medium text-[#101828]">{b.name}</td>
                    <td className="px-5 py-3.5 text-[#667085]">{b.route}</td>
                    <td className="px-5 py-3.5 text-[#667085]">{b.date}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#101828]">{b.total.toLocaleString()} ฿</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Today's trips */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
            <span className="text-[15px] font-semibold text-[#101828]">เที่ยวรถวันนี้</span>
            <span className="text-[11px] font-semibold bg-[#f0f2ff] text-[#171b82] px-2 py-0.5 rounded-full">{TODAY_TRIPS.length} เที่ยว</span>
          </div>
          <div className="divide-y divide-[#f9fafb]">
            {TODAY_TRIPS.map((t, i) => {
              const pct = Math.round((t.sold / t.total) * 100);
              const ts = TRIP_STATUS[t.status];
              return (
                <div key={i} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-[13px] font-semibold text-[#101828]">{t.time} · {t.route}</div>
                      <div className="text-[11px] text-[#9ca3af] mt-0.5">{t.type}</div>
                    </div>
                    <span className={`text-[11px] font-semibold shrink-0 ${ts.cls}`}>{ts.label}</span>
                  </div>
                  {/* Seat bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-[#f04438]" : pct >= 70 ? "bg-[#f59e0b]" : "bg-[#059669]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#667085] shrink-0">{t.sold}/{t.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
