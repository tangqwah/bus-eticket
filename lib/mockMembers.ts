// ---- Types ----------------------------------------------------------------

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/** Backward-compat aliases */
export type MemberStatus = ApprovalStatus;
export type MemberType = string;

export type PersonType = {
  code: string;
  name_th: string;
  requires_document: boolean;
  has_expiry: boolean;
  default_discount: number;
  color_cls: string;
  doc_label: string;
};

export type AuditEntry = {
  id: string;
  adminName: string;
  action: string;
  note?: string;
  timestamp: string;
};

export type Member = {
  id: string;
  member_no?: string;
  // Name
  title: string;
  first_name: string;
  last_name: string;
  name: string; // = `${title} ${first_name} ${last_name}`
  gender: "male" | "female" | "other";
  birth_date?: string;
  nationality: string;
  id_card?: string;
  passport_no?: string;
  // Contact
  tel_no: string;
  email: string;
  // Address
  address?: string;
  sub_district?: string;
  district?: string;
  province?: string;
  post_code?: string;
  // Membership
  person_type_code: string;
  document_label?: string;
  register_date: string;
  submittedAt: string; // alias for register_date
  approval_status: ApprovalStatus;
  status: AccountStatus;
  approved_at?: string;
  expiry_date?: string;
  discount_percent?: number;
  rejection_reason?: string;
  remark?: string;
  mockAuditLog: AuditEntry[];
};

// ---- Person type lookup ---------------------------------------------------

export const PERSON_TYPES: PersonType[] = [
  {
    code: "general",
    name_th: "ผู้ใช้ทั่วไป",
    requires_document: false,
    has_expiry: false,
    default_discount: 0,
    color_cls: "bg-[#f3f4f6] text-[#667085]",
    doc_label: "",
  },
  {
    code: "employee",
    name_th: "พนักงาน บขส.",
    requires_document: true,
    has_expiry: true,
    default_discount: 50,
    color_cls: "bg-[#f0f2ff] text-[#171b82]",
    doc_label: "บัตรพนักงาน บขส.",
  },
  {
    code: "official",
    name_th: "ข้าราชการ/ทหาร",
    requires_document: true,
    has_expiry: true,
    default_discount: 50,
    color_cls: "bg-[#f5f3ff] text-[#6d28d9]",
    doc_label: "บัตรประจำตัวข้าราชการ/ทหาร",
  },
  {
    code: "senior",
    name_th: "ผู้สูงอายุ",
    requires_document: true,
    has_expiry: false,
    default_discount: 30,
    color_cls: "bg-[#fffbeb] text-[#b45309]",
    doc_label: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
  },
  {
    code: "student",
    name_th: "เด็กนักเรียน/นักศึกษา",
    requires_document: true,
    has_expiry: true,
    default_discount: 30,
    color_cls: "bg-[#f0fdfa] text-[#0f766e]",
    doc_label: "บัตรนักเรียน/บัตรนักศึกษา",
  },
  {
    code: "disabled",
    name_th: "ผู้พิการ",
    requires_document: true,
    has_expiry: true,
    default_discount: 40,
    color_cls: "bg-[#fff1f2] text-[#9f1239]",
    doc_label: "บัตรประจำตัวคนพิการ",
  },
];

export function getPersonType(code: string): PersonType | undefined {
  return PERSON_TYPES.find(p => p.code === code);
}

// ---- Backward-compat map exports -----------------------------------------

export const MEMBER_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PERSON_TYPES.map(p => [p.code, p.name_th])
);
export const MEMBER_TYPE_COLORS: Record<string, string> = Object.fromEntries(
  PERSON_TYPES.map(p => [p.code, p.color_cls])
);
export const MEMBER_TYPE_NEEDS_DOC: Record<string, boolean> = Object.fromEntries(
  PERSON_TYPES.map(p => [p.code, p.requires_document])
);
export const MEMBER_TYPE_HAS_EXPIRY: Record<string, boolean> = Object.fromEntries(
  PERSON_TYPES.map(p => [p.code, p.has_expiry])
);
export const MEMBER_TYPE_DOC_LABEL: Record<string, string> = Object.fromEntries(
  PERSON_TYPES.map(p => [p.code, p.doc_label])
);

// ---- Status labels / colors ----------------------------------------------

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
  expired: "หมดอายุ",
};

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "bg-[#fef9c3] text-[#b45309]",
  approved: "bg-[#d1fae5] text-[#059669]",
  rejected: "bg-[#fee2e2] text-[#dc2626]",
  expired: "bg-[#f3f4f6] text-[#9ca3af]",
};

/** Backward-compat aliases */
export const MEMBER_STATUS_LABELS = APPROVAL_STATUS_LABELS as Record<string, string>;
export const MEMBER_STATUS_COLORS = APPROVAL_STATUS_COLORS as Record<string, string>;

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: "ใช้งานได้",
  INACTIVE: "ปิดใช้งาน",
  SUSPENDED: "ระงับ",
};

export const ACCOUNT_STATUS_COLORS: Record<AccountStatus, string> = {
  ACTIVE: "bg-[#d1fae5] text-[#059669]",
  INACTIVE: "bg-[#f3f4f6] text-[#9ca3af]",
  SUSPENDED: "bg-[#fee2e2] text-[#dc2626]",
};

// ---- Validators ----------------------------------------------------------

export function validateThaiId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  const d = id.split("").map(Number);
  const sum = d.slice(0, 12).reduce((acc, digit, i) => acc + digit * (13 - i), 0);
  return d[12] === (11 - (sum % 11)) % 10;
}

// ---- Member number generation --------------------------------------------

export function generateMemberNo(approvalDateIso: string): string {
  const year = new Date(approvalDateIso).getFullYear() + 543;
  const prefix = String(year).slice(-2);
  const raw = typeof window !== "undefined" ? localStorage.getItem("bks_member_no_seq") : null;
  const seq: Record<string, number> = raw ? JSON.parse(raw) : {};
  const next = (seq[prefix] ?? 0) + 1;
  seq[prefix] = next;
  if (typeof window !== "undefined") localStorage.setItem("bks_member_no_seq", JSON.stringify(seq));
  return `${prefix}-${String(next).padStart(6, "0")}`;
}

// ---- Date helpers --------------------------------------------------------

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

// ---- Mock data -----------------------------------------------------------

export const MOCK_MEMBERS: Member[] = [
  {
    id: "MEM-001",
    member_no: "68-000001",
    title: "นาย", first_name: "ทดสอบ", last_name: "ระบบ",
    name: "นายทดสอบ ระบบ",
    gender: "male",
    birth_date: "1985-06-15",
    nationality: "ไทย",
    id_card: "1100000000016",
    tel_no: "081-234-5678",
    email: "testuser@example.com",
    address: "123/4 ถนนพหลโยธิน",
    sub_district: "ดอนเมือง",
    district: "ดอนเมือง",
    province: "กรุงเทพมหานคร",
    post_code: "10210",
    person_type_code: "general",
    register_date: "2025-03-01",
    submittedAt: "2025-03-01",
    approval_status: "approved",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-001", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 มี.ค. 2568, 09:00" },
    ],
  },
  {
    id: "MEM-002",
    member_no: "68-000004",
    title: "นางสาว", first_name: "สุภาพ", last_name: "ใจดี",
    name: "นางสาวสุภาพ ใจดี",
    gender: "female",
    birth_date: "1990-02-28",
    nationality: "ไทย",
    id_card: "1200000000015",
    tel_no: "082-345-6789",
    email: "suphap@bks.co.th",
    address: "56 ซอยลาดพร้าว 80",
    sub_district: "คลองกุ่ม",
    district: "บึงกุ่ม",
    province: "กรุงเทพมหานคร",
    post_code: "10230",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2025-06-15",
    submittedAt: "2025-06-15",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-07-01",
    expiry_date: "2026-12-31",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-002", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "15 มิ.ย. 2568, 10:00" },
      { id: "AL-003", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "15 มิ.ย. 2568, 10:10" },
      { id: "AL-004", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "1 ก.ค. 2568, 09:30" },
    ],
  },
  {
    id: "MEM-003",
    title: "นาย", first_name: "วีระ", last_name: "มั่นคง",
    name: "นายวีระ มั่นคง",
    gender: "male",
    birth_date: "1988-09-10",
    nationality: "ไทย",
    id_card: "1300000000014",
    tel_no: "083-456-7890",
    email: "weera@bks.co.th",
    address: "22 ถนนรัชดาภิเษก",
    sub_district: "สีกัน",
    district: "ดอนเมือง",
    province: "กรุงเทพมหานคร",
    post_code: "10210",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2026-07-10",
    submittedAt: "2026-07-10",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-005", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "10 ก.ค. 2569, 14:22" },
      { id: "AL-006", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "10 ก.ค. 2569, 14:25" },
    ],
  },
  {
    id: "MEM-004",
    title: "นาง", first_name: "รัตนา", last_name: "สุขสม",
    name: "นางรัตนา สุขสม",
    gender: "female",
    birth_date: "1982-04-05",
    nationality: "ไทย",
    id_card: "1400000000013",
    tel_no: "084-567-8901",
    email: "rattana@bks.co.th",
    address: "7/1 ซอยสุขุมวิท 22",
    sub_district: "บางจาก",
    district: "พระโขนง",
    province: "กรุงเทพมหานคร",
    post_code: "10260",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2026-05-20",
    submittedAt: "2026-05-20",
    approval_status: "rejected",
    status: "ACTIVE",
    rejection_reason: "ภาพบัตรพนักงานไม่ชัดเจน กรุณาถ่ายรูปใหม่และยื่นขอใหม่",
    mockAuditLog: [
      { id: "AL-007", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 พ.ค. 2569, 08:00" },
      { id: "AL-008", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "20 พ.ค. 2569, 08:05" },
      { id: "AL-009", adminName: "สมชาย วรรณา", action: "ไม่อนุมัติ", note: "ภาพบัตรพนักงานไม่ชัดเจน กรุณาถ่ายรูปใหม่", timestamp: "25 พ.ค. 2569, 14:15" },
    ],
  },
  {
    id: "MEM-005",
    member_no: "68-000006",
    title: "นาย", first_name: "ประสงค์", last_name: "ดีงาม",
    name: "นายประสงค์ ดีงาม",
    gender: "male",
    birth_date: "1979-11-20",
    nationality: "ไทย",
    id_card: "1500000000012",
    tel_no: "085-678-9012",
    email: "prasong@bks.co.th",
    address: "34 ถนนวิภาวดีรังสิต",
    sub_district: "สนามบิน",
    district: "ดอนเมือง",
    province: "กรุงเทพมหานคร",
    post_code: "10210",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2025-07-15",
    submittedAt: "2025-07-15",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-08-01",
    expiry_date: "2026-08-01",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-010", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "15 ก.ค. 2568, 11:00" },
      { id: "AL-011", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "15 ก.ค. 2568, 11:05" },
      { id: "AL-012", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "1 ส.ค. 2568, 10:00" },
    ],
  },
  {
    id: "MEM-006",
    member_no: "68-000003",
    title: "นางสาว", first_name: "ปวีณา", last_name: "ชัยชนะ",
    name: "นางสาวปวีณา ชัยชนะ",
    gender: "female",
    birth_date: "1993-07-14",
    nationality: "ไทย",
    id_card: "2100000000014",
    tel_no: "086-789-0123",
    email: "pawina@bks.co.th",
    address: "18 ถนนบางนา-ตราด",
    sub_district: "บางจาก",
    district: "พระโขนง",
    province: "กรุงเทพมหานคร",
    post_code: "10260",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2025-05-01",
    submittedAt: "2025-05-01",
    approval_status: "expired",
    status: "INACTIVE",
    approved_at: "2025-06-01",
    expiry_date: "2026-06-30",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-013", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 พ.ค. 2568, 09:00" },
      { id: "AL-014", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "1 พ.ค. 2568, 09:10" },
      { id: "AL-015", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 มิ.ย. 2568, 11:30" },
      { id: "AL-016", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "30 มิ.ย. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-007",
    member_no: "68-000002",
    title: "ร.ต.อ.", first_name: "สมชาย", last_name: "ปราบปราม",
    name: "ร.ต.อ. สมชาย ปราบปราม",
    gender: "male",
    birth_date: "1975-03-08",
    nationality: "ไทย",
    id_card: "2200000000013",
    tel_no: "087-890-1234",
    email: "somchai.p@police.go.th",
    address: "101 ซอยพระยาพิเรน",
    sub_district: "ในเมือง",
    district: "เมืองนครราชสีมา",
    province: "นครราชสีมา",
    post_code: "30000",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2025-03-10",
    submittedAt: "2025-03-10",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-03-20",
    expiry_date: "2027-03-31",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-017", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "10 มี.ค. 2568, 08:30" },
      { id: "AL-018", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "10 มี.ค. 2568, 08:35" },
      { id: "AL-019", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน", timestamp: "20 มี.ค. 2568, 10:00" },
    ],
  },
  {
    id: "MEM-008",
    member_no: "68-000008",
    title: "นาย", first_name: "กิตติพงษ์", last_name: "ราชการ",
    name: "นายกิตติพงษ์ ราชการ",
    gender: "male",
    birth_date: "1972-12-01",
    nationality: "ไทย",
    id_card: "3100000000012",
    tel_no: "088-901-2345",
    email: "kittipong@moi.go.th",
    address: "5 ถนนเพชรบุรี",
    sub_district: "บ่อยาง",
    district: "เมืองสงขลา",
    province: "สงขลา",
    post_code: "90000",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2025-08-01",
    submittedAt: "2025-08-01",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-08-15",
    expiry_date: "2027-02-28",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-020", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ส.ค. 2568, 13:00" },
      { id: "AL-021", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 ส.ค. 2568, 13:10" },
      { id: "AL-022", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "15 ส.ค. 2568, 09:00" },
    ],
  },
  {
    id: "MEM-009",
    title: "นางสาว", first_name: "ธัญญา", last_name: "สวัสดิ์",
    name: "นางสาวธัญญา สวัสดิ์",
    gender: "female",
    birth_date: "1991-05-25",
    nationality: "ไทย",
    id_card: "3200000000011",
    tel_no: "089-012-3456",
    email: "thanya@army.mi.th",
    address: "99 ค่ายทหาร ถนนพระราม 5",
    sub_district: "ในเมือง",
    district: "เมืองขอนแก่น",
    province: "ขอนแก่น",
    post_code: "40000",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2026-07-12",
    submittedAt: "2026-07-12",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-023", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "12 ก.ค. 2569, 15:00" },
      { id: "AL-024", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "12 ก.ค. 2569, 15:08" },
    ],
  },
  {
    id: "MEM-010",
    title: "นาย", first_name: "อนุสรณ์", last_name: "ภักดี",
    name: "นายอนุสรณ์ ภักดี",
    gender: "male",
    birth_date: "1978-08-30",
    nationality: "ไทย",
    id_card: "4100000000011",
    tel_no: "090-123-4567",
    email: "anusorn@army.mi.th",
    address: "200 ถนนราชดำเนิน",
    sub_district: "สาวะถี",
    district: "เมืองขอนแก่น",
    province: "ขอนแก่น",
    post_code: "40000",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2026-04-05",
    submittedAt: "2026-04-05",
    approval_status: "rejected",
    status: "ACTIVE",
    rejection_reason: "บัตรประจำตัวหมดอายุแล้ว กรุณายื่นเอกสารที่ยังมีอายุใช้งานได้",
    mockAuditLog: [
      { id: "AL-025", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "5 เม.ย. 2569, 11:00" },
      { id: "AL-026", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "5 เม.ย. 2569, 11:12" },
      { id: "AL-027", adminName: "สมชาย วรรณา", action: "ไม่อนุมัติ", note: "บัตรประจำตัวหมดอายุแล้ว กรุณายื่นเอกสารที่ยังมีอายุใช้งานได้", timestamp: "10 เม.ย. 2569, 10:45" },
    ],
  },
  {
    id: "MEM-011",
    member_no: "68-000007",
    title: "นาย", first_name: "สิทธิพร", last_name: "ชนะ",
    name: "นายสิทธิพร ชนะ",
    gender: "male",
    birth_date: "1986-01-17",
    nationality: "ไทย",
    id_card: "5100000000019",
    tel_no: "091-234-5678",
    email: "sitthiporn@bks.co.th",
    address: "44 ถนนเจริญนคร",
    sub_district: "คลองสาม",
    district: "ลาดกระบัง",
    province: "กรุงเทพมหานคร",
    post_code: "10520",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2025-07-20",
    submittedAt: "2025-07-20",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-08-01",
    expiry_date: "2026-08-10",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-028", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 ก.ค. 2568, 09:00" },
      { id: "AL-029", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "20 ก.ค. 2568, 09:05" },
      { id: "AL-030", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 ส.ค. 2568, 14:00" },
    ],
  },
  {
    id: "MEM-012",
    member_no: "68-000005",
    title: "นาง", first_name: "อรพรรณ", last_name: "ศักดิ์ดี",
    name: "นางอรพรรณ ศักดิ์ดี",
    gender: "female",
    birth_date: "1970-10-22",
    nationality: "ไทย",
    id_card: "5200000000018",
    tel_no: "092-345-6789",
    email: "oraphan@mfa.go.th",
    address: "88 ถนนสีลม",
    sub_district: "ตลาดใหญ่",
    district: "เมืองภูเก็ต",
    province: "ภูเก็ต",
    post_code: "83000",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2025-06-01",
    submittedAt: "2025-06-01",
    approval_status: "expired",
    status: "INACTIVE",
    approved_at: "2025-07-01",
    expiry_date: "2026-07-01",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-031", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 มิ.ย. 2568, 10:00" },
      { id: "AL-032", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 มิ.ย. 2568, 10:10" },
      { id: "AL-033", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "1 ก.ค. 2568, 09:00" },
      { id: "AL-034", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "1 ก.ค. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-013",
    title: "นางสาว", first_name: "มณีรัตน์", last_name: "ทองดี",
    name: "นางสาวมณีรัตน์ ทองดี",
    gender: "female",
    birth_date: "1995-03-12",
    nationality: "ไทย",
    id_card: "5300000000017",
    tel_no: "093-456-7890",
    email: "manirat@bks.co.th",
    address: "15 ซอยงามวงศ์วาน",
    sub_district: "นวมินทร์",
    district: "บึงกุ่ม",
    province: "กรุงเทพมหานคร",
    post_code: "10230",
    person_type_code: "employee",
    document_label: "บัตรพนักงาน บขส.",
    register_date: "2026-07-14",
    submittedAt: "2026-07-14",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-035", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "14 ก.ค. 2569, 08:00" },
      { id: "AL-036", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรพนักงาน", timestamp: "14 ก.ค. 2569, 08:10" },
    ],
  },
  {
    id: "MEM-014",
    member_no: "68-000010",
    title: "พ.ต.ท.", first_name: "วิโรจน์", last_name: "กล้าหาญ",
    name: "พ.ต.ท. วิโรจน์ กล้าหาญ",
    gender: "male",
    birth_date: "1973-06-07",
    nationality: "ไทย",
    id_card: "6100000000017",
    tel_no: "094-567-8901",
    email: "wiroj@police.go.th",
    address: "333 ถนนเยาวราช",
    sub_district: "ศรีภูมิ",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    post_code: "50200",
    person_type_code: "official",
    document_label: "บัตรประจำตัวข้าราชการ/ทหาร",
    register_date: "2025-10-01",
    submittedAt: "2025-10-01",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-10-15",
    expiry_date: "2027-06-30",
    discount_percent: 50,
    mockAuditLog: [
      { id: "AL-037", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ต.ค. 2568, 14:00" },
      { id: "AL-038", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรข้าราชการ", timestamp: "1 ต.ค. 2568, 14:10" },
      { id: "AL-039", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง", timestamp: "15 ต.ค. 2568, 11:00" },
    ],
  },
  {
    id: "MEM-015",
    member_no: "69-000001",
    title: "นาย", first_name: "กมล", last_name: "สุขใจ",
    name: "นายกมล สุขใจ",
    gender: "male",
    birth_date: "1983-11-30",
    nationality: "ไทย",
    id_card: "6200000000016",
    tel_no: "095-678-9012",
    email: "kamol@gmail.com",
    address: "62 ถนนอนุสาวรีย์",
    sub_district: "สันทรายหลวง",
    district: "สันทราย",
    province: "เชียงใหม่",
    post_code: "50210",
    person_type_code: "general",
    register_date: "2026-01-20",
    submittedAt: "2026-01-20",
    approval_status: "approved",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-040", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "20 ม.ค. 2569, 12:00" },
    ],
  },
  {
    id: "MEM-016",
    title: "นาย", first_name: "สมศักดิ์", last_name: "วัยชรา",
    name: "นายสมศักดิ์ วัยชรา",
    gender: "male",
    birth_date: "1960-04-18",
    nationality: "ไทย",
    id_card: "7100000000015",
    tel_no: "096-789-0123",
    email: "somsak@gmail.com",
    address: "45 ซอยสุขุมวิท 71",
    sub_district: "คลองกุ่ม",
    district: "บึงกุ่ม",
    province: "กรุงเทพมหานคร",
    post_code: "10230",
    person_type_code: "senior",
    document_label: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
    register_date: "2026-07-13",
    submittedAt: "2026-07-13",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-041", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "13 ก.ค. 2569, 10:00" },
      { id: "AL-042", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประชาชน", timestamp: "13 ก.ค. 2569, 10:08" },
    ],
  },
  {
    id: "MEM-017",
    member_no: "68-000011",
    title: "นาง", first_name: "พิมพ์ใจ", last_name: "บุญมี",
    name: "นางพิมพ์ใจ บุญมี",
    gender: "female",
    birth_date: "1955-08-22",
    nationality: "ไทย",
    id_card: "8100000000013",
    tel_no: "097-890-1234",
    email: "pimjai@gmail.com",
    address: "10 ถนนเจริญกรุง",
    sub_district: "หายยา",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    post_code: "50100",
    person_type_code: "senior",
    document_label: "บัตรประชาชน (ยืนยันอายุ 60 ปีขึ้นไป)",
    register_date: "2025-11-01",
    submittedAt: "2025-11-01",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-11-15",
    discount_percent: 30,
    mockAuditLog: [
      { id: "AL-043", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 พ.ย. 2568, 09:00" },
      { id: "AL-044", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประชาชน", timestamp: "1 พ.ย. 2568, 09:15" },
      { id: "AL-045", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "ยืนยันอายุ 60 ปีขึ้นไป สิทธิ์ไม่มีวันหมดอายุ ส่วนลด 30%", timestamp: "15 พ.ย. 2568, 14:00" },
    ],
  },
  {
    id: "MEM-018",
    title: "นาย", first_name: "อภิชาติ", last_name: "เรียนดี",
    name: "นายอภิชาติ เรียนดี",
    gender: "male",
    birth_date: "2002-05-10",
    nationality: "ไทย",
    id_card: "1600000000011",
    tel_no: "098-901-2345",
    email: "apichat@uni.ac.th",
    address: "77 ซอยลาดพร้าว 101",
    sub_district: "สาวะถี",
    district: "เมืองขอนแก่น",
    province: "ขอนแก่น",
    post_code: "40000",
    person_type_code: "student",
    document_label: "บัตรนักเรียน/บัตรนักศึกษา",
    register_date: "2026-07-11",
    submittedAt: "2026-07-11",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-046", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "11 ก.ค. 2569, 16:00" },
      { id: "AL-047", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรนักศึกษา", timestamp: "11 ก.ค. 2569, 16:10" },
    ],
  },
  {
    id: "MEM-019",
    member_no: "68-000009",
    title: "นางสาว", first_name: "กนกวรรณ", last_name: "ศึกษาดี",
    name: "นางสาวกนกวรรณ ศึกษาดี",
    gender: "female",
    birth_date: "2003-09-01",
    nationality: "ไทย",
    id_card: "1700000000011",
    tel_no: "099-012-3456",
    email: "kanok@school.ac.th",
    address: "30 ถนนเทพกระษัตรี",
    sub_district: "เทพกระษัตรี",
    district: "ถลาง",
    province: "ภูเก็ต",
    post_code: "83110",
    person_type_code: "student",
    document_label: "บัตรนักเรียน/บัตรนักศึกษา",
    register_date: "2025-09-01",
    submittedAt: "2025-09-01",
    approval_status: "expired",
    status: "INACTIVE",
    approved_at: "2025-09-10",
    expiry_date: "2026-05-31",
    discount_percent: 30,
    mockAuditLog: [
      { id: "AL-048", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ก.ย. 2568, 11:00" },
      { id: "AL-049", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรนักศึกษา", timestamp: "1 ก.ย. 2568, 11:10" },
      { id: "AL-050", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้อง หมดอายุสิ้นปีการศึกษา", timestamp: "10 ก.ย. 2568, 09:00" },
      { id: "AL-051", adminName: "ระบบ", action: "หมดอายุ", note: "สิทธิ์สมาชิกหมดอายุอัตโนมัติ", timestamp: "31 พ.ค. 2569, 23:59" },
    ],
  },
  {
    id: "MEM-020",
    title: "นาย", first_name: "ธนพล", last_name: "ใจแข็ง",
    name: "นายธนพล ใจแข็ง",
    gender: "male",
    birth_date: "1987-02-14",
    nationality: "ไทย",
    id_card: "2300000000012",
    tel_no: "090-123-4568",
    email: "thanaphon@gmail.com",
    address: "9 ถนนนิมมานเหมินทร์",
    sub_district: "ช้างเผือก",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    post_code: "50300",
    person_type_code: "disabled",
    document_label: "บัตรประจำตัวคนพิการ",
    register_date: "2026-07-08",
    submittedAt: "2026-07-08",
    approval_status: "pending",
    status: "ACTIVE",
    mockAuditLog: [
      { id: "AL-052", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "8 ก.ค. 2569, 13:00" },
      { id: "AL-053", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประจำตัวคนพิการ", timestamp: "8 ก.ค. 2569, 13:15" },
    ],
  },
  {
    id: "MEM-021",
    member_no: "68-000012",
    title: "นาง", first_name: "ประนอม", last_name: "มีชัย",
    name: "นางประนอม มีชัย",
    gender: "female",
    birth_date: "1969-07-03",
    nationality: "ไทย",
    id_card: "2400000000011",
    tel_no: "091-234-5679",
    email: "pranom@gmail.com",
    address: "55 ถนนกาญจนาภิเษก",
    sub_district: "คลองสาม",
    district: "ลาดกระบัง",
    province: "กรุงเทพมหานคร",
    post_code: "10520",
    person_type_code: "disabled",
    document_label: "บัตรประจำตัวคนพิการ",
    register_date: "2025-12-01",
    submittedAt: "2025-12-01",
    approval_status: "approved",
    status: "ACTIVE",
    approved_at: "2025-12-10",
    expiry_date: "2027-03-31",
    discount_percent: 40,
    mockAuditLog: [
      { id: "AL-054", adminName: "ระบบ", action: "ลงทะเบียน", timestamp: "1 ธ.ค. 2568, 10:00" },
      { id: "AL-055", adminName: "ระบบ", action: "ส่งเอกสาร", note: "อัปโหลดบัตรประจำตัวคนพิการ", timestamp: "1 ธ.ค. 2568, 10:10" },
      { id: "AL-056", adminName: "สมชาย วรรณา", action: "อนุมัติ", note: "เอกสารถูกต้องครบถ้วน ส่วนลด 40%", timestamp: "10 ธ.ค. 2568, 11:00" },
    ],
  },
];
