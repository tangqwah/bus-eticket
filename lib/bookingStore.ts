const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const THAI_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

export function thaiDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const dt = new Date(y, m - 1, d);
  return `${THAI_DAYS[dt.getDay()]} ${dt.getDate()} ${THAI_MONTHS[dt.getMonth()]} ${dt.getFullYear() + 543}`;
}

export function buildDateStrip(iso: string): { day: string; date: string; iso: string }[] {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(y, m - 1, d + i - 3);
    return {
      day: THAI_DAYS[dt.getDay()],
      date: `${dt.getDate()} ${THAI_MONTHS[dt.getMonth()]}`,
      iso: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`,
    };
  });
}

export function cityOf(s: string): string {
  return s.replace(/\s*\([^)]*\)$/, "").trim();
}

export function stationOf(s: string): string | null {
  const m = s.match(/\(([^)]+)\)$/);
  return m ? m[1] : null;
}

export interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  idType: "citizen" | "passport";
  idNumber: string;
  gender: "male" | "female" | "child";
  phone: string;
  email: string;
  pickup: string;
}

export function paxFullName(p: PassengerInfo): string {
  const name = `${p.title}${p.firstName} ${p.lastName}`.trim();
  return name.replace(/\s+/, " ") || "(ไม่ระบุชื่อ)";
}

export interface BookingDraft {
  from: string;
  to: string;
  date: string;
  paxCount: number;
  busNo: string;
  busRoute: string;
  busType: string;
  busTypeColor: string;
  dep: string;
  arr: string;
  nextDay: boolean;
  dur: string;
  seatClass: string;
  pricePerSeat: number;
  passengers?: PassengerInfo[];
  seats?: string[];
  bookingNo?: string;
}

const DRAFT_KEY = "bks_booking_draft";

export function readDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch {
    return null;
  }
}

export function writeDraft(draft: BookingDraft): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function generateBookingNo(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `BKS-${rand}`;
}
