"use client";
import { useState } from "react";
import { MEMBER_TYPE_LABELS, MEMBER_TYPE_COLORS, type MemberType } from "@/lib/mockMembers";

type BookingStatus = "confirmed" | "pending" | "cancelled";
type BookingUserType = MemberType | "guest";

type Booking = {
  id: string;
  date: string;
  travelDate: string;
  passenger: string;
  phone: string;
  from: string;
  to: string;
  seats: number;
  total: number;
  status: BookingStatus;
  paymentMethod: string;
  userType: BookingUserType;
};

const MOCK_BOOKINGS: Booking[] = [
  { id: "BKS-5W2X89", date: "14 ก.ค. 69", travelDate: "15 ก.ค. 69", passenger: "นายทดสอบ ระบบ",       phone: "081-234-5678", from: "สายใต้ใหม่", to: "ภูเก็ต",        seats: 2, total: 1190, status: "confirmed", paymentMethod: "บัตรเดบิต",  userType: "general" },
  { id: "BKS-4K9R22", date: "15 ก.ค. 69", travelDate: "16 ก.ค. 69", passenger: "นางสาวสมหญิง ดีดี",    phone: "082-345-6789", from: "หมอชิต 2",   to: "เชียงใหม่",    seats: 1, total: 648,  status: "confirmed", paymentMethod: "QR Code",     userType: "guest" },
  { id: "BKS-8P1Q45", date: "15 ก.ค. 69", travelDate: "16 ก.ค. 69", passenger: "นายวิทยา ใจดี",        phone: "083-456-7890", from: "สายใต้ใหม่", to: "สุราษฎร์ธานี", seats: 2, total: 890,  status: "pending",   paymentMethod: "โอนเงิน",    userType: "employee" },
  { id: "BKS-2M7T88", date: "14 ก.ค. 69", travelDate: "15 ก.ค. 69", passenger: "นางบุญมี รักดี",        phone: "084-567-8901", from: "เอกมัย",     to: "พัทยา",        seats: 2, total: 220,  status: "cancelled", paymentMethod: "บัตรเดบิต",  userType: "guest" },
  { id: "BKS-6N3H71", date: "15 ก.ค. 69", travelDate: "17 ก.ค. 69", passenger: "นายประทีป ศรีดี",      phone: "085-678-9012", from: "หมอชิต 2",   to: "ขอนแก่น",      seats: 2, total: 760,  status: "confirmed", paymentMethod: "เงินสด",      userType: "official" },
  { id: "BKS-9Y4L33", date: "15 ก.ค. 69", travelDate: "17 ก.ค. 69", passenger: "นายสมชาย ดีมาก",       phone: "086-789-0123", from: "สายใต้ใหม่", to: "ภูเก็ต",        seats: 3, total: 1785, status: "confirmed", paymentMethod: "QR Code",     userType: "guest" },
  { id: "BKS-3R9T12", date: "09 พ.ค. 69", travelDate: "10 พ.ค. 69", passenger: "นายทดสอบ ระบบ",       phone: "081-234-5678", from: "เชียงใหม่",   to: "หมอชิต 2",     seats: 1, total: 648,  status: "confirmed", paymentMethod: "บัตรเดบิต",  userType: "general" },
  { id: "BKS-7K4Q28", date: "25 มิ.ย. 69", travelDate: "26 มิ.ย. 69", passenger: "นายทดสอบ ระบบ",     phone: "081-234-5678", from: "สายใต้ใหม่", to: "ขอนแก่น",      seats: 2, total: 854,  status: "confirmed", paymentMethod: "บัตรเดบิต",  userType: "general" },
  { id: "BKS-1A2B34", date: "14 มี.ค. 69", travelDate: "15 มี.ค. 69", passenger: "นายทดสอบ ระบบ",     phone: "081-234-5678", from: "หมอชิต 2",   to: "อุดรธานี",      seats: 2, total: 1240, status: "confirmed", paymentMethod: "โอนเงิน",    userType: "general" },
  { id: "BKS-5C6D78", date: "15 ก.ค. 69", travelDate: "18 ก.ค. 69", passenger: "นางสาวรักษ์ ธรรมดี",  phone: "087-890-1234", from: "สายใต้ใหม่", to: "ชุมพร",         seats: 1, total: 320,  status: "pending",   paymentMethod: "QR Code",     userType: "senior" },
  { id: "BKS-8E9F01", date: "15 ก.ค. 69", travelDate: "18 ก.ค. 69", passenger: "นายกิตติ ดีใจ",       phone: "088-901-2345", from: "หมอชิต 2",   to: "อุบลราชธานี",  seats: 2, total: 960,  status: "confirmed", paymentMethod: "บัตรเครดิต", userType: "student" },
  { id: "BKS-2G3H45", date: "14 ก.ค. 69", travelDate: "16 ก.ค. 69", passenger: "นางวิภา สุขใจ",       phone: "089-012-3456", from: "เอกมัย",     to: "พัทยา",         seats: 4, total: 440,  status: "cancelled", paymentMethod: "โอนเงิน",    userType: "disabled" },
];

const STATUS_MAP: Record<BookingStatus, { label: string; cls: string }> = {
  confirmed: { label: "ยืนยันแล้ว", cls: "bg-[#d1fae5] text-[#059669]" },
  pending:   { label: "รอชำระ",    cls: "bg-[#fef9c3] text-[#b45309]" },
  cancelled: { label: "ยกเลิก",    cls: "bg-[#fee2e2] text-[#dc2626]" },
};

const STATUS_TABS: { key: BookingStatus | "all"; label: string; count: (b: Booking[]) => number }[] = [
  { key: "all",       label: "ทั้งหมด",    count: b => b.length },
  { key: "confirmed", label: "ยืนยันแล้ว", count: b => b.filter(x => x.status === "confirmed").length },
  { key: "pending",   label: "รอชำระ",    count: b => b.filter(x => x.status === "pending").length },
  { key: "cancelled", label: "ยกเลิก",    count: b => b.filter(x => x.status === "cancelled").length },
];

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_BOOKINGS.filter(b => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.id.toLowerCase().includes(q) || b.passenger.toLowerCase().includes(q) || b.from.includes(q) || b.to.includes(q) || b.phone.includes(q);
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.filter(b => b.status === "confirmed").reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="flex flex-col gap-4 max-w-[1200px]">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "การจองทั้งหมด", value: MOCK_BOOKINGS.length, unit: "รายการ", cls: "text-[#101828]" },
          { label: "รายได้รวม (ยืนยัน)", value: MOCK_BOOKINGS.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total, 0).toLocaleString(), unit: "฿", cls: "text-[#059669]" },
          { label: "รอการชำระ", value: MOCK_BOOKINGS.filter(b => b.status === "pending").length, unit: "รายการ", cls: "text-[#b45309]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex items-center gap-4">
            <div>
              <div className="text-[14px] text-[#667085] font-medium">{s.label}</div>
              <div className={`text-[26px] font-semibold mt-0.5 ${s.cls}`}>
                {s.value} <span className="text-[16px] font-medium text-[#667085]">{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3 py-2 flex-1 max-w-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา รหัสจอง, ชื่อ, เบอร์โทร, เส้นทาง..."
            className="flex-1 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none"
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
              className={`flex items-center gap-1.5 text-[14px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === tab.key
                  ? "bg-[#0f1260] text-white"
                  : "text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
              }`}
            >
              {tab.label}
              <span className={`text-[12px] font-semibold px-1.5 py-0.5 rounded-full ${statusFilter === tab.key ? "bg-white/20" : "bg-[#f3f4f6]"}`}>
                {tab.count(MOCK_BOOKINGS)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["เลขที่จอง", "วันที่จอง", "ผู้โดยสาร", "ประเภทผู้ใช้", "เส้นทาง", "วันเดินทาง", "ที่นั่ง", "ยอดรวม", "ชำระผ่าน", "สถานะ", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[13px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f9fafb]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-5 py-12 text-center text-[16px] text-[#9ca3af]">ไม่พบการจอง</td>
              </tr>
            ) : filtered.map(b => {
              const st = STATUS_MAP[b.status];
              return (
                <tr key={b.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-4 py-3.5 font-mono text-[14px] font-semibold text-[#344054] whitespace-nowrap">{b.id}</td>
                  <td className="px-4 py-3.5 text-[#667085] whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-[#101828]">{b.passenger}</div>
                    <div className="text-[13px] text-[#9ca3af] mt-0.5">{b.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {b.userType === "guest" ? (
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold px-2.5 py-1 rounded-full bg-[#f3f4f6] text-[#667085]">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                        ไม่ได้เข้าสู่ระบบ
                      </span>
                    ) : (
                      <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full ${MEMBER_TYPE_COLORS[b.userType]}`}>
                        {MEMBER_TYPE_LABELS[b.userType]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-[#101828] font-medium">{b.from}</div>
                    <div className="text-[#9ca3af] text-[13px] flex items-center gap-1 mt-0.5">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      {b.to}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#667085] whitespace-nowrap">{b.travelDate}</td>
                  <td className="px-4 py-3.5 font-semibold text-[#101828]">{b.seats} ที่นั่ง</td>
                  <td className="px-4 py-3.5 font-semibold text-[#101828] whitespace-nowrap">{b.total.toLocaleString()} ฿</td>
                  <td className="px-4 py-3.5 text-[#667085] whitespace-nowrap">{b.paymentMethod}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-[#667085] hover:text-[#344054] p-1.5 rounded-lg hover:bg-[#f3f4f6] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#f3f4f6] flex items-center justify-between text-[14px] text-[#667085]">
          <span>
            แสดง {filtered.length} จาก {MOCK_BOOKINGS.length} รายการ
            {statusFilter === "confirmed" && (
              <span className="ml-3 font-semibold text-[#059669]">รายได้รวม: {totalRevenue.toLocaleString()} ฿</span>
            )}
          </span>
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
