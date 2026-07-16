export type MemberType = "general" | "employee" | "official" | "senior" | "student" | "disabled";
export type MemberStatus = "pending" | "approved" | "rejected" | "expired";

export type AuditEntry = {
  id: string;
  adminName: string;
  action: string;
  note?: string;
  timestamp: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberType: MemberType;
  status: MemberStatus;
  documentLabel?: string;
  submittedAt: string;
  approvedAt?: string;
  expiryDate?: string;
  discountPercent?: number;
  rejectionReason?: string;
  mockAuditLog: AuditEntry[];
};

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  general: "ผู้ใช้ทั่วไป",
  employee: "พนักงาน บขส.",
  official: "ข้าราชการ/ทหาร",
  senior: "ผู้สูงอายุ",
  student: "เด็กนักเรียน/นักศึกษา",
  disabled: "ผู้พิการ",
};

export const MEMBER_TYPE_COLORS: Record<MemberType, string> = {
  general: "bg-[#f3f4f6] text-[#667085]",
  employee: "bg-[#f0f2ff] text-[#171b82]",
  official: "bg-[#f5f3ff] text-[#6d28d9]",
  senior: "bg-[#fffbeb] text-[#b45309]",
  student: "bg-[#f0fdfa] text-[#0f766e]",
  disabled: "bg-[#fff1f2] text-[#9f1239]",
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
  expired: "หมดอายุ",
};

export const MEMBER_STATUS_COLORS: Record<MemberStatus, string> = {
  pending: "bg-[#fef9c3] text-[#b45309]",
  approved: "bg-[#d1fae5] text-[#059669]",
  rejected: "bg-[#fee2e2] text-[#dc2626]",
  expired: "bg-[#f3f4f6] text-[#9ca3af]",
};

// false for types with no expiry (general, senior); true for all others
export const MEMBER_TYPE_HAS_EXPIRY: Record<MemberType, boolean> = {
  general: false,
  employee: true,
  official: true,
  senior: false,
  student: true,
  disabled: true,
};

export const MEMBER_TYPE_NEEDS_DOC: Record<MemberType, boolean> = {
  general: false,
  employee: true,
  official: true,
  senior: true,
  student: true,
  disabled: true,
};

export const MEMBER_TYPE_DOC_LABEL: Record<MemberType, string> = {
  general: "",
  employee: "บัตรพนักงาน บขส.",
  official: "บัตรประจำตัวข้าราชการ/ทหาร",
  senior: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
  student: "บัตรนักเรียน/บัตรนักศึกษา",
  disabled: "บัตรประจำตัวคนพิการ",
};

export function isoToThai(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${day} ${months[month]} ${year + 543}`;
}

export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(expiryDate: string | undefined, reminderDays: number): boolean {
  if (!expiryDate) return false;
  const days = daysUntilExpiry(expiryDate);
  return days > 0 && days <= reminderDays;
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: "MEM-001",
    name: "นายทดสอบ ระบบ",
    email: "testuser@example.com",
    phone: "081-234-5678",
    memberType: "general",
    status: "approved",
    submittedAt: "2025-03-01",
    mockAuditLog: [
      { id: "AL-001", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 มี.ค. 2568, 09:00" },
    ],
  },
  {
    id: "MEM-002",
    name: "นางสาวสุภาพ ใจดี",
    email: "suphap@bks.co.th",
    phone: "082-345-6789",
    memberType: "employee",
    status: "approved",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2025-06-15",
    approvedAt: "2025-07-01",
    expiryDate: "2026-12-31",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-002", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "15 มิ.ย. 2568, 10:00" },
      { id: "AL-003", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "15 มิ.ย. 2568, 10:10" },
      { id: "AL-004", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "1 ก.ค. 2568, 09:30" },
    ],
  },
  {
    id: "MEM-003",
    name: "นายวีระ มั่นคง",
    email: "weera@bks.co.th",
    phone: "083-456-7890",
    memberType: "employee",
    status: "pending",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2026-07-10",
    mockAuditLog: [
      { id: "AL-005", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "10 ก.ค. 2569, 14:22" },
      { id: "AL-006", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "10 ก.ค. 2569, 14:25" },
    ],
  },
  {
    id: "MEM-004",
    name: "นางรัตนา สุขสม",
    email: "rattana@bks.co.th",
    phone: "084-567-8901",
    memberType: "employee",
    status: "rejected",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2026-05-20",
    rejectionReason: "ภาพบัตรพนักงานไม่ชัดเจน กรุณาถ่ายรูปใหม่และยื่นขอใหม่",
    mockAuditLog: [
      { id: "AL-007", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 พ.ค. 2569, 08:00" },
      { id: "AL-008", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "20 พ.ค. 2569, 08:05" },
      { id: "AL-009", adminName: "สมชาย วรรณา", action: "ไม่อนุมัติ", note: "ภาพบัตรพนักงานไม่ชัดเจน กรุณาถ่ายรูปใหม่", timestamp: "25 พ.ค. 2569, 14:15" },
    ],
  },
  {
    id: "MEM-005",
    name: "นายประสงค์ ดีงาม",
    email: "prasong@bks.co.th",
    phone: "085-678-9012",
    memberType: "employee",
    status: "approved",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2025-07-15",
    approvedAt: "2025-08-01",
    expiryDate: "2026-08-01",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-010", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "15 ก.ค. 2568, 11:00" },
      { id: "AL-011", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "15 ก.ค. 2568, 11:05" },
      { id: "AL-012", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "1 ส.ค. 2568, 10:00" },
    ],
  },
  {
    id: "MEM-006",
    name: "นางสาวปวีณา ชัยชนะ",
    email: "pawina@bks.co.th",
    phone: "086-789-0123",
    memberType: "employee",
    status: "expired",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2025-05-01",
    approvedAt: "2025-06-01",
    expiryDate: "2026-06-30",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-013", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 พ.ค. 2568, 09:00" },
      { id: "AL-014", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "1 พ.ค. 2568, 09:10" },
      { id: "AL-015", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 มิ.ย. 2568, 11:30" },
      { id: "AL-016", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "30 มิ.ย. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-007",
    name: "ร.ต.อ. สมชาย ปราบปราม",
    email: "somchai.p@police.go.th",
    phone: "087-890-1234",
    memberType: "official",
    status: "approved",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2025-03-10",
    approvedAt: "2025-03-20",
    expiryDate: "2027-03-31",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-017", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "10 มี.ค. 2568, 08:30" },
      { id: "AL-018", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "10 มี.ค. 2568, 08:35" },
      { id: "AL-019", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "20 มี.ค. 2568, 10:00" },
    ],
  },
  {
    id: "MEM-008",
    name: "นายกิตติพงษ์ ราชการ",
    email: "kittipong@moi.go.th",
    phone: "088-901-2345",
    memberType: "official",
    status: "approved",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2025-08-01",
    approvedAt: "2025-08-15",
    expiryDate: "2027-02-28",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-020", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ส.ค. 2568, 13:00" },
      { id: "AL-021", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 ส.ค. 2568, 13:10" },
      { id: "AL-022", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "15 ส.ค. 2568, 09:00" },
    ],
  },
  {
    id: "MEM-009",
    name: "นางสาวธัญญา สวัสดิ์",
    email: "thanya@army.mi.th",
    phone: "089-012-3456",
    memberType: "official",
    status: "pending",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2026-07-12",
    mockAuditLog: [
      { id: "AL-023", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "12 ก.ค. 2569, 15:00" },
      { id: "AL-024", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "12 ก.ค. 2569, 15:08" },
    ],
  },
  {
    id: "MEM-010",
    name: "นายอนุสรณ์ ภักดี",
    email: "anusorn@army.mi.th",
    phone: "090-123-4567",
    memberType: "official",
    status: "rejected",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2026-04-05",
    rejectionReason: "บัตรประจำตัวหมดอายุแล้ว กรุณายื่นเอกสารที่ยังมีอายุใช้งานได้",
    mockAuditLog: [
      { id: "AL-025", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "5 เม.ย. 2569, 11:00" },
      { id: "AL-026", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "5 เม.ย. 2569, 11:12" },
      { id: "AL-027", adminName: "สมชาย วรรณา", action: "ไม่อนุมัติ", note: "บัตรประจำตัวหมดอายุแล้ว กรุณายื่นเอกสารที่ยังมีอายุใช้งานได้", timestamp: "10 เม.ย. 2569, 10:45" },
    ],
  },
  {
    id: "MEM-011",
    name: "นายสิทธิพร ชนะ",
    email: "sitthiporn@bks.co.th",
    phone: "091-234-5678",
    memberType: "employee",
    status: "approved",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2025-07-20",
    approvedAt: "2025-08-01",
    expiryDate: "2026-08-10",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-028", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 ก.ค. 2568, 09:00" },
      { id: "AL-029", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "20 ก.ค. 2568, 09:05" },
      { id: "AL-030", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 ส.ค. 2568, 14:00" },
    ],
  },
  {
    id: "MEM-012",
    name: "นางอรพรรณ ศักดิ์ดี",
    email: "oraphan@mfa.go.th",
    phone: "092-345-6789",
    memberType: "official",
    status: "expired",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2025-06-01",
    approvedAt: "2025-07-01",
    expiryDate: "2026-07-01",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-031", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 มิ.ย. 2568, 10:00" },
      { id: "AL-032", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 มิ.ย. 2568, 10:10" },
      { id: "AL-033", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 ก.ค. 2568, 09:00" },
      { id: "AL-034", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "1 ก.ค. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-013",
    name: "นางสาวมณีรัตน์ ทองดี",
    email: "manirat@bks.co.th",
    phone: "093-456-7890",
    memberType: "employee",
    status: "pending",
    documentLabel: "บัตรพนักงาน บขส.",
    submittedAt: "2026-07-14",
    mockAuditLog: [
      { id: "AL-035", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "14 ก.ค. 2569, 08:00" },
      { id: "AL-036", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "14 ก.ค. 2569, 08:10" },
    ],
  },
  {
    id: "MEM-014",
    name: "พ.ต.ท. วิโรจน์ กล้าหาญ",
    email: "wiroj@police.go.th",
    phone: "094-567-8901",
    memberType: "official",
    status: "approved",
    documentLabel: "บัตรประจำตัวข้าราชการ/ทหาร",
    submittedAt: "2025-10-01",
    approvedAt: "2025-10-15",
    expiryDate: "2027-06-30",
    discountPercent: 50,
    mockAuditLog: [
      { id: "AL-037", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ต.ค. 2568, 14:00" },
      { id: "AL-038", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 ต.ค. 2568, 14:10" },
      { id: "AL-039", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "15 ต.ค. 2568, 11:00" },
    ],
  },
  {
    id: "MEM-015",
    name: "นายกมล สุขใจ",
    email: "kamol@gmail.com",
    phone: "095-678-9012",
    memberType: "general",
    status: "approved",
    submittedAt: "2026-01-20",
    mockAuditLog: [
      { id: "AL-040", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 ม.ค. 2569, 12:00" },
    ],
  },
  {
    id: "MEM-016",
    name: "นายสมศักดิ์ วัยชรา",
    email: "somsak@gmail.com",
    phone: "096-789-0123",
    memberType: "senior",
    status: "pending",
    documentLabel: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
    submittedAt: "2026-07-13",
    mockAuditLog: [
      { id: "AL-041", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "13 ก.ค. 2569, 10:00" },
      { id: "AL-042", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประชาชน", timestamp: "13 ก.ค. 2569, 10:08" },
    ],
  },
  {
    id: "MEM-017",
    name: "นางพิมพ์ใจ บุญมี",
    email: "pimjai@gmail.com",
    phone: "097-890-1234",
    memberType: "senior",
    status: "approved",
    documentLabel: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
    submittedAt: "2025-11-01",
    approvedAt: "2025-11-15",
    discountPercent: 30,
    mockAuditLog: [
      { id: "AL-043", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 พ.ย. 2568, 09:00" },
      { id: "AL-044", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประชาชน", timestamp: "1 พ.ย. 2568, 09:15" },
      { id: "AL-045", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "ยืนยันอายุ 60 ปีขึ้นไป สิทธิ์ไม่มีวันหมดอายุ ส่วนลด 30%", timestamp: "15 พ.ย. 2568, 14:00" },
    ],
  },
  {
    id: "MEM-018",
    name: "นายอภิชาติ เรียนดี",
    email: "apichat@uni.ac.th",
    phone: "098-901-2345",
    memberType: "student",
    status: "pending",
    documentLabel: "บัตรนักเรียน/บัตรนักศึกษา",
    submittedAt: "2026-07-11",
    mockAuditLog: [
      { id: "AL-046", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "11 ก.ค. 2569, 16:00" },
      { id: "AL-047", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรนักศึกษา", timestamp: "11 ก.ค. 2569, 16:10" },
    ],
  },
  {
    id: "MEM-019",
    name: "นางสาวกนกวรรณ ศึกษาดี",
    email: "kanok@school.ac.th",
    phone: "099-012-3456",
    memberType: "student",
    status: "expired",
    documentLabel: "บัตรนักเรียน/บัตรนักศึกษา",
    submittedAt: "2025-09-01",
    approvedAt: "2025-09-10",
    expiryDate: "2026-05-31",
    discountPercent: 30,
    mockAuditLog: [
      { id: "AL-048", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ก.ย. 2568, 11:00" },
      { id: "AL-049", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรนักศึกษา", timestamp: "1 ก.ย. 2568, 11:10" },
      { id: "AL-050", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง หมดอายุสิ้นปีการศึกษา", timestamp: "10 ก.ย. 2568, 09:00" },
      { id: "AL-051", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "31 พ.ค. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-020",
    name: "นายธนพล ใจแข็ง",
    email: "thanaphon@gmail.com",
    phone: "090-123-4568",
    memberType: "disabled",
    status: "pending",
    documentLabel: "บัตรประจำตัวคนพิการ",
    submittedAt: "2026-07-08",
    mockAuditLog: [
      { id: "AL-052", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "8 ก.ค. 2569, 13:00" },
      { id: "AL-053", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประจำตัวคนพิการ", timestamp: "8 ก.ค. 2569, 13:15" },
    ],
  },
  {
    id: "MEM-021",
    name: "นางประนอม มีชัย",
    email: "pranom@gmail.com",
    phone: "091-234-5679",
    memberType: "disabled",
    status: "approved",
    documentLabel: "บัตรประจำตัวคนพิการ",
    submittedAt: "2025-12-01",
    approvedAt: "2025-12-10",
    expiryDate: "2027-03-31",
    discountPercent: 40,
    mockAuditLog: [
      { id: "AL-054", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ธ.ค. 2568, 10:00" },
      { id: "AL-055", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประจำตัวคนพิการ", timestamp: "1 ธ.ค. 2568, 10:10" },
      { id: "AL-056", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน ส่วนลด 40%", timestamp: "10 ธ.ค. 2568, 11:00" },
    ],
  },
];
