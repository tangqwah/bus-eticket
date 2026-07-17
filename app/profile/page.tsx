"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { readDraft, thaiDateLong, cityOf, stationOf, paxFullName, type BookingDraft } from "@/lib/bookingStore";

type User = { username: string; name: string; email: string; phone: string };

type Section = "profile" | "my-booking" | "booking-history" | "passengers" | "points" | "coupons";

const MOCK_UPCOMING = [
  {
    id: "BKS-5W2X89",
    date: "15 ก.ค. 2569",
    from: "กรุงเทพฯ (สายใต้ใหม่)",
    fromSub: "สถานีขนส่งสายใต้ใหม่",
    to: "ภูเก็ต",
    toSub: "สถานีขนส่งภูเก็ต",
    depart: "08:30",
    arrive: "21:00",
    duration: "12 ชั่วโมง 30 นาที",
    passengers: 2,
    total: 1190,
    type: "รถด่วนพิเศษ",
    tickets: [
      { name: "นายทดสอบ ระบบ", seat: "C5", price: 595 },
      { name: "นางสาวฮันนี่ สะเต้อ", seat: "C6", price: 595 },
    ],
  },
];

const MOCK_HISTORY = [
  {
    id: "BKS-7K4Q28",
    date: "26 มิ.ย. 2569",
    from: "กรุงเทพฯ (สายใต้ใหม่)",
    to: "ขอนแก่น",
    depart: "09:00",
    arrive: "15:30",
    passengers: 2,
    total: 854,
    type: "รถด่วน",
  },
  {
    id: "BKS-3R9T12",
    date: "10 พ.ค. 2569",
    from: "เชียงใหม่",
    to: "กรุงเทพฯ (หมอชิต 2)",
    depart: "20:00",
    arrive: "07:30",
    passengers: 1,
    total: 648,
    type: "รถนอนปรับอากาศ",
  },
];

const MOCK_PASSENGERS = [
  { id: 1, name: "นายทดสอบ ระบบ", idNumber: "1-1001-00001-00-1", type: "บัตรประชาชน", phone: "0812345678" },
  { id: 2, name: "นางสาวฮันนี่ สะเต้อ", idNumber: "1-1002-00002-00-2", type: "บัตรประชาชน", phone: "0823456789" },
];

const MOCK_POINTS_HISTORY = [
  { date: "26 มิ.ย. 2569", desc: "จองตั๋ว BKS-7K4Q28", points: +85, balance: 1502 },
  { date: "10 พ.ค. 2569", desc: "จองตั๋ว BKS-3R9T12", points: +65, balance: 1417 },
  { date: "01 เม.ย. 2569", desc: "โบนัสต้อนรับสมาชิกใหม่", points: +500, balance: 1352 },
  { date: "15 มี.ค. 2569", desc: "จองตั๋ว BKS-1A2B34", points: +852, balance: 852 },
];

const MOCK_COUPONS = [
  { code: "BKSWELCOME", desc: "ส่วนลดต้อนรับสมาชิกใหม่", discount: "10%", expiry: "31 ธ.ค. 2569", used: false },
  { code: "SUMMER25", desc: "โปรโมชั่นฤดูร้อน 25 บาท", discount: "25 ฿", expiry: "30 ก.ย. 2569", used: false },
  { code: "BDAY100", desc: "คูปองวันเกิด", discount: "100 ฿", expiry: "31 ก.ค. 2569", used: true },
];

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "profile",
    label: "ข้อมูลส่วนตัว",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    id: "my-booking",
    label: "การจองของฉัน",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/></svg>,
  },
  {
    id: "booking-history",
    label: "ประวัติการจอง",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    id: "passengers",
    label: "รายชื่อผู้โดยสาร",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    id: "points",
    label: "แต้มสะสม",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    id: "coupons",
    label: "คูปองของฉัน",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  },
];

type Booking = typeof MOCK_UPCOMING[0] | typeof MOCK_HISTORY[0];
type UpcomingBooking = typeof MOCK_UPCOMING[0];

function draftToUpcoming(draft: BookingDraft): UpcomingBooking {
  const pax = draft.passengers ?? [];
  return {
    id: draft.bookingNo ?? "BKS-XXXXXX",
    date: thaiDateLong(draft.date),
    from: draft.from,
    fromSub: stationOf(draft.from) ?? cityOf(draft.from),
    to: draft.to,
    toSub: stationOf(draft.to) ?? cityOf(draft.to),
    depart: draft.dep,
    arrive: draft.arr,
    duration: draft.dur,
    passengers: pax.length,
    total: draft.pricePerSeat * pax.length,
    type: draft.busType,
    tickets: pax.map((p, i) => ({
      name: paxFullName(p),
      seat: draft.seats?.[i] ?? "—",
      price: draft.pricePerSeat,
    })),
  };
}

function Barcode() {
  const seed = 42;
  const bars = Array.from({ length: 52 }, (_, i) => ({
    width: ((seed * (i + 1) * 7) % 3) + 1,
    gap: ((seed * (i + 1) * 3) % 2) + 1,
  }));
  return (
    <div className="flex items-center h-10">
      {bars.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: `${b.gap}px` }}>
          <div style={{ width: `${b.width}px`, height: "40px", backgroundColor: "#101828" }} />
          <div style={{ width: `${b.gap}px` }} />
        </div>
      ))}
    </div>
  );
}

function TicketModal({ booking, onClose }: { booking: UpcomingBooking; onClose: () => void }) {
  const BKS_LOGO = "/assets/bks-logo.png";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#f3f4f6] rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb] bg-white rounded-t-2xl sticky top-0 z-10">
          <span className="text-[15px] font-semibold text-[#101828]">รายละเอียดตั๋ว</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#667085] border border-[#d0d5dd] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              พิมพ์
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f3f4f6]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Tickets */}
        <div className="p-4 flex flex-col gap-4">
          {booking.tickets.map((ticket, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden">
              {/* Ticket header */}
              <div className="bg-[#171b82] px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={BKS_LOGO} alt="BKS" className="h-6 w-auto brightness-0 invert" />
                  <div>
                    <div className="text-white/70 text-[10px] uppercase tracking-wider">E-Ticket · {booking.type}</div>
                    <div className="text-white text-[12px] font-semibold">ผู้โดยสาร {i + 1}/{booking.tickets.length}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-[10px]">เลขที่การจอง</div>
                  <div className="text-white text-[13px] font-semibold tracking-wider">{booking.id}</div>
                </div>
              </div>

              {/* Route */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[70px]">
                    <div className="text-[24px] font-semibold text-[#101828]">{booking.depart}</div>
                    <div className="text-[12px] font-semibold text-[#344054]">{booking.from.split("(")[0].trim()}</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">{"fromSub" in booking ? booking.fromSub : ""}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] text-[#9ca3af]">{booking.duration}</div>
                    <div className="w-full h-px bg-[#e5e7eb] relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#d0d5dd]" />
                      <svg className="absolute top-1/2 right-0 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <span className="text-[10px] bg-[#f3f4f6] text-[#667085] px-2 py-0.5 rounded-full font-medium">{booking.type}</span>
                  </div>
                  <div className="text-center min-w-[70px]">
                    <div className="text-[24px] font-semibold text-[#101828]">{booking.arrive}</div>
                    <div className="text-[12px] font-semibold text-[#344054]">{booking.to.split("(")[0].trim()}</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">{"toSub" in booking ? booking.toSub : ""}</div>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="mx-4 mb-3 bg-[#f9fafb] rounded-xl p-3.5 grid grid-cols-3 gap-3 text-[12px]">
                {[
                  ["วันที่เดินทาง", booking.date],
                  ["ผู้โดยสาร", ticket.name],
                  ["ที่นั่ง", ticket.seat],
                  ["เลขที่ตั๋ว", `${booking.id}-${i + 1}`],
                  ["ราคา", `${ticket.price.toLocaleString()} ฿`],
                  ["จุดรับ", "สายใต้ใหม่"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[#9ca3af] text-[10px] mb-0.5">{label}</div>
                    <div className={`font-semibold text-[13px] ${label === "ที่นั่ง" ? "text-[#cd416e]" : "text-[#344054]"}`}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Tear line */}
              <div className="flex items-center gap-2 mx-4 my-3">
                <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#d1d5db"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
                <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
              </div>

              {/* Barcode */}
              <div className="flex flex-col items-center gap-2 pb-5">
                <Barcode />
                <div className="text-[13px] font-semibold text-[#101828] tracking-[0.15em]">{booking.id}-{i + 1}</div>
                <div className="text-[11px] text-[#9ca3af]">แสดงรหัสนี้ที่ช่องตรวจตั๋วก่อนขึ้นรถ</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, showCancel = false, onViewTicket }: { booking: Booking; showCancel?: boolean; onViewTicket?: () => void }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">
      <div className="bg-[#171b82] px-5 py-3 flex items-center justify-between">
        <span className="text-white/80 text-[12px] font-medium">{booking.type}</span>
        <span className="text-white text-[13px] font-semibold tracking-wider">{booking.id}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-[22px] font-semibold text-[#101828]">{booking.depart}</div>
            <div className="text-[13px] font-semibold text-[#344054] mt-0.5">{booking.from}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-px bg-[#d0d5dd] relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#d0d5dd]" />
              <svg className="absolute top-1/2 right-0 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-semibold text-[#101828]">{booking.arrive}</div>
            <div className="text-[13px] font-semibold text-[#344054] mt-0.5">{booking.to}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[13px] text-[#667085] border-t border-[#f3f4f6] pt-4">
          <div className="flex items-center gap-4">
            <span>📅 {booking.date}</span>
            <span>👤 {booking.passengers} ที่นั่ง</span>
          </div>
          <div className="flex items-center gap-3">
            {onViewTicket && (
              <button
                onClick={onViewTicket}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#171b82] border border-[#171b82] px-3 py-1.5 rounded-lg hover:bg-[#f0f2ff] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/></svg>
                ดูรายละเอียดตั๋ว
              </button>
            )}
            {showCancel && (
              <button className="text-[13px] font-medium text-[#667085] border border-[#d0d5dd] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb]">
                ยกเลิก
              </button>
            )}
            <span className="text-[15px] font-semibold text-[#101828]">{booking.total.toLocaleString()} ฿</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[20px] font-semibold text-[#101828]">{title}</h2>
      {subtitle && <p className="text-[14px] text-[#667085] mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [active, setActive] = useState<Section>("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [ticketModal, setTicketModal] = useState<UpcomingBooking | null>(null);
  const [draftBooking, setDraftBooking] = useState<BookingDraft | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bks_user");
    if (!raw) { router.push("/login"); return; }
    const u: User = JSON.parse(raw);
    setUser(u);
    setForm({ name: u.name, email: u.email, phone: u.phone });

    const draft = readDraft();
    if (draft?.bookingNo && draft.passengers && draft.seats) {
      setDraftBooking(draft);
    }
  }, []);

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, ...form };
    localStorage.setItem("bks_user", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("bks_user");
    router.push("/");
  };

  if (!user) return null;

  const inputCls = "w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-1 focus:ring-[#171b82]";

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header />

      <div className="max-w-[1100px] mx-auto px-6 py-8 w-full flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-3">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-[#171b82] flex items-center justify-center text-white text-[26px] font-semibold">
              {user.name.charAt(2)}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#101828]">{user.name}</div>
              <div className="text-[13px] text-[#667085] mt-0.5">@{user.username}</div>
            </div>
            <span className="bg-[#f0f2ff] text-[#171b82] text-[11px] font-semibold px-3 py-1 rounded-full">
              สมาชิกทั่วไป
            </span>
            <div className="w-full border-t border-[#f3f4f6] pt-3 flex justify-center gap-6 text-center">
              <div>
                <div className="text-[16px] font-semibold text-[#101828]">1,502</div>
                <div className="text-[11px] text-[#9ca3af]">แต้มสะสม</div>
              </div>
              <div className="w-px bg-[#e5e7eb]" />
              <div>
                <div className="text-[16px] font-semibold text-[#101828]">3</div>
                <div className="text-[11px] text-[#9ca3af]">การเดินทาง</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-medium transition-colors
                  ${i < NAV_ITEMS.length - 1 ? "border-b border-[#f3f4f6]" : ""}
                  ${active === item.id
                    ? "bg-[#f0f2ff] text-[#171b82]"
                    : "text-[#344054] hover:bg-[#f9fafb]"
                  }`}
              >
                <span className={active === item.id ? "text-[#171b82]" : "text-[#9ca3af]"}>
                  {item.icon}
                </span>
                {item.label}
                {active === item.id && (
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[14px] font-medium text-[#f04438] hover:bg-[#fff1f0] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            ออกจากระบบ
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* Profile */}
          {active === "profile" && (
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3f4f6]">
                <SectionHeader title="ข้อมูลส่วนตัว" subtitle="จัดการข้อมูลและรายละเอียดบัญชีของคุณ" />
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#171b82] hover:text-[#131566] shrink-0 self-start mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    แก้ไข
                  </button>
                ) : (
                  <div className="flex items-center gap-3 shrink-0 self-start mt-1">
                    <button onClick={() => setEditing(false)} className="text-[13px] font-medium text-[#667085] hover:text-[#344054]">ยกเลิก</button>
                    <button onClick={handleSave} className="text-[13px] font-semibold text-white bg-[#171b82] px-4 py-1.5 rounded-lg hover:bg-[#131566]">บันทึก</button>
                  </div>
                )}
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                {[
                  { label: "ชื่อ-นามสกุล", field: "name" as const, value: form.name },
                  { label: "รหัสผู้ใช้งาน", field: null, value: user.username },
                  { label: "อีเมล", field: "email" as const, value: form.email },
                  { label: "เบอร์โทรศัพท์", field: "phone" as const, value: form.phone },
                ].map(({ label, field, value }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#667085] uppercase tracking-wider">{label}</label>
                    {editing && field ? (
                      <input value={value} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} className={inputCls} />
                    ) : (
                      <div className={`text-[15px] font-medium ${!field ? "text-[#9ca3af]" : "text-[#101828]"}`}>{value}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-[#f3f4f6] px-6 py-4">
                <div className="text-[13px] font-semibold text-[#344054] mb-3">ความปลอดภัย</div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "เปลี่ยนรหัสผ่าน", desc: "อัปเดตรหัสผ่านของคุณ" },
                    { label: "การยืนยันตัวตนสองชั้น (2FA)", desc: "เพิ่มความปลอดภัยให้บัญชีของคุณ" },
                  ].map(item => (
                    <button key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f9fafb] hover:bg-[#f0f2ff] text-left transition-colors">
                      <div>
                        <div className="text-[14px] font-medium text-[#101828]">{item.label}</div>
                        <div className="text-[12px] text-[#667085]">{item.desc}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Booking */}
          {active === "my-booking" && (() => {
            const realEntry = draftBooking ? draftToUpcoming(draftBooking) : null;
            const allUpcoming = [
              ...(realEntry ? [realEntry] : []),
              ...MOCK_UPCOMING,
            ];
            return (
              <div>
                <SectionHeader title="การจองของฉัน" subtitle="ตั๋วที่กำลังจะเดินทาง" />
                {allUpcoming.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center">
                    <div className="text-[#d0d5dd] mb-3">
                      <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="9" width="22" height="13" rx="2"/><path d="M17 9V6a5 5 0 00-10 0v3"/></svg>
                    </div>
                    <p className="text-[14px] text-[#667085]">ไม่มีการจองที่กำลังจะมาถึง</p>
                    <Link href="/" className="inline-block mt-4 bg-[#171b82] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#131566]">จองตั๋วใหม่</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {allUpcoming.map(b => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        showCancel
                        onViewTicket={() => setTicketModal(b)}
                      />
                    ))}
                    <Link href="/" className="self-start flex items-center gap-2 bg-[#171b82] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#131566]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                      จองตั๋วเพิ่ม
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Booking History */}
          {active === "booking-history" && (
            <div>
              <SectionHeader title="ประวัติการจอง" subtitle="รายการตั๋วที่เดินทางแล้วทั้งหมด" />
              <div className="flex flex-col gap-4">
                {MOCK_HISTORY.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}

          {/* Passengers */}
          {active === "passengers" && (
            <div>
              <div className="flex items-start justify-between mb-6">
                <SectionHeader title="รายชื่อผู้โดยสาร" subtitle="ข้อมูลผู้โดยสารที่บันทึกไว้" />
                <button className="flex items-center gap-1.5 bg-[#171b82] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#131566] shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  เพิ่มผู้โดยสาร
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {MOCK_PASSENGERS.map(p => (
                  <div key={p.id} className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f0f2ff] flex items-center justify-center text-[#171b82] text-[15px] font-semibold shrink-0">
                      {p.name.charAt(3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold text-[#101828]">{p.name}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-[12px] text-[#667085]">
                        <span>{p.type}: {p.idNumber}</span>
                        <span>·</span>
                        <span>{p.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="text-[#667085] hover:text-[#344054] p-1.5 rounded-lg hover:bg-[#f9fafb]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="text-[#f04438] hover:text-[#c0392b] p-1.5 rounded-lg hover:bg-[#fff1f0]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points */}
          {active === "points" && (
            <div>
              <SectionHeader title="แต้มสะสม" subtitle="สะสมแต้มทุกครั้งที่จองตั๋ว เพื่อรับสิทธิพิเศษ" />
              {/* Balance card */}
              <div className="bg-gradient-to-br from-[#171b82] to-[#2d3491] rounded-2xl p-6 mb-6 flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-[13px] font-medium mb-1">แต้มสะสมคงเหลือ</div>
                  <div className="text-white text-[40px] font-semibold leading-none">1,502</div>
                  <div className="text-white/60 text-[13px] mt-1">แต้ม BKS</div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <div className="bg-white/15 text-white text-[12px] font-medium px-3 py-1.5 rounded-full">100 แต้ม = 10 ฿</div>
                </div>
              </div>
              {/* History */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
                  <span className="text-[14px] font-semibold text-[#101828]">ประวัติแต้ม</span>
                </div>
                <div className="divide-y divide-[#f3f4f6]">
                  {MOCK_POINTS_HISTORY.map((p, i) => (
                    <div key={i} className="flex items-center px-5 py-3.5 gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${p.points > 0 ? "bg-[#d1fae5]" : "bg-[#fee2e2]"}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.points > 0 ? "#059669" : "#dc2626"} strokeWidth="2.5" strokeLinecap="round">
                          {p.points > 0 ? <path d="M12 19V5M5 12l7-7 7 7"/> : <path d="M12 5v14M5 12l7 7 7-7"/>}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-[#101828]">{p.desc}</div>
                        <div className="text-[12px] text-[#9ca3af]">{p.date}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-[14px] font-semibold ${p.points > 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
                          {p.points > 0 ? "+" : ""}{p.points} แต้ม
                        </div>
                        <div className="text-[12px] text-[#9ca3af]">คงเหลือ {p.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Coupons */}
          {active === "coupons" && (
            <div>
              <SectionHeader title="คูปองของฉัน" subtitle="คูปองและโปรโมชั่นที่ใช้ได้" />
              <div className="flex flex-col gap-4">
                {MOCK_COUPONS.map(c => (
                  <div key={c.code} className={`bg-white border rounded-xl overflow-hidden flex ${c.used ? "opacity-50" : ""}`}>
                    {/* Left color strip + discount */}
                    <div className={`w-[100px] shrink-0 flex flex-col items-center justify-center px-3 py-5 ${c.used ? "bg-[#f3f4f6]" : "bg-[#171b82]"}`}>
                      <div className={`text-[22px] font-semibold ${c.used ? "text-[#9ca3af]" : "text-white"}`}>{c.discount}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${c.used ? "text-[#9ca3af]" : "text-white/70"}`}>ส่วนลด</div>
                    </div>
                    {/* Tear line */}
                    <div className="flex flex-col justify-between py-3">
                      {[...Array(6)].map((_, i) => <div key={i} className="w-px h-2 bg-[#e5e7eb]" />)}
                    </div>
                    {/* Details */}
                    <div className="flex-1 px-5 py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[15px] font-semibold text-[#101828]">{c.desc}</div>
                        <div className="text-[12px] text-[#9ca3af] mt-1">หมดอายุ {c.expiry}</div>
                        <div className="font-mono text-[12px] text-[#667085] mt-1 bg-[#f3f4f6] px-2 py-0.5 rounded inline-block">{c.code}</div>
                      </div>
                      {c.used ? (
                        <span className="text-[12px] font-semibold text-[#9ca3af] border border-[#e5e7eb] px-3 py-1.5 rounded-lg shrink-0">ใช้แล้ว</span>
                      ) : (
                        <button className="text-[13px] font-semibold text-[#171b82] border border-[#171b82] px-4 py-2 rounded-lg hover:bg-[#f0f2ff] shrink-0 transition-colors">
                          ใช้คูปอง
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {ticketModal && <TicketModal booking={ticketModal} onClose={() => setTicketModal(null)} />}
    </div>
  );
}
