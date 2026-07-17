"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_MEMBERS,
  MEMBER_TYPE_LABELS,
  MEMBER_TYPE_COLORS,
  MEMBER_TYPE_NEEDS_DOC,
  MEMBER_TYPE_DOC_LABEL,
  isoToThai,
  type Member,
} from "@/lib/mockMembers";

function DocCell({ memberType, documentLabel }: { memberType: Member["memberType"]; documentLabel?: string }) {
  if (!MEMBER_TYPE_NEEDS_DOC[memberType]) {
    return <span className="text-[#9ca3af]">—</span>;
  }
  return (
    <span className="text-[13px] text-[#667085] font-medium">
      {documentLabel ?? MEMBER_TYPE_DOC_LABEL[memberType]}
    </span>
  );
}

export default function PendingMembersPage() {
  const router = useRouter();
  const [overrides, setOverrides] = useState<Record<string, Partial<Member>>>({});

  useEffect(() => {
    const raw = localStorage.getItem("bks_member_overrides");
    if (raw) setOverrides(JSON.parse(raw));
  }, []);

  const members = MOCK_MEMBERS.map(m => {
    const ov = overrides[m.id];
    return ov ? { ...m, ...ov } : m;
  });

  const pending = members
    .filter(m => m.status === "pending")
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  return (
    <div className="flex flex-col gap-4 max-w-[1000px]">
      {pending.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="text-[17px] font-semibold text-[#101828]">ไม่มีคำขอรอตรวจสอบ</div>
          <div className="text-[15px] text-[#667085]">คำขอสมาชิกใหม่จะปรากฏที่นี่</div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center gap-3">
            <span className="text-[16px] font-semibold text-[#101828]">คำขอรอตรวจสอบ</span>
            <span className="text-[13px] font-semibold px-2.5 py-1 rounded-full bg-[#fef9c3] text-[#b45309]">
              {pending.length} รายการ
            </span>
          </div>

          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                {["#", "ชื่อ-นามสกุล", "ประเภทสมาชิก", "วันที่ยื่น", "เอกสารที่ต้องการ", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[13px] font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f9fafb]">
              {pending.map((m, i) => (
                <tr
                  key={m.id}
                  onClick={() => router.push(`/backoffice/members/${m.id}`)}
                  className="hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <span className="inline-flex w-6 h-6 rounded-full bg-[#f3f4f6] text-[13px] font-semibold text-[#667085] items-center justify-center">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#101828]">{m.name}</div>
                    <div className="text-[13px] text-[#9ca3af] mt-0.5">{m.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${MEMBER_TYPE_COLORS[m.memberType]}`}>
                      {MEMBER_TYPE_LABELS[m.memberType]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#667085] whitespace-nowrap">
                    {isoToThai(m.submittedAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <DocCell memberType={m.memberType} documentLabel={m.documentLabel} />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); router.push(`/backoffice/members/${m.id}`); }}
                      className="flex items-center gap-1 text-[14px] font-semibold text-[#171b82] hover:text-[#0f1260] px-3 py-1.5 rounded-lg hover:bg-[#f0f2ff] transition-colors whitespace-nowrap"
                    >
                      ตรวจสอบ
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3 border-t border-[#f3f4f6] text-[14px] text-[#667085]">
            เรียงลำดับตามวันที่ยื่น — เก่าสุดก่อน (FIFO)
          </div>
        </div>
      )}
    </div>
  );
}
