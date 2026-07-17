"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_MEMBERS,
  MEMBER_TYPE_LABELS,
  MEMBER_TYPE_COLORS,
  MEMBER_STATUS_LABELS,
  MEMBER_STATUS_COLORS,
  isoToThai,
  isExpiringSoon,
  daysUntilExpiry,
  type Member,
  type MemberType,
  type MemberStatus,
} from "@/lib/mockMembers";

type Override = Partial<Pick<Member, "status" | "approvedAt" | "expiryDate" | "discountPercent" | "rejectionReason">>;

const TYPE_FILTER_TABS: { key: MemberType | "all"; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "general", label: "ผู้ใช้ทั่วไป" },
  { key: "employee", label: "พนักงาน บขส." },
  { key: "official", label: "ข้าราชการ/ทหาร" },
  { key: "senior", label: "ผู้สูงอายุ" },
  { key: "student", label: "นักเรียน/นักศึกษา" },
  { key: "disabled", label: "ผู้พิการ" },
];

const STATUS_FILTER_TABS: { key: MemberStatus | "all"; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "pending", label: "รอตรวจสอบ" },
  { key: "approved", label: "อนุมัติแล้ว" },
  { key: "rejected", label: "ไม่อนุมัติ" },
  { key: "expired", label: "หมดอายุ" },
];

export default function MembersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MemberType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [reminderDays, setReminderDays] = useState(30);

  useEffect(() => {
    const raw = localStorage.getItem("bks_member_overrides");
    if (raw) setOverrides(JSON.parse(raw));
    const settingsRaw = localStorage.getItem("bks_discount_settings");
    if (settingsRaw) {
      const s = JSON.parse(settingsRaw);
      setReminderDays(s.renewalReminderDays ?? 30);
    }
  }, []);

  const members = MOCK_MEMBERS.map(m => {
    const ov = overrides[m.id];
    return ov ? { ...m, ...ov } : m;
  });

  const filtered = members.filter(m => {
    if (typeFilter !== "all" && m.memberType !== typeFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    const q = search.toLowerCase();
    return !q || m.name.includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q);
  });

  const pendingCount = members.filter(m => m.status === "pending").length;
  const expiringSoon = members.filter(m => m.status === "approved" && isExpiringSoon(m.expiryDate, reminderDays));

  const exportCSV = () => {
    const headers = ["รหัส", "ชื่อ-นามสกุล", "อีเมล", "เบอร์โทร", "ประเภทสมาชิก", "สถานะ", "วันหมดอายุ", "ส่วนลด%", "วันที่สมัคร"];
    const rows = filtered.map(m => [
      m.id,
      m.name,
      m.email,
      m.phone,
      MEMBER_TYPE_LABELS[m.memberType],
      MEMBER_STATUS_LABELS[m.status],
      m.expiryDate ? isoToThai(m.expiryDate) : "-",
      m.discountPercent != null ? `${m.discountPercent}%` : "-",
      isoToThai(m.submittedAt),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1200px]">
      {/* Expiry warning banner */}
      {expiringSoon.length > 0 && (
        <div className="flex items-start gap-3 bg-[#fffbeb] border border-[#fcd34d] rounded-2xl px-5 py-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <div className="text-[13px] font-semibold text-[#b45309]">มีสมาชิกที่ใกล้หมดอายุ</div>
            <div className="text-[12px] text-[#92400e] mt-0.5">
              {expiringSoon.length} รายการ ภายใน {reminderDays} วัน:{" "}
              {expiringSoon.map((m, i) => (
                <span key={m.id}>
                  <button
                    onClick={() => router.push(`/backoffice/members/${m.id}`)}
                    className="underline hover:text-[#b45309] font-semibold"
                  >
                    {m.name}
                  </button>
                  {m.expiryDate && (
                    <span className="text-[#b45309]">
                      {" "}(เหลือ {daysUntilExpiry(m.expiryDate)} วัน)
                    </span>
                  )}
                  {i < expiringSoon.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "สมาชิกทั้งหมด", value: members.length, unit: "ราย", color: "text-[#101828]", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          ), bg: "bg-[#f0f2ff] text-[#171b82]" },
          { label: "รอตรวจสอบ", value: pendingCount, unit: "ราย", color: "text-[#b45309]", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ), bg: "bg-[#fef9c3] text-[#b45309]" },
          { label: "ใกล้หมดอายุ", value: expiringSoon.length, unit: "ราย", color: "text-[#b45309]", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ), bg: "bg-[#fff7ed] text-[#f59e0b]" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e5e7eb] px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-[12px] text-[#667085] font-medium">{s.label}</div>
              <div className={`text-[24px] font-semibold mt-0.5 ${s.color}`}>
                {s.value} <span className="text-[14px] font-medium text-[#667085]">{s.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 border border-[#d0d5dd] rounded-lg px-3 py-2 flex-1 max-w-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหา ชื่อ, อีเมล, เบอร์โทร..."
              className="flex-1 text-[13px] text-[#101828] placeholder:text-[#9ca3af] outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#9ca3af] hover:text-[#344054]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 text-[12px] font-semibold text-[#344054] border border-[#d0d5dd] px-3.5 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ส่งออก CSV
            </button>
          </div>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider w-20 shrink-0">ประเภท</span>
          <div className="flex items-center gap-1">
            {TYPE_FILTER_TABS.map(tab => {
              const count = tab.key === "all" ? members.length : members.filter(m => m.memberType === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setTypeFilter(tab.key)}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    typeFilter === tab.key ? "bg-[#0f1260] text-white" : "text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeFilter === tab.key ? "bg-white/20" : "bg-[#f3f4f6]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider w-20 shrink-0">สถานะ</span>
          <div className="flex items-center gap-1">
            {STATUS_FILTER_TABS.map(tab => {
              const count = tab.key === "all" ? members.length : members.filter(m => m.status === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === tab.key ? "bg-[#0f1260] text-white" : "text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusFilter === tab.key ? "bg-white/20" : "bg-[#f3f4f6]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {["รหัสสมาชิก", "ชื่อ-นามสกุล", "ประเภทสมาชิก", "สถานะ", "วันหมดอายุ", "ส่วนลด", "วันที่สมัคร", ""].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f9fafb]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#9ca3af]">ไม่พบสมาชิก</td>
              </tr>
            ) : filtered.map(m => {
              const soon = m.status === "approved" && isExpiringSoon(m.expiryDate, reminderDays);
              return (
                <tr
                  key={m.id}
                  onClick={() => router.push(`/backoffice/members/${m.id}`)}
                  className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono text-[12px] font-semibold text-[#344054] whitespace-nowrap">{m.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#101828]">{m.name}</div>
                    <div className="text-[11px] text-[#9ca3af] mt-0.5">{m.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${MEMBER_TYPE_COLORS[m.memberType]}`}>
                      {MEMBER_TYPE_LABELS[m.memberType]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${MEMBER_STATUS_COLORS[m.status]}`}>
                      {MEMBER_STATUS_LABELS[m.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {m.expiryDate ? (
                      <div className={soon ? "text-[#b45309] font-semibold" : "text-[#667085]"}>
                        {isoToThai(m.expiryDate)}
                        {soon && (
                          <div className="text-[10px] font-semibold text-[#b45309] mt-0.5 flex items-center gap-1">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="#b45309"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                            เหลือ {daysUntilExpiry(m.expiryDate)} วัน
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {m.discountPercent != null ? (
                      <span className="font-semibold text-[#059669]">{m.discountPercent}%</span>
                    ) : (
                      <span className="text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#667085] whitespace-nowrap">{isoToThai(m.submittedAt)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); router.push(`/backoffice/members/${m.id}`); }}
                      className="flex items-center gap-1 text-[12px] font-semibold text-[#171b82] hover:text-[#0f1260] px-3 py-1.5 rounded-lg hover:bg-[#f0f2ff] transition-colors whitespace-nowrap"
                    >
                      ดูรายละเอียด
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#f3f4f6] flex items-center justify-between text-[12px] text-[#667085]">
          <span>แสดง {filtered.length} จาก {members.length} รายการ</span>
        </div>
      </div>
    </div>
  );
}
