import type { MemberType } from "./mockMembers";

export type TripStatus = "scheduled" | "ontime" | "departed" | "cancelled";
export type PassengerStatus = "confirmed" | "pending" | "cancelled";

export type Trip = {
  id: string;
  date: string;
  route: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  type: string;
  sold: number;
  total: number;
  status: TripStatus;
  revenue: number;
};

export type TripPassenger = {
  bookingId: string;
  name: string;
  seats: string;
  seatCount: number;
  paymentMethod: string;
  status: PassengerStatus;
  userType: MemberType | "guest";
};

export const TRIP_STATUS_MAP: Record<TripStatus, { label: string; cls: string }> = {
  scheduled: { label: "กำหนดการ",       cls: "bg-[#f0f2ff] text-[#171b82]" },
  ontime:    { label: "กำลังดำเนินการ",  cls: "bg-[#d1fae5] text-[#059669]" },
  departed:  { label: "เสร็จสิ้น",       cls: "bg-[#f3f4f6] text-[#667085]" },
  cancelled: { label: "ยกเลิก",          cls: "bg-[#fee2e2] text-[#dc2626]" },
};

export const MOCK_TRIPS: Trip[] = [
  { id: "TRP-001", date: "15 ก.ค. 2569", route: "BKK-HKT", from: "สายใต้ใหม่",  to: "ภูเก็ต",         depart: "08:30", arrive: "21:00", type: "รถด่วนพิเศษ",      sold: 36, total: 42, status: "departed",  revenue: 21420 },
  { id: "TRP-002", date: "15 ก.ค. 2569", route: "BKK-CNX", from: "หมอชิต 2",    to: "เชียงใหม่",      depart: "20:00", arrive: "07:30", type: "รถนอนปรับอากาศ",  sold: 40, total: 44, status: "departed",  revenue: 25920 },
  { id: "TRP-003", date: "15 ก.ค. 2569", route: "BKK-CPN", from: "สายใต้ใหม่",  to: "ชุมพร",          depart: "07:00", arrive: "15:30", type: "รถด่วน",           sold: 35, total: 40, status: "departed",  revenue: 11200 },
  { id: "TRP-004", date: "16 ก.ค. 2569", route: "BKK-SUG", from: "สายใต้ใหม่",  to: "สุราษฎร์ธานี",   depart: "09:30", arrive: "21:00", type: "รถด่วน",           sold: 28, total: 40, status: "ontime",    revenue: 12460 },
  { id: "TRP-005", date: "16 ก.ค. 2569", route: "BKK-KKN", from: "หมอชิต 2",    to: "ขอนแก่น",        depart: "09:00", arrive: "15:30", type: "รถด่วน",           sold: 38, total: 44, status: "ontime",    revenue: 14440 },
  { id: "TRP-006", date: "16 ก.ค. 2569", route: "BKK-PTY", from: "เอกมัย",      to: "พัทยา",          depart: "08:00", arrive: "10:30", type: "รถปรับอากาศ",      sold: 22, total: 30, status: "ontime",    revenue: 2640  },
  { id: "TRP-007", date: "17 ก.ค. 2569", route: "BKK-HKT", from: "สายใต้ใหม่",  to: "ภูเก็ต",         depart: "08:30", arrive: "21:00", type: "รถด่วนพิเศษ",      sold: 30, total: 42, status: "scheduled", revenue: 17850 },
  { id: "TRP-008", date: "17 ก.ค. 2569", route: "BKK-CNX", from: "หมอชิต 2",    to: "เชียงใหม่",      depart: "20:00", arrive: "07:30", type: "รถนอนปรับอากาศ",  sold: 18, total: 44, status: "scheduled", revenue: 11664 },
  { id: "TRP-009", date: "17 ก.ค. 2569", route: "BKK-CPN", from: "สายใต้ใหม่",  to: "ชุมพร",          depart: "07:00", arrive: "15:30", type: "รถด่วน",           sold: 35, total: 40, status: "scheduled", revenue: 11200 },
  { id: "TRP-010", date: "17 ก.ค. 2569", route: "BKK-UDN", from: "หมอชิต 2",    to: "อุดรธานี",        depart: "09:00", arrive: "16:00", type: "รถด่วนพิเศษ",      sold: 20, total: 42, status: "scheduled", revenue: 8400  },
  { id: "TRP-011", date: "18 ก.ค. 2569", route: "BKK-HKT", from: "สายใต้ใหม่",  to: "ภูเก็ต",         depart: "08:30", arrive: "21:00", type: "รถด่วนพิเศษ",      sold: 12, total: 42, status: "scheduled", revenue: 7140  },
  { id: "TRP-012", date: "18 ก.ค. 2569", route: "BKK-UBN", from: "หมอชิต 2",    to: "อุบลราชธานี",    depart: "08:00", arrive: "17:00", type: "รถด่วน",           sold: 8,  total: 44, status: "cancelled", revenue: 0     },
];

export const MOCK_TRIP_PASSENGERS: Record<string, TripPassenger[]> = {
  "TRP-001": [
    { bookingId: "BKS-5W2X89", name: "นายทดสอบ ระบบ",         seats: "1A, 1B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "general"  },
    { bookingId: "BKS-9Y4L33", name: "นายสมชาย ดีมาก",        seats: "2A, 2B, 2C", seatCount: 3, paymentMethod: "QR Code",     status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P103",   name: "นางพิมพ์ใจ บุญมี",       seats: "3A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P104",   name: "นายประทีป ศรีดี",        seats: "4A, 4B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "official" },
    { bookingId: "BKS-P105",   name: "นางสาวรัตนา สุขสม",     seats: "5A, 5B",     seatCount: 2, paymentMethod: "QR Code",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P106",   name: "นายอภิชาติ เรียนดี",     seats: "6A",         seatCount: 1, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P107",   name: "นางประนอม มีชัย",        seats: "7A, 7B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "disabled" },
    { bookingId: "BKS-P108",   name: "นางสาวสมหญิง ดีดี",     seats: "8A",         seatCount: 1, paymentMethod: "QR Code",     status: "pending",   userType: "guest"    },
  ],
  "TRP-002": [
    { bookingId: "BKS-4K9R22", name: "นางสาวสมหญิง ดีดี",    seats: "1A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P201",   name: "นายกมล สุขใจ",          seats: "2A, 2B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P202",   name: "ร.ต.อ. สมชาย ปราบปราม", seats: "3A, 3B",    seatCount: 2, paymentMethod: "เงินสด",      status: "confirmed", userType: "official" },
    { bookingId: "BKS-P203",   name: "นายสิทธิพร ชนะ",        seats: "4A, 4B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P204",   name: "นางสาวมณีรัตน์ ทองดี",  seats: "5A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P205",   name: "นายอนุสรณ์ ภักดี",      seats: "6A, 6B",     seatCount: 2, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P206",   name: "นางสาวกนกวรรณ ศึกษาดี", seats: "7A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P207",   name: "นายวิทยา ใจดี",         seats: "8A, 8B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "pending",   userType: "guest"    },
  ],
  "TRP-003": [
    { bookingId: "BKS-5C6D78", name: "นางสาวรักษ์ ธรรมดี",   seats: "1A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P301",   name: "นายกิตติพงษ์ ราชการ",   seats: "2A, 2B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "official" },
    { bookingId: "BKS-P302",   name: "นางสาวปวีณา ชัยชนะ",    seats: "3A, 3B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P303",   name: "นายธนพล ใจแข็ง",        seats: "4A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "disabled" },
    { bookingId: "BKS-P304",   name: "นางบุญมี รักดี",         seats: "5A, 5B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "cancelled", userType: "guest"    },
    { bookingId: "BKS-P305",   name: "นายสมศักดิ์ วัยชรา",    seats: "6A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P306",   name: "นางวิภา สุขใจ",         seats: "7A, 7B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "guest"    },
  ],
  "TRP-004": [
    { bookingId: "BKS-8P1Q45", name: "นายวิทยา ใจดี",         seats: "1A, 1B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "pending",   userType: "employee" },
    { bookingId: "BKS-P401",   name: "นางสาวสุภาพ ใจดี",      seats: "2A, 2B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P402",   name: "นายประสงค์ ดีงาม",      seats: "3A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P403",   name: "พ.ต.ท. วิโรจน์ กล้าหาญ", seats: "4A, 4B",   seatCount: 2, paymentMethod: "เงินสด",      status: "confirmed", userType: "official" },
    { bookingId: "BKS-P404",   name: "นางสาวธัญญา สวัสดิ์",   seats: "5A, 5B",     seatCount: 2, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "official" },
    { bookingId: "BKS-P405",   name: "นายกมล สุขใจ",          seats: "6A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P406",   name: "นางสาวรักษ์ ธรรมดี",   seats: "7A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "senior"   },
  ],
  "TRP-005": [
    { bookingId: "BKS-6N3H71", name: "นายประทีป ศรีดี",       seats: "1A, 1B",     seatCount: 2, paymentMethod: "เงินสด",      status: "confirmed", userType: "official" },
    { bookingId: "BKS-P501",   name: "นายสิทธิพร ชนะ",        seats: "2A, 2B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P502",   name: "นางอรพรรณ ศักดิ์ดี",    seats: "3A",         seatCount: 1, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "official" },
    { bookingId: "BKS-P503",   name: "นายอภิชาติ เรียนดี",    seats: "4A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P504",   name: "นางประนอม มีชัย",        seats: "5A, 5B",     seatCount: 2, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "disabled" },
    { bookingId: "BKS-P505",   name: "นายทดสอบ ระบบ",         seats: "6A, 6B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P506",   name: "นางสาวกนกวรรณ ศึกษาดี", seats: "7A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "student"  },
  ],
  "TRP-006": [
    { bookingId: "BKS-2M7T88", name: "นางบุญมี รักดี",         seats: "1A, 1B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "cancelled", userType: "guest"    },
    { bookingId: "BKS-2G3H45", name: "นางวิภา สุขใจ",         seats: "2A, 2B, 2C, 2D", seatCount: 4, paymentMethod: "โอนเงิน", status: "cancelled", userType: "guest"  },
    { bookingId: "BKS-P601",   name: "นายกมล สุขใจ",          seats: "3A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P602",   name: "นางสาวสมหญิง ดีดี",     seats: "4A",         seatCount: 1, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P603",   name: "นายสมศักดิ์ วัยชรา",    seats: "5A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P604",   name: "นายธนพล ใจแข็ง",        seats: "6A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "disabled" },
  ],
  "TRP-007": [
    { bookingId: "BKS-P701",   name: "นายทดสอบ ระบบ",         seats: "1A, 1B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P702",   name: "นางสาวสุภาพ ใจดี",      seats: "2A, 2B",     seatCount: 2, paymentMethod: "QR Code",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P703",   name: "นายวิทยา ใจดี",         seats: "3A, 3B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "pending",   userType: "guest"    },
    { bookingId: "BKS-P704",   name: "นายกิตติ ดีใจ",         seats: "4A, 4B",     seatCount: 2, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P705",   name: "นางพิมพ์ใจ บุญมี",       seats: "5A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P706",   name: "นายสมชาย ดีมาก",        seats: "6A, 6B",     seatCount: 2, paymentMethod: "QR Code",     status: "confirmed", userType: "guest"    },
  ],
  "TRP-008": [
    { bookingId: "BKS-P801",   name: "นายกิตติพงษ์ ราชการ",   seats: "1A, 1B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "official" },
    { bookingId: "BKS-P802",   name: "ร.ต.อ. สมชาย ปราบปราม", seats: "2A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "official" },
    { bookingId: "BKS-P803",   name: "นางสาวรักษ์ ธรรมดี",   seats: "3A",         seatCount: 1, paymentMethod: "QR Code",     status: "pending",   userType: "senior"   },
    { bookingId: "BKS-P804",   name: "นายประทีป ศรีดี",        seats: "4A, 4B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "official" },
    { bookingId: "BKS-P805",   name: "นางประนอม มีชัย",        seats: "5A",         seatCount: 1, paymentMethod: "บัตรเครดิต", status: "confirmed", userType: "disabled" },
  ],
  "TRP-009": [
    { bookingId: "BKS-P901",   name: "นายอภิชาติ เรียนดี",    seats: "1A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P902",   name: "นางสาวมณีรัตน์ ทองดี",  seats: "2A, 2B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P903",   name: "นายสมชาย ดีมาก",        seats: "3A, 3B, 3C", seatCount: 3, paymentMethod: "QR Code",     status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P904",   name: "นางวิภา สุขใจ",         seats: "4A",         seatCount: 1, paymentMethod: "โอนเงิน",     status: "pending",   userType: "disabled" },
    { bookingId: "BKS-P905",   name: "นายกมล สุขใจ",          seats: "5A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "general"  },
  ],
  "TRP-010": [
    { bookingId: "BKS-1A2B34", name: "นายทดสอบ ระบบ",         seats: "1A, 1B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "confirmed", userType: "general"  },
    { bookingId: "BKS-P1001",  name: "นางสาวธัญญา สวัสดิ์",   seats: "2A, 2B",     seatCount: 2, paymentMethod: "QR Code",     status: "confirmed", userType: "official" },
    { bookingId: "BKS-P1002",  name: "นายประสงค์ ดีงาม",      seats: "3A, 3B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P1003",  name: "นางสาวสุภาพ ใจดี",      seats: "4A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "employee" },
    { bookingId: "BKS-P1004",  name: "นายวิทยา ใจดี",         seats: "5A",         seatCount: 1, paymentMethod: "บัตรเครดิต", status: "pending",   userType: "guest"    },
  ],
  "TRP-011": [
    { bookingId: "BKS-P1101",  name: "นายสมชาย ดีมาก",        seats: "1A, 1B, 1C", seatCount: 3, paymentMethod: "QR Code",     status: "confirmed", userType: "guest"    },
    { bookingId: "BKS-P1102",  name: "นายสมศักดิ์ วัยชรา",    seats: "2A",         seatCount: 1, paymentMethod: "เงินสด",      status: "confirmed", userType: "senior"   },
    { bookingId: "BKS-P1103",  name: "นางสาวกนกวรรณ ศึกษาดี", seats: "3A",         seatCount: 1, paymentMethod: "QR Code",     status: "confirmed", userType: "student"  },
    { bookingId: "BKS-P1104",  name: "นายธนพล ใจแข็ง",        seats: "4A",         seatCount: 1, paymentMethod: "บัตรเดบิต",  status: "confirmed", userType: "disabled" },
  ],
  "TRP-012": [
    { bookingId: "BKS-P1201",  name: "นางสาวรัตนา สุขสม",     seats: "1A, 1B",     seatCount: 2, paymentMethod: "บัตรเดบิต",  status: "cancelled", userType: "employee" },
    { bookingId: "BKS-8E9F01", name: "นายกิตติ ดีใจ",         seats: "2A, 2B",     seatCount: 2, paymentMethod: "บัตรเครดิต", status: "cancelled", userType: "student"  },
    { bookingId: "BKS-P1203",  name: "นายอนุสรณ์ ภักดี",      seats: "3A, 3B",     seatCount: 2, paymentMethod: "โอนเงิน",     status: "cancelled", userType: "official" },
  ],
};
