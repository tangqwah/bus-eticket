"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { readDraft, thaiDateLong, cityOf, stationOf, paxFullName, type BookingDraft } from "@/lib/bookingStore";
import { PERSON_TYPES, isoToThai as memberIsoToThai, validateThaiId, type ApprovalStatus } from "@/lib/mockMembers";
import { THAI_PROVINCES, getDistricts, getSubDistricts, getPostCode } from "@/lib/thaiAddress";

type User = { username: string; name: string; email: string; phone: string };

type UserProfile = {
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  nationality: string;
  id_card: string;
  passport_no: string;
  tel_no: string;
  email: string;
  address: string;
  sub_district: string;
  district: string;
  province: string;
  post_code: string;
};

const EMPTY_PROFILE: UserProfile = {
  title: "นาย", first_name: "", last_name: "", gender: "male",
  birth_date: "", nationality: "ไทย", id_card: "", passport_no: "",
  tel_no: "", email: "", address: "", sub_district: "", district: "",
  province: "", post_code: "",
};

function parseDisplayName(name: string): Pick<UserProfile, "title" | "first_name" | "last_name"> {
  const titles = ["นางสาว", "นาง", "นาย", "เด็กชาย", "เด็กหญิง", "นาวาอากาศเอก", "พ.ต.อ.", "พ.ต.ท.", "ร.ต.อ."];
  for (const title of titles) {
    if (name.startsWith(title)) {
      const rest = name.slice(title.length).trim();
      const spaceIdx = rest.indexOf(" ");
      if (spaceIdx === -1) return { title, first_name: rest, last_name: "" };
      return { title, first_name: rest.slice(0, spaceIdx), last_name: rest.slice(spaceIdx + 1) };
    }
  }
  const parts = name.split(" ");
  return { title: "", first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

type Section = "profile" | "my-booking" | "booking-history" | "passengers" | "points" | "coupons";

type MemberApplication = {
  title: string; first_name: string; last_name: string; gender: string;
  birth_date: string; nationality: string; id_card: string; passport_no: string;
  tel_no: string; email: string; address: string; sub_district: string;
  district: string; province: string; post_code: string;
  person_type_code: string; approval_status: ApprovalStatus;
  member_no?: string; submitted_at: string;
};

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
        <div className="p-4 flex flex-col gap-4">
          {booking.tickets.map((ticket, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden">
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
              <div className="flex items-center gap-2 mx-4 my-3">
                <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#d1d5db"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
                <div className="flex-1 border-t-2 border-dashed border-[#e5e7eb]" />
              </div>
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
  const [ticketModal, setTicketModal] = useState<UpcomingBooking | null>(null);
  const [draftBooking, setDraftBooking] = useState<BookingDraft | null>(null);

  // Profile — unified personal + contact form
  const [profileForm, setProfileForm] = useState<UserProfile>(EMPTY_PROFILE);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Membership
  const [memberApp, setMemberApp] = useState<MemberApplication | null>(null);
  const [memberTypeCode, setMemberTypeCode] = useState("general");
  const [memberProfileIncomplete, setMemberProfileIncomplete] = useState(false);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bks_user");
    if (!raw) { router.push("/login"); return; }
    const u: User = JSON.parse(raw);
    setUser(u);

    const profileRaw = localStorage.getItem("bks_user_profile");
    if (profileRaw) {
      setProfileForm(JSON.parse(profileRaw));
    } else {
      // Seed from bks_user so the user sees their existing name/contact
      const parsed = parseDisplayName(u.name);
      setProfileForm(f => ({ ...f, ...parsed, email: u.email, tel_no: u.phone }));
    }

    const draft = readDraft();
    if (draft?.bookingNo && draft.passengers && draft.seats) {
      setDraftBooking(draft);
    }

    const appRaw = localStorage.getItem("bks_member_application");
    if (appRaw) {
      const app: MemberApplication = JSON.parse(appRaw);
      setMemberApp(app);
      setMemberTypeCode(app.person_type_code);
    }
  }, []);

  const handleProfileSave = () => {
    const errs: Record<string, string> = {};
    if (!profileForm.first_name.trim()) errs.first_name = "กรุณากรอกชื่อ";
    if (!profileForm.last_name.trim()) errs.last_name = "กรุณากรอกนามสกุล";
    if (!profileForm.birth_date) errs.birth_date = "กรุณากรอกวันเกิด";
    if (!profileForm.tel_no.trim()) errs.tel_no = "กรุณากรอกเบอร์โทร";
    if (!profileForm.email.trim()) errs.email = "กรุณากรอกอีเมล";
    if (profileForm.nationality === "ไทย") {
      if (!profileForm.id_card.trim()) {
        errs.id_card = "กรุณากรอกเลขบัตรประชาชน";
      } else if (!validateThaiId(profileForm.id_card.replace(/-/g, ""))) {
        errs.id_card = "เลขบัตรประชาชนไม่ถูกต้อง";
      }
    } else {
      if (!profileForm.passport_no.trim()) errs.passport_no = "กรุณากรอกเลขหนังสือเดินทาง";
    }
    if (profileForm.post_code && !/^\d{5}$/.test(profileForm.post_code)) {
      errs.post_code = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    localStorage.setItem("bks_user_profile", JSON.stringify(profileForm));
    if (user) {
      const displayName = `${profileForm.title}${profileForm.first_name} ${profileForm.last_name}`.trim() || user.name;
      const updated = { ...user, name: displayName, email: profileForm.email, phone: profileForm.tel_no };
      localStorage.setItem("bks_user", JSON.stringify(updated));
      setUser(updated);
    }
    setProfileEditing(false);
    setProfileErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem("bks_user");
    router.push("/");
  };

  const handleMemberSubmit = () => {
    setMemberProfileIncomplete(false);
    const profileRaw = localStorage.getItem("bks_user_profile");
    const profile: UserProfile | null = profileRaw ? JSON.parse(profileRaw) : null;
    const isComplete = profile &&
      profile.first_name.trim() && profile.last_name.trim() && profile.birth_date &&
      (profile.nationality === "ไทย" ? profile.id_card.trim() : profile.passport_no.trim());
    if (!isComplete) {
      setMemberProfileIncomplete(true);
      return;
    }
    const app: MemberApplication = {
      ...profile,
      person_type_code: memberTypeCode,
      approval_status: "pending",
      submitted_at: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem("bks_member_application", JSON.stringify(app));
    setMemberApp(app);
    setMemberFormOpen(false);
    setDocFile(null);
  };

  if (!user) return null;

  const pInputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-1 focus:ring-[#171b82] ${profileErrors[field] ? "border-[#f04438]" : "border-[#d0d5dd]"}`;
  const pf = profileForm;
  const setPf = (k: keyof UserProfile, v: string) => setProfileForm(f => ({ ...f, [k]: v }));
  const pVal = (val: string, empty = "ยังไม่ได้กรอก") =>
    val ? <span className="text-[15px] font-medium text-[#101828]">{val}</span>
        : <span className="text-[15px] font-medium text-[#9ca3af]">{empty}</span>;

  const currentPersonType = memberApp ? PERSON_TYPES.find(p => p.code === memberApp.person_type_code) : null;
  const selectedPersonType = PERSON_TYPES.find(p => p.code === memberTypeCode);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Header />

      <div className="max-w-[1100px] mx-auto px-6 py-8 w-full flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-[#171b82] flex items-center justify-center text-white text-[26px] font-semibold">
              {user.name.charAt(2)}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#101828]">{user.name}</div>
              <div className="text-[13px] text-[#667085] mt-0.5">@{user.username}</div>
            </div>
            <span className="bg-[#f0f2ff] text-[#171b82] text-[11px] font-semibold px-3 py-1 rounded-full">
              {memberApp?.approval_status === "approved" && currentPersonType
                ? currentPersonType.name_th
                : "สมาชิกทั่วไป"}
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

          <nav className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-[14px] font-medium transition-colors
                  ${i < NAV_ITEMS.length - 1 ? "border-b border-[#f3f4f6]" : ""}
                  ${active === item.id ? "bg-[#f0f2ff] text-[#171b82]" : "text-[#344054] hover:bg-[#f9fafb]"}`}
              >
                <span className={active === item.id ? "text-[#171b82]" : "text-[#9ca3af]"}>{item.icon}</span>
                {item.label}
                {active === item.id && (
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                )}
              </button>
            ))}
          </nav>

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

          {/* ── Profile ── */}
          {active === "profile" && (
            <div className="flex flex-col gap-5">
              {/* Section header + edit toggle (controls both cards below) */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#101828]">ข้อมูลส่วนตัว</h2>
                  <p className="text-[14px] text-[#667085] mt-0.5">จัดการข้อมูลและรายละเอียดบัญชีของคุณ</p>
                </div>
                {!profileEditing ? (
                  <button
                    onClick={() => setProfileEditing(true)}
                    className="flex items-center gap-1.5 text-[13px] font-semibold text-[#171b82] hover:text-[#131566] shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    แก้ไข
                  </button>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => { setProfileEditing(false); setProfileErrors({}); }} className="text-[13px] font-medium text-[#667085] hover:text-[#344054]">ยกเลิก</button>
                    <button onClick={handleProfileSave} className="text-[13px] font-semibold text-white bg-[#171b82] px-4 py-1.5 rounded-lg hover:bg-[#131566]">บันทึก</button>
                  </div>
                )}
              </div>

              {/* Card 1: Personal info */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                <div className="text-[15px] font-semibold text-[#101828] mb-4">ข้อมูลส่วนตัว</div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      คำนำหน้า{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <select value={pf.title} onChange={e => setPf("title", e.target.value)} className={pInputCls("title")}>
                        {["นาย", "นาง", "นางสาว", "เด็กชาย", "เด็กหญิง", "ร.ต.อ.", "พ.ต.ท.", "พ.ต.อ.", "นาวาอากาศเอก"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : pVal(pf.title, "—")}
                  </div>
                  {/* Gender */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      เพศ{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <select value={pf.gender} onChange={e => setPf("gender", e.target.value)} className={pInputCls("gender")}>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="other">อื่น ๆ</option>
                      </select>
                    ) : pVal(pf.gender === "male" ? "ชาย" : pf.gender === "female" ? "หญิง" : pf.gender === "other" ? "อื่น ๆ" : "", "—")}
                  </div>
                  {/* First name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      ชื่อ{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <>
                        <input value={pf.first_name} onChange={e => setPf("first_name", e.target.value)} className={pInputCls("first_name")} placeholder="ชื่อจริง" />
                        {profileErrors.first_name && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.first_name}</p>}
                      </>
                    ) : pVal(pf.first_name)}
                  </div>
                  {/* Last name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      นามสกุล{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <>
                        <input value={pf.last_name} onChange={e => setPf("last_name", e.target.value)} className={pInputCls("last_name")} placeholder="นามสกุล" />
                        {profileErrors.last_name && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.last_name}</p>}
                      </>
                    ) : pVal(pf.last_name)}
                  </div>
                  {/* Birth date */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      วันเกิด{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <>
                        <input type="date" value={pf.birth_date} onChange={e => setPf("birth_date", e.target.value)} className={pInputCls("birth_date")} />
                        {profileErrors.birth_date && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.birth_date}</p>}
                      </>
                    ) : pVal(pf.birth_date ? memberIsoToThai(pf.birth_date) : "")}
                  </div>
                  {/* Nationality */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      สัญชาติ{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <select
                        value={pf.nationality}
                        onChange={e => { setPf("nationality", e.target.value); setPf("id_card", ""); setPf("passport_no", ""); }}
                        className={pInputCls("nationality")}
                      >
                        {["ไทย", "อเมริกัน", "อังกฤษ", "ญี่ปุ่น", "จีน", "เกาหลี", "อื่น ๆ"].map(n => <option key={n}>{n}</option>)}
                      </select>
                    ) : pVal(pf.nationality, "—")}
                  </div>
                  {/* ID card or Passport */}
                  {pf.nationality === "ไทย" ? (
                    <div className="col-span-2">
                      <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                        เลขบัตรประชาชน{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                      </label>
                      {profileEditing ? (
                        <>
                          <input
                            value={pf.id_card}
                            onChange={e => setPf("id_card", e.target.value.replace(/\D/g, "").slice(0, 13))}
                            className={pInputCls("id_card")}
                            placeholder="13 หลัก"
                            maxLength={13}
                            inputMode="numeric"
                          />
                          {profileErrors.id_card && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.id_card}</p>}
                        </>
                      ) : pVal(pf.id_card ? pf.id_card.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5") : "")}
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                        เลขหนังสือเดินทาง{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                      </label>
                      {profileEditing ? (
                        <>
                          <input value={pf.passport_no} onChange={e => setPf("passport_no", e.target.value)} className={pInputCls("passport_no")} placeholder="Passport Number" />
                          {profileErrors.passport_no && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.passport_no}</p>}
                        </>
                      ) : pVal(pf.passport_no)}
                    </div>
                  )}
                  {/* Username — always read-only */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">รหัสผู้ใช้งาน</label>
                    <div className="text-[15px] font-medium text-[#9ca3af]">{user.username}</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact info */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                <div className="text-[15px] font-semibold text-[#101828] mb-4">ข้อมูลติดต่อ</div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Tel */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      เบอร์โทรศัพท์{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <>
                        <input value={pf.tel_no} onChange={e => setPf("tel_no", e.target.value)} className={pInputCls("tel_no")} placeholder="0XX-XXX-XXXX" />
                        {profileErrors.tel_no && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.tel_no}</p>}
                      </>
                    ) : pVal(pf.tel_no)}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">
                      อีเมล{profileEditing && <span className="text-[#f04438] ml-0.5">*</span>}
                    </label>
                    {profileEditing ? (
                      <>
                        <input type="email" value={pf.email} onChange={e => setPf("email", e.target.value)} className={pInputCls("email")} placeholder="email@example.com" />
                        {profileErrors.email && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.email}</p>}
                      </>
                    ) : pVal(pf.email)}
                  </div>
                  {/* Address */}
                  <div className="col-span-2">
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">ที่อยู่</label>
                    {profileEditing ? (
                      <input value={pf.address} onChange={e => setPf("address", e.target.value)} className={pInputCls("address")} placeholder="บ้านเลขที่ ซอย ถนน" />
                    ) : pVal(pf.address)}
                  </div>
                  {/* Province */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">จังหวัด</label>
                    {profileEditing ? (
                      <select
                        value={pf.province}
                        onChange={e => { setPf("province", e.target.value); setPf("district", ""); setPf("sub_district", ""); setPf("post_code", ""); }}
                        className={pInputCls("province")}
                      >
                        <option value="">-- เลือกจังหวัด --</option>
                        {THAI_PROVINCES.map(p => <option key={p.name}>{p.name}</option>)}
                      </select>
                    ) : pVal(pf.province)}
                  </div>
                  {/* District */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">เขต/อำเภอ</label>
                    {profileEditing ? (
                      <select
                        value={pf.district}
                        onChange={e => { setPf("district", e.target.value); setPf("sub_district", ""); setPf("post_code", ""); }}
                        disabled={!pf.province}
                        className={pInputCls("district") + " disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"}
                      >
                        <option value="">-- เลือกเขต/อำเภอ --</option>
                        {getDistricts(pf.province).map(d => <option key={d.name}>{d.name}</option>)}
                      </select>
                    ) : pVal(pf.district)}
                  </div>
                  {/* Sub-district */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">แขวง/ตำบล</label>
                    {profileEditing ? (
                      <select
                        value={pf.sub_district}
                        onChange={e => { setPf("sub_district", e.target.value); setPf("post_code", getPostCode(pf.province, pf.district, e.target.value)); }}
                        disabled={!pf.district}
                        className={pInputCls("sub_district") + " disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"}
                      >
                        <option value="">-- เลือกแขวง/ตำบล --</option>
                        {getSubDistricts(pf.province, pf.district).map(s => <option key={s.name}>{s.name}</option>)}
                      </select>
                    ) : pVal(pf.sub_district)}
                  </div>
                  {/* Post code */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#667085] uppercase tracking-wider mb-1.5">รหัสไปรษณีย์</label>
                    {profileEditing ? (
                      <>
                        <input
                          value={pf.post_code}
                          onChange={e => setPf("post_code", e.target.value.replace(/\D/g, "").slice(0, 5))}
                          className={pInputCls("post_code")}
                          placeholder="xxxxx"
                          maxLength={5}
                          inputMode="numeric"
                        />
                        {profileErrors.post_code && <p className="text-[12px] text-[#f04438] mt-1">{profileErrors.post_code}</p>}
                      </>
                    ) : pVal(pf.post_code)}
                  </div>
                </div>
              </div>

              {/* Card 3: Security */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
                <div className="text-[14px] font-semibold text-[#344054] mb-3">ความปลอดภัย</div>
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

              {/* Card 4: Member type — status display + inline application form */}
              <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
                  <div className="text-[15px] font-semibold text-[#101828]">ประเภทสมาชิก</div>
                  {!memberFormOpen && memberApp?.approval_status === "approved" && (
                    <button
                      onClick={() => setMemberFormOpen(true)}
                      className="text-[13px] font-medium text-[#667085] border border-[#d0d5dd] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors"
                    >
                      เปลี่ยนประเภท
                    </button>
                  )}
                  {memberFormOpen && (
                    <button
                      onClick={() => { setMemberFormOpen(false); setMemberProfileIncomplete(false); setDocFile(null); }}
                      className="text-[13px] font-medium text-[#667085] hover:text-[#344054]"
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {/* Status display — hidden when form is open */}
                  {!memberFormOpen && (
                    <>
                      {(!memberApp || memberApp.approval_status === "rejected" || memberApp.approval_status === "expired") && (
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full mb-2 ${
                              memberApp?.approval_status === "rejected" ? "bg-[#fee2e2] text-[#dc2626]"
                              : memberApp?.approval_status === "expired" ? "bg-[#f3f4f6] text-[#9ca3af]"
                              : "bg-[#f0f2ff] text-[#171b82]"
                            }`}>
                              {memberApp?.approval_status === "rejected" ? "ไม่อนุมัติ"
                               : memberApp?.approval_status === "expired" ? "หมดอายุ"
                               : "สมาชิกทั่วไป"}
                            </span>
                            <p className="text-[13px] text-[#667085]">สมัครสมาชิกสิทธิพิเศษเพื่อรับส่วนลดและสิทธิพิเศษจาก บขส.</p>
                          </div>
                          <button
                            onClick={() => setMemberFormOpen(true)}
                            className="text-[13px] font-semibold text-white bg-[#171b82] px-4 py-2 rounded-lg hover:bg-[#131566] shrink-0 transition-colors"
                          >
                            สมัครสมาชิก
                          </button>
                        </div>
                      )}
                      {memberApp?.approval_status === "pending" && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#fef9c3] flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="bg-[#fef9c3] text-[#b45309] text-[12px] font-semibold px-2 py-0.5 rounded-full">รอตรวจสอบ</span>
                              <span className="text-[14px] font-semibold text-[#101828]">{currentPersonType?.name_th}</span>
                            </div>
                            <div className="text-[13px] text-[#667085]">ยื่นเมื่อ {memberIsoToThai(memberApp.submitted_at)}</div>
                          </div>
                        </div>
                      )}
                      {memberApp?.approval_status === "approved" && currentPersonType && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="bg-[#d1fae5] text-[#059669] text-[12px] font-semibold px-2 py-0.5 rounded-full">อนุมัติแล้ว</span>
                              <span className="text-[14px] font-semibold text-[#101828]">{currentPersonType.name_th}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[13px] text-[#667085] flex-wrap">
                              {currentPersonType.default_discount > 0 && (
                                <span className="text-[#059669] font-medium">ส่วนลด {currentPersonType.default_discount}%</span>
                              )}
                              {memberApp.member_no && (
                                <span>เลขสมาชิก: <span className="font-mono font-semibold text-[#101828]">{memberApp.member_no}</span></span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Inline application form */}
                  {memberFormOpen && (
                    <form onSubmit={e => { e.preventDefault(); handleMemberSubmit(); }} className="flex flex-col gap-4">
                      {memberProfileIncomplete && (
                        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#fff7ed] border border-[#fed7aa]">
                          <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-semibold text-[#c2410c]">กรุณากรอกข้อมูลส่วนตัวให้ครบก่อนสมัครสมาชิก</div>
                            <div className="text-[13px] text-[#9ca3af] mt-0.5">ต้องการ: ชื่อ-นามสกุล, วันเกิด และเลขบัตรประชาชน / หนังสือเดินทาง</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setMemberFormOpen(false); setProfileEditing(true); setMemberProfileIncomplete(false); }}
                            className="text-[13px] font-semibold text-[#c2410c] hover:underline shrink-0"
                          >
                            ไปกรอกข้อมูล
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        {PERSON_TYPES.map(pt => (
                          <button
                            key={pt.code}
                            type="button"
                            onClick={() => { setMemberTypeCode(pt.code); if (!pt.requires_document) setDocFile(null); }}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                              memberTypeCode === pt.code ? "border-[#171b82] bg-[#f0f2ff]" : "border-[#e5e7eb] hover:border-[#d0d5dd]"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${memberTypeCode === pt.code ? "border-[#171b82]" : "border-[#d0d5dd]"}`}>
                              {memberTypeCode === pt.code && <div className="w-2.5 h-2.5 rounded-full bg-[#171b82]" />}
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-[#101828]">{pt.name_th}</div>
                              {pt.default_discount > 0 && <div className="text-[12px] text-[#059669] font-medium mt-0.5">ส่วนลด {pt.default_discount}%</div>}
                              {pt.doc_label && <div className="text-[12px] text-[#9ca3af] mt-0.5">เอกสาร: {pt.doc_label}</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                      {selectedPersonType?.requires_document && (
                        <div>
                          <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">
                            อัปโหลดเอกสาร ({selectedPersonType.doc_label})
                          </label>
                          <label
                            htmlFor="doc-upload"
                            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#d0d5dd] rounded-xl p-6 cursor-pointer hover:border-[#171b82] hover:bg-[#f0f2ff] transition-colors"
                          >
                            {docFile ? (
                              <div className="flex items-center gap-2 text-[14px] font-medium text-[#101828]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                {docFile.name}
                              </div>
                            ) : (
                              <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                <div className="text-[14px] text-[#667085]">คลิกเพื่ออัปโหลดไฟล์</div>
                                <div className="text-[12px] text-[#9ca3af]">รองรับ JPG, PNG, PDF (ขนาดไม่เกิน 5MB)</div>
                              </>
                            )}
                          </label>
                          <input id="doc-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
                        </div>
                      )}
                      <button
                        type="submit"
                        className="bg-[#171b82] text-white text-[15px] font-semibold py-3 rounded-xl hover:bg-[#0f1260] transition-colors"
                      >
                        ส่งคำขอสมัครสมาชิก
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── My Booking ── */}
          {active === "my-booking" && (() => {
            const realEntry = draftBooking ? draftToUpcoming(draftBooking) : null;
            const allUpcoming = [...(realEntry ? [realEntry] : []), ...MOCK_UPCOMING];
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
                      <BookingCard key={b.id} booking={b} showCancel onViewTicket={() => setTicketModal(b)} />
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

          {/* ── Booking History ── */}
          {active === "booking-history" && (
            <div>
              <SectionHeader title="ประวัติการจอง" subtitle="รายการตั๋วที่เดินทางแล้วทั้งหมด" />
              <div className="flex flex-col gap-4">
                {MOCK_HISTORY.map(b => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}

          {/* ── Passengers ── */}
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

          {/* ── Points ── */}
          {active === "points" && (
            <div>
              <SectionHeader title="แต้มสะสม" subtitle="สะสมแต้มทุกครั้งที่จองตั๋ว เพื่อรับสิทธิพิเศษ" />
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

          {/* ── Coupons ── */}
          {active === "coupons" && (
            <div>
              <SectionHeader title="คูปองของฉัน" subtitle="คูปองและโปรโมชั่นที่ใช้ได้" />
              <div className="flex flex-col gap-4">
                {MOCK_COUPONS.map(c => (
                  <div key={c.code} className={`bg-white border rounded-xl overflow-hidden flex ${c.used ? "opacity-50" : ""}`}>
                    <div className={`w-[100px] shrink-0 flex flex-col items-center justify-center px-3 py-5 ${c.used ? "bg-[#f3f4f6]" : "bg-[#171b82]"}`}>
                      <div className={`text-[22px] font-semibold ${c.used ? "text-[#9ca3af]" : "text-white"}`}>{c.discount}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${c.used ? "text-[#9ca3af]" : "text-white/70"}`}>ส่วนลด</div>
                    </div>
                    <div className="flex flex-col justify-between py-3">
                      {[...Array(6)].map((_, i) => <div key={i} className="w-px h-2 bg-[#e5e7eb]" />)}
                    </div>
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
