"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MOCK_MEMBERS,
  MEMBER_TYPE_LABELS,
  MEMBER_TYPE_COLORS,
  MEMBER_TYPE_NEEDS_DOC,
  MEMBER_TYPE_HAS_EXPIRY,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_COLORS,
  ACCOUNT_STATUS_LABELS,
  ACCOUNT_STATUS_COLORS,
  PERSON_TYPES,
  isoToThai,
  isExpiringSoon,
  daysUntilExpiry,
  generateMemberNo,
  type Member,
  type ApprovalStatus,
  type AccountStatus,
  type AuditEntry,
} from "@/lib/mockMembers";

type StoredAuditEntry = AuditEntry & { memberId: string };

function oneYearFromNow(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

type DocStyle = {
  headerBg: string;
  orgName: string;
  cardType: string;
  avatarBg: string;
  avatarStroke: string;
};

const DOC_STYLES: Record<string, DocStyle> = {
  employee: {
    headerBg: "#171b82",
    orgName: "TRANSPORT CO., LTD.",
    cardType: "Employee Identification Card",
    avatarBg: "#e0e3ff",
    avatarStroke: "#171b82",
  },
  official: {
    headerBg: "#6d28d9",
    orgName: "GOVERNMENT OFFICIAL",
    cardType: "Official Identification Card",
    avatarBg: "#ede9fe",
    avatarStroke: "#6d28d9",
  },
  senior: {
    headerBg: "#b45309",
    orgName: "NATIONAL ID VERIFICATION",
    cardType: "Senior Citizen (Age 60+)",
    avatarBg: "#fef3c7",
    avatarStroke: "#b45309",
  },
  student: {
    headerBg: "#0f766e",
    orgName: "STUDENT IDENTIFICATION",
    cardType: "Student / Academic Card",
    avatarBg: "#ccfbf1",
    avatarStroke: "#0f766e",
  },
  disabled: {
    headerBg: "#9f1239",
    orgName: "DISABILITY SERVICES",
    cardType: "Persons with Disabilities",
    avatarBg: "#ffe4e6",
    avatarStroke: "#9f1239",
  },
};

function DocPlaceholder({ personTypeCode, memberName }: { personTypeCode: string; memberName: string }) {
  const style = DOC_STYLES[personTypeCode];
  if (!style) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-[#e5e7eb] shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: style.headerBg }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="text-white text-[13px] font-semibold tracking-wide">{style.orgName}</span>
        </div>
        <span className="text-white/60 text-[11px] font-medium">บขส.</span>
      </div>
      <div className="bg-[#f8f9fb] p-5">
        <div className="flex gap-4">
          <div className="w-16 h-20 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: style.avatarBg }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={style.avatarStroke} strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">{style.cardType}</div>
            <div className="text-[15px] font-semibold text-[#101828] leading-tight">{memberName}</div>
            <div className="text-[12px] text-[#667085] mt-0.5 font-mono">ID: BKS-XXXX-XXXX</div>
            <div className="mt-2 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0d5dd] shrink-0" />
                <div className="h-2 bg-[#e5e7eb] rounded-full flex-1" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0d5dd] shrink-0" />
                <div className="h-2 bg-[#e5e7eb] rounded-full w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#e5e7eb] flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">ตัวอย่างเอกสารที่อัปโหลด</span>
          <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: style.headerBg }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ยืนยันการอัปโหลด
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[15px] font-medium text-[#344054] ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-[#9ca3af]">—</span>}
      </div>
    </div>
  );
}

const GENDER_LABELS: Record<string, string> = { male: "ชาย", female: "หญิง", other: "อื่น ๆ" };
const ALL_APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected", "expired"];
const ALL_ACCOUNT_STATUSES: AccountStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [reminderDays, setReminderDays] = useState(30);
  const [adminName, setAdminName] = useState("แอดมิน");
  const [adminRole, setAdminRole] = useState("");
  const [defaultDiscount, setDefaultDiscount] = useState(0);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveExpiryDate, setApproveExpiryDate] = useState(oneYearFromNow());
  const [approveDiscount, setApproveDiscount] = useState(0);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  // Super-admin edit state
  const [editMode, setEditMode] = useState(false);
  const [editPersonType, setEditPersonType] = useState("general");
  const [editApprovalStatus, setEditApprovalStatus] = useState<ApprovalStatus>("pending");
  const [editAccountStatus, setEditAccountStatus] = useState<AccountStatus>("ACTIVE");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editDiscount, setEditDiscount] = useState(0);
  const [editRemark, setEditRemark] = useState("");

  useEffect(() => {
    const base = MOCK_MEMBERS.find(m => m.id === id);
    if (!base) { router.push("/backoffice/members"); return; }

    const overridesRaw = localStorage.getItem("bks_member_overrides");
    const overrides: Record<string, Partial<Member>> = overridesRaw ? JSON.parse(overridesRaw) : {};
    const merged = { ...base, ...(overrides[id] ?? {}) };
    setMember(merged);

    setEditPersonType(merged.person_type_code);
    setEditApprovalStatus(merged.approval_status);
    setEditAccountStatus(merged.status);
    setEditExpiryDate(merged.expiry_date ?? "");
    setEditDiscount(merged.discount_percent ?? 0);
    setEditRemark(merged.remark ?? "");

    const logRaw = localStorage.getItem("bks_audit_log");
    const stored: StoredAuditEntry[] = logRaw ? JSON.parse(logRaw) : [];
    const memberEntries = stored.filter(e => e.memberId === id).map(({ memberId: _, ...e }) => e);
    setAuditLog([...base.mockAuditLog, ...memberEntries]);

    const settingsRaw = localStorage.getItem("bks_discount_settings");
    const discountDefaults: Record<string, number> = {
      employee: 50, official: 50, senior: 30, student: 30, disabled: 40,
    };
    if (settingsRaw) {
      const s = JSON.parse(settingsRaw);
      setReminderDays(s.renewalReminderDays ?? 30);
      const byType: Record<string, number> = {
        employee: s.employeeDiscount ?? 50,
        official: s.officialDiscount ?? 50,
        senior: s.seniorDiscount ?? 30,
        student: s.studentDiscount ?? 30,
        disabled: s.disabledDiscount ?? 40,
      };
      const disc = byType[base.person_type_code] ?? 0;
      setDefaultDiscount(disc);
      setApproveDiscount(disc);
    } else {
      const disc = discountDefaults[base.person_type_code] ?? 0;
      setDefaultDiscount(disc);
      setApproveDiscount(disc);
    }

    const adminRaw = localStorage.getItem("bks_admin");
    if (adminRaw) {
      const admin = JSON.parse(adminRaw);
      setAdminName(admin.name ?? "แอดมิน");
      setAdminRole(admin.role ?? "");
    }
  }, [id]);

  const addAuditEntry = (action: string, note?: string) => {
    const logRaw = localStorage.getItem("bks_audit_log");
    const log: StoredAuditEntry[] = logRaw ? JSON.parse(logRaw) : [];
    const now = new Date();
    const entry: StoredAuditEntry = {
      id: `AL-LS-${Date.now()}`,
      memberId: id,
      adminName,
      action,
      note,
      timestamp: now.toLocaleString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    log.push(entry);
    localStorage.setItem("bks_audit_log", JSON.stringify(log));
    const { memberId: _, ...display } = entry;
    setAuditLog(prev => [...prev, display]);
  };

  const patchOverride = (patch: Partial<Member>) => {
    const raw = localStorage.getItem("bks_member_overrides");
    const overrides: Record<string, Partial<Member>> = raw ? JSON.parse(raw) : {};
    overrides[id] = { ...(overrides[id] ?? {}), ...patch };
    localStorage.setItem("bks_member_overrides", JSON.stringify(overrides));
  };

  const handleApprove = () => {
    if (!member) return;
    const hasExpiry = MEMBER_TYPE_HAS_EXPIRY[member.person_type_code];
    const needsDoc = MEMBER_TYPE_NEEDS_DOC[member.person_type_code];
    const today = new Date().toISOString().split("T")[0];
    const memberNo = member.member_no ?? generateMemberNo(today);
    const patch: Partial<Member> = {
      approval_status: "approved" as const,
      status: "ACTIVE" as const,
      approved_at: today,
      member_no: memberNo,
      ...(hasExpiry ? { expiry_date: approveExpiryDate } : {}),
      ...(needsDoc ? { discount_percent: approveDiscount } : {}),
    };
    patchOverride(patch);
    let note = `อนุมัติสิทธิ์สมาชิก เลขสมาชิก ${memberNo}`;
    if (needsDoc) note += ` ส่วนลด ${approveDiscount}%`;
    if (hasExpiry) note += ` หมดอายุ ${isoToThai(approveExpiryDate)}`;
    else if (needsDoc) note += " (ไม่มีวันหมดอายุ)";
    addAuditEntry("อนุมัติ", note);
    setMember(prev => prev ? { ...prev, ...patch } : null);
    setShowApproveModal(false);
    setSuccessMsg("อนุมัติสำเร็จ");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    const patch = { approval_status: "rejected" as const, rejection_reason: rejectReason.trim() };
    patchOverride(patch);
    addAuditEntry("ไม่อนุมัติ", rejectReason.trim());
    setMember(prev => prev ? { ...prev, ...patch } : null);
    setShowRejectModal(false);
    setRejectReason("");
    setSuccessMsg("บันทึกการปฏิเสธแล้ว");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleEditSave = () => {
    if (!member) return;
    const changes: string[] = [];
    if (editPersonType !== member.person_type_code)
      changes.push(`ประเภท: ${MEMBER_TYPE_LABELS[member.person_type_code] ?? member.person_type_code} → ${MEMBER_TYPE_LABELS[editPersonType] ?? editPersonType}`);
    if (editApprovalStatus !== member.approval_status)
      changes.push(`สถานะอนุมัติ: ${APPROVAL_STATUS_LABELS[member.approval_status]} → ${APPROVAL_STATUS_LABELS[editApprovalStatus]}`);
    if (editAccountStatus !== member.status)
      changes.push(`สถานะบัญชี: ${ACCOUNT_STATUS_LABELS[member.status]} → ${ACCOUNT_STATUS_LABELS[editAccountStatus]}`);
    const editHasExpiry = MEMBER_TYPE_HAS_EXPIRY[editPersonType];
    const editNeedsDoc = MEMBER_TYPE_NEEDS_DOC[editPersonType];
    if (editHasExpiry && editExpiryDate && editExpiryDate !== (member.expiry_date ?? ""))
      changes.push(`วันหมดอายุ: ${isoToThai(editExpiryDate)}`);
    if (editNeedsDoc && editDiscount !== (member.discount_percent ?? 0))
      changes.push(`ส่วนลด: ${editDiscount}%`);
    if (editRemark !== (member.remark ?? ""))
      changes.push("แก้ไขหมายเหตุ");

    const patch: Partial<Member> = {
      person_type_code: editPersonType,
      approval_status: editApprovalStatus,
      status: editAccountStatus,
      remark: editRemark || undefined,
      ...(editHasExpiry && editExpiryDate ? { expiry_date: editExpiryDate } : {}),
      ...(editNeedsDoc ? { discount_percent: editDiscount } : {}),
    };
    patchOverride(patch);
    addAuditEntry(
      "แก้ไขข้อมูล",
      changes.length > 0 ? changes.join(", ") : "บันทึกข้อมูล (ไม่มีการเปลี่ยนแปลง)"
    );
    setMember(prev => prev ? { ...prev, ...patch } : null);
    setEditMode(false);
    setSuccessMsg("บันทึกการแก้ไขแล้ว");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  if (!member) return null;

  const hasDoc = MEMBER_TYPE_NEEDS_DOC[member.person_type_code];
  const hasExpiry = MEMBER_TYPE_HAS_EXPIRY[member.person_type_code];
  const canAct = member.approval_status === "pending" || member.approval_status === "rejected";
  const expiringSoon = member.approval_status === "approved" && isExpiringSoon(member.expiry_date, reminderDays);
  const isSuperAdmin = adminRole === "super_admin";

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#071a0c] text-white text-[15px] font-semibold px-4 py-3 rounded-xl shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {successMsg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[15px]">
        <Link href="/backoffice/members" className="text-[#667085] hover:text-[#344054] flex items-center gap-1.5 font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          สมาชิกทั้งหมด
        </Link>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        <span className="text-[#101828] font-semibold">{member.name}</span>
      </div>

      {/* Expiry warning */}
      {expiringSoon && member.expiry_date && (
        <div className="flex items-center gap-3 bg-[#fffbeb] border border-[#fcd34d] rounded-xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span className="text-[15px] font-semibold text-[#b45309]">
            สิทธิ์สมาชิกจะหมดอายุในอีก {daysUntilExpiry(member.expiry_date)} วัน ({isoToThai(member.expiry_date)})
          </span>
        </div>
      )}

      <div className="grid grid-cols-[1fr_340px] gap-5 items-start">
        {/* Left: Profile + edit form + audit log */}
        <div className="flex flex-col gap-4">

          {/* Member header card */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <h2 className="text-[20px] font-semibold text-[#101828]">{member.name}</h2>
                  <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${MEMBER_TYPE_COLORS[member.person_type_code] ?? "bg-[#f3f4f6] text-[#667085]"}`}>
                    {MEMBER_TYPE_LABELS[member.person_type_code] ?? member.person_type_code}
                  </span>
                  {member.member_no && (
                    <span className="text-[13px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#f0f2ff] text-[#171b82] whitespace-nowrap">
                      {member.member_no}
                    </span>
                  )}
                </div>
                <div className="text-[14px] font-mono text-[#9ca3af]">{member.id}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${APPROVAL_STATUS_COLORS[member.approval_status]}`}>
                  {APPROVAL_STATUS_LABELS[member.approval_status]}
                </span>
                <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${ACCOUNT_STATUS_COLORS[member.status]}`}>
                  {ACCOUNT_STATUS_LABELS[member.status]}
                </span>
              </div>
            </div>

            {/* Personal info grid */}
            <div className="mb-5">
              <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">ข้อมูลส่วนตัว</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="เพศ" value={GENDER_LABELS[member.gender] ?? member.gender} />
                <InfoRow label="วันเกิด" value={member.birth_date ? isoToThai(member.birth_date) : null} />
                <InfoRow label="สัญชาติ" value={member.nationality} />
                <InfoRow label="เลขบัตรประชาชน" value={member.id_card} mono />
                {member.passport_no && <InfoRow label="เลขหนังสือเดินทาง" value={member.passport_no} mono />}
              </div>
            </div>

            {/* Contact info */}
            <div className="mb-5 pt-4 border-t border-[#f3f4f6]">
              <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">ข้อมูลติดต่อ</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="เบอร์โทรศัพท์" value={member.tel_no} />
                <InfoRow label="อีเมล" value={member.email} />
                {member.address && <InfoRow label="ที่อยู่" value={member.address} />}
                {(member.sub_district || member.district) && (
                  <InfoRow
                    label="แขวง/ตำบล · เขต/อำเภอ"
                    value={[member.sub_district, member.district].filter(Boolean).join(" · ")}
                  />
                )}
                {member.province && <InfoRow label="จังหวัด" value={member.province} />}
                {member.post_code && <InfoRow label="รหัสไปรษณีย์" value={member.post_code} mono />}
              </div>
            </div>

            {/* Membership info */}
            <div className="pt-4 border-t border-[#f3f4f6]">
              <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">ข้อมูลสมาชิก</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="วันที่สมัคร" value={isoToThai(member.register_date)} />
                <InfoRow label="เอกสาร" value={member.document_label ?? "ไม่ต้องใช้เอกสาร"} />
                {member.approval_status === "approved" && (
                  <>
                    <InfoRow label="วันที่อนุมัติ" value={member.approved_at ? isoToThai(member.approved_at) : null} />
                    <div>
                      <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">วันหมดอายุ</div>
                      <div className={`text-[15px] font-medium ${expiringSoon ? "text-[#b45309] font-semibold" : "text-[#344054]"}`}>
                        {member.expiry_date ? isoToThai(member.expiry_date) : "ไม่มีวันหมดอายุ"}
                      </div>
                    </div>
                    {member.discount_percent != null && (
                      <div>
                        <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">ส่วนลด</div>
                        <div className="text-[22px] font-semibold text-[#059669]">{member.discount_percent}%</div>
                      </div>
                    )}
                  </>
                )}
                {member.approval_status === "rejected" && member.rejection_reason && (
                  <div className="col-span-2">
                    <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">เหตุผลที่ไม่อนุมัติ</div>
                    <div className="text-[15px] text-[#dc2626] bg-[#fff1f0] rounded-lg px-3 py-2.5 border border-[#fecaca]">{member.rejection_reason}</div>
                  </div>
                )}
                {member.remark && (
                  <div className="col-span-2">
                    <div className="text-[13px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-1">หมายเหตุ</div>
                    <div className="text-[15px] text-[#344054] bg-[#f9fafb] rounded-lg px-3 py-2.5 border border-[#f3f4f6]">{member.remark}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Approve/Reject actions */}
            {canAct && (
              <div className="mt-6 pt-5 border-t border-[#f3f4f6] flex items-center gap-3">
                <button
                  onClick={() => { setApproveDiscount(defaultDiscount); setApproveExpiryDate(oneYearFromNow()); setShowApproveModal(true); }}
                  className="flex items-center gap-2 bg-[#059669] text-white text-[15px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#047857] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  อนุมัติ
                </button>
                <button
                  onClick={() => { setRejectReason(""); setShowRejectModal(true); }}
                  className="flex items-center gap-2 bg-white text-[#dc2626] border-2 border-[#fecaca] text-[15px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#fff1f0] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  ไม่อนุมัติ
                </button>
              </div>
            )}
          </div>

          {/* Super-admin edit form */}
          {isSuperAdmin && (
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span className="text-[16px] font-semibold text-[#101828]">แก้ไขข้อมูลสมาชิก</span>
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#f0f2ff] text-[#171b82]">Super Admin</span>
                </div>
                <button
                  onClick={() => {
                    if (editMode) {
                      setEditPersonType(member.person_type_code);
                      setEditApprovalStatus(member.approval_status);
                      setEditAccountStatus(member.status);
                      setEditExpiryDate(member.expiry_date ?? "");
                      setEditDiscount(member.discount_percent ?? 0);
                      setEditRemark(member.remark ?? "");
                    }
                    setEditMode(m => !m);
                  }}
                  className="text-[14px] font-semibold text-[#171b82] hover:text-[#0f1260] flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#f0f2ff] transition-colors"
                >
                  {editMode ? "ยกเลิก" : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      แก้ไข
                    </>
                  )}
                </button>
              </div>

              {editMode && (
                <div className="p-5 flex flex-col gap-4">
                  {/* Person type */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">ประเภทสมาชิก</label>
                    <select
                      value={editPersonType}
                      onChange={e => {
                        const t = e.target.value;
                        setEditPersonType(t);
                        if (!MEMBER_TYPE_HAS_EXPIRY[t]) setEditExpiryDate("");
                        if (!MEMBER_TYPE_NEEDS_DOC[t]) setEditDiscount(0);
                      }}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10 bg-white"
                    >
                      {PERSON_TYPES.map(p => (
                        <option key={p.code} value={p.code}>{p.name_th}</option>
                      ))}
                    </select>
                  </div>

                  {/* Approval status */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">สถานะอนุมัติ</label>
                    <select
                      value={editApprovalStatus}
                      onChange={e => setEditApprovalStatus(e.target.value as ApprovalStatus)}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10 bg-white"
                    >
                      {ALL_APPROVAL_STATUSES.map(s => (
                        <option key={s} value={s}>{APPROVAL_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Account status */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">สถานะบัญชี</label>
                    <select
                      value={editAccountStatus}
                      onChange={e => setEditAccountStatus(e.target.value as AccountStatus)}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10 bg-white"
                    >
                      {ALL_ACCOUNT_STATUSES.map(s => (
                        <option key={s} value={s}>{ACCOUNT_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expiry date */}
                  {MEMBER_TYPE_HAS_EXPIRY[editPersonType] && (
                    <div>
                      <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">วันหมดอายุ</label>
                      <input
                        type="date"
                        value={editExpiryDate}
                        onChange={e => setEditExpiryDate(e.target.value)}
                        className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10"
                      />
                    </div>
                  )}

                  {/* Discount */}
                  {MEMBER_TYPE_NEEDS_DOC[editPersonType] && (
                    <div>
                      <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">ส่วนลด (%)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range" min={0} max={100} value={editDiscount}
                          onChange={e => setEditDiscount(Number(e.target.value))}
                          className="flex-1 accent-[#171b82]"
                        />
                        <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden w-20 focus-within:border-[#171b82] focus-within:ring-1 focus-within:ring-[#171b82]">
                          <input
                            type="number" min={0} max={100} value={editDiscount}
                            onChange={e => setEditDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                            className="w-full px-2 py-2 text-[15px] text-center text-[#101828] outline-none"
                          />
                          <span className="pr-2 text-[15px] text-[#667085]">%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remark */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">หมายเหตุ</label>
                    <textarea
                      value={editRemark}
                      onChange={e => setEditRemark(e.target.value)}
                      placeholder="หมายเหตุสำหรับแอดมิน..."
                      rows={2}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => {
                        setEditPersonType(member.person_type_code);
                        setEditApprovalStatus(member.approval_status);
                        setEditAccountStatus(member.status);
                        setEditExpiryDate(member.expiry_date ?? "");
                        setEditDiscount(member.discount_percent ?? 0);
                        setEditRemark(member.remark ?? "");
                        setEditMode(false);
                      }}
                      className="flex-1 border border-[#d0d5dd] text-[15px] font-semibold text-[#344054] py-2.5 rounded-xl hover:bg-[#f9fafb] transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="flex-1 bg-[#171b82] text-white text-[15px] font-semibold py-2.5 rounded-xl hover:bg-[#0f1260] transition-colors"
                    >
                      บันทึกการแก้ไข
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit log */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#f3f4f6]">
              <span className="text-[16px] font-semibold text-[#101828]">ประวัติการดำเนินการ</span>
            </div>
            <div className="divide-y divide-[#f9fafb]">
              {[...auditLog].reverse().map(entry => (
                <div key={entry.id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#f0f2ff] flex items-center justify-center shrink-0 mt-0.5">
                    {entry.action === "อนุมัติ" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : entry.action === "ไม่อนุมัติ" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    ) : entry.action === "หมดอายุ" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    ) : entry.action === "แก้ไขข้อมูล" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#171b82" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-[#101828]">{entry.action}</span>
                      <span className="text-[13px] text-[#9ca3af]">โดย {entry.adminName}</span>
                    </div>
                    {entry.note && <div className="text-[14px] text-[#667085] mt-0.5">{entry.note}</div>}
                    <div className="text-[13px] text-[#9ca3af] mt-0.5">{entry.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Document */}
        {hasDoc && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-5">
              <div className="text-[15px] font-semibold text-[#101828] mb-3">{member.document_label}</div>
              <DocPlaceholder personTypeCode={member.person_type_code} memberName={member.name} />
              <p className="text-[13px] text-[#9ca3af] text-center mt-3">ตัวอย่างเอกสารที่สมาชิกอัปโหลด</p>
            </div>
          </div>
        )}
      </div>

      {/* Approve modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowApproveModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <div className="text-[17px] font-semibold text-[#101828]">อนุมัติสมาชิก</div>
                <div className="text-[14px] text-[#667085]">{member.name}</div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {hasExpiry && (
                <div>
                  <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">วันหมดอายุ</label>
                  <input
                    type="date"
                    value={approveExpiryDate}
                    onChange={e => setApproveExpiryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[15px] text-[#101828] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10"
                  />
                </div>
              )}
              {!hasExpiry && hasDoc && (
                <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#86efac] rounded-lg px-3 py-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[14px] text-[#15803d] font-medium">สิทธิ์ประเภทนี้ไม่มีวันหมดอายุ</span>
                </div>
              )}
              {hasDoc && (
                <div>
                  <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">ส่วนลด (%)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min={0} max={100} value={approveDiscount}
                      onChange={e => setApproveDiscount(Number(e.target.value))}
                      className="flex-1 accent-[#171b82]"
                    />
                    <div className="flex items-center border border-[#d0d5dd] rounded-lg overflow-hidden w-20 focus-within:border-[#171b82] focus-within:ring-1 focus-within:ring-[#171b82]">
                      <input
                        type="number" min={0} max={100} value={approveDiscount}
                        onChange={e => setApproveDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-full px-2 py-2 text-[15px] text-center text-[#101828] outline-none"
                      />
                      <span className="pr-2 text-[15px] text-[#667085]">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 border border-[#d0d5dd] text-[15px] font-semibold text-[#344054] py-2.5 rounded-xl hover:bg-[#f9fafb] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 bg-[#059669] text-white text-[15px] font-semibold py-2.5 rounded-xl hover:bg-[#047857] transition-colors"
              >
                ยืนยันการอนุมัติ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </div>
              <div>
                <div className="text-[17px] font-semibold text-[#101828]">ไม่อนุมัติสมาชิก</div>
                <div className="text-[14px] text-[#667085]">{member.name}</div>
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-[#344054] mb-1.5">
                เหตุผล <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."
                rows={4}
                className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[15px] text-[#101828] placeholder:text-[#9ca3af] outline-none focus:border-[#171b82] focus:ring-2 focus:ring-[#171b82]/10 resize-none"
              />
              {!rejectReason.trim() && (
                <p className="text-[13px] text-[#9ca3af] mt-1">กรุณาระบุเหตุผลก่อนดำเนินการ</p>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 border border-[#d0d5dd] text-[15px] font-semibold text-[#344054] py-2.5 rounded-xl hover:bg-[#f9fafb] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-[#dc2626] text-white text-[15px] font-semibold py-2.5 rounded-xl hover:bg-[#b91c1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
