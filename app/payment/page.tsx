"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";

type PayMethod = "card" | "qr" | "promptpay" | "counter";

const METHODS = [
  { id: "card" as const, label: "บัตรเครดิต/เดบิต", icon: "💳", desc: "Visa, Mastercard, JCB" },
  { id: "qr" as const, label: "QR Code", icon: "📱", desc: "Thai QR Payment" },
  { id: "promptpay" as const, label: "พร้อมเพย์", icon: "🏦", desc: "โอนเงินผ่านพร้อมเพย์" },
  { id: "counter" as const, label: "ชำระที่เคาน์เตอร์", icon: "🏪", desc: "7-Eleven, Big C, Lotus's" },
];

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PayMethod>("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const total = 854;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/confirmation");
    }, 1800);
  };

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={5} />

      <div className="max-w-[1100px] mx-auto px-4 py-6 w-full flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {/* Payment methods */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-5">
            <h3 className="text-[15px] font-semibold text-[#101828] mb-4">เลือกวิธีชำระเงิน</h3>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                    method === m.id
                      ? "border-[#171b82] bg-[#f0f2ff]"
                      : "border-[#e5e7eb] hover:border-[#d0d5dd] bg-white"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className={`text-[14px] font-semibold ${method === m.id ? "text-[#171b82]" : "text-[#344054]"}`}>{m.label}</div>
                    <div className="text-[12px] text-[#667085]">{m.desc}</div>
                  </div>
                  {method === m.id && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#171b82] flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Card form */}
          {method === "card" && (
            <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-5">
              <h3 className="text-[15px] font-semibold text-[#101828] mb-4">ข้อมูลบัตร</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">ชื่อบนบัตร</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171b82] focus:border-[#171b82]"
                    placeholder="ชื่อ-นามสกุลบนบัตร"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">หมายเลขบัตร</label>
                  <input
                    value={cardNum}
                    onChange={e => setCardNum(formatCard(e.target.value))}
                    className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171b82] focus:border-[#171b82] font-mono tracking-wider"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">วันหมดอายุ</label>
                    <input
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171b82] focus:border-[#171b82]"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="w-[140px]">
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">CVV</label>
                    <input
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-1 focus:ring-[#171b82] focus:border-[#171b82]"
                      placeholder="000"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[#667085]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                ข้อมูลบัตรของคุณได้รับการเข้ารหัสแบบ SSL
              </div>
            </div>
          )}

          {/* QR / PromptPay */}
          {(method === "qr" || method === "promptpay") && (
            <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-[#f3f4f6] rounded-xl flex items-center justify-center border-2 border-[#e5e7eb]">
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 ${Math.random() > 0.4 ? "bg-[#101828]" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <p className="text-[14px] text-[#667085] text-center">
                สแกน QR Code เพื่อชำระเงิน<br />
                <span className="font-bold text-[#101828]">{total.toLocaleString()} บาท</span>
              </p>
              <p className="text-[12.5px] text-[#9ca3af]">QR Code หมดอายุใน 15:00 นาที</p>
            </div>
          )}

          {method === "counter" && (
            <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#fef3c7] rounded-full flex items-center justify-center shrink-0 text-xl">⚠️</div>
                <div>
                  <p className="text-[14px] font-semibold text-[#92400e]">ชำระที่เคาน์เตอร์เซอร์วิส</p>
                  <p className="text-[13px] text-[#667085] mt-1">ระบบจะส่งรหัสชำระเงินไปยังอีเมลของคุณ กรุณาชำระภายใน 30 นาที</p>
                </div>
              </div>
              <div className="bg-[#f9fafb] rounded-lg p-4 text-[13px] text-[#344054]">
                <p className="font-semibold mb-2">จุดรับชำระเงิน:</p>
                {["7-Eleven", "Big C", "Lotus's", "FamilyMart"].map(s => (
                  <div key={s} className="flex items-center gap-2 py-0.5">
                    <span className="text-[#079455]">✓</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[300px] shrink-0">
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4 sticky top-[70px]">
            <h4 className="text-[15px] font-semibold text-[#101828] mb-4">สรุปการจอง</h4>

            <div className="bg-[#f9fafb] rounded-lg p-3 mb-4 text-[13px]">
              <div className="font-semibold text-[#344054] mb-2">กรุงเทพฯ → ขอนแก่น</div>
              <div className="flex justify-between text-[#667085]">
                <span>09:00 - 15:30</span>
                <span>รถด่วน</span>
              </div>
              <div className="text-[#667085] mt-1">ศ. 26 มิ.ย. 2569 · ที่นั่ง A3, B3</div>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px]">
              <div className="flex justify-between text-[#667085]">
                <span>ค่าตั๋ว (2 ใบ)</span>
                <span className="text-[#344054]">{total.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>ค่าบริการ</span>
                <span className="text-[#344054]">0 บาท</span>
              </div>
              <div className="border-t border-[#f3f4f6] pt-3 mt-1 flex justify-between font-bold text-[#101828] text-[16px]">
                <span>ยอดชำระ</span>
                <span className="text-[#a43458]">{total.toLocaleString()} บาท</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb] py-4">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/review")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#344054] hover:text-[#101828]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            กลับ
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[20px] font-bold text-[#a43458]">{total.toLocaleString()} บาท</div>
              <div className="text-[12px] text-[#667085]">ยอดชำระทั้งหมด</div>
            </div>
            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-[#cd416e] text-white text-[15px] font-bold px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#b83560] disabled:opacity-75 min-w-[180px] justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  ชำระเงิน
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
