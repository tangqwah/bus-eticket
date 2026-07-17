"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";
import {
  readDraft, writeDraft, thaiDateLong, cityOf, stationOf,
  type PassengerInfo, type BookingDraft,
} from "@/lib/bookingStore";

const EMPTY_PAX: PassengerInfo = {
  title: "นาย",
  firstName: "",
  lastName: "",
  idType: "citizen",
  idNumber: "",
  gender: "male",
  phone: "",
  email: "",
  pickup: "สถานีขนส่งสายใต้ใหม่",
};

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
};

function errCls(err?: string) {
  return err
    ? "border-[#f04438] focus:ring-[#f04438] focus:border-[#f04438]"
    : "border-[#d0d5dd] focus:ring-[#171b82] focus:border-[#171b82]";
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[12px] text-[#f04438] mt-1">{msg}</p>;
}

export default function PassengerPage() {
  const router = useRouter();

  const [draft, setDraft]           = useState<BookingDraft | null>(null);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [ready, setReady]           = useState(false);
  const [errors, setErrors]         = useState<FieldErrors[]>([]);

  useEffect(() => {
    const d = readDraft();
    if (!d) { router.push("/"); return; }
    setDraft(d);
    const defaultPickup = stationOf(d.from) ?? cityOf(d.from);
    setPassengers(
      Array.from({ length: d.paxCount }, () => ({ ...EMPTY_PAX, pickup: defaultPickup }))
    );
    setReady(true);
  }, [router]);

  const updatePax = (i: number, field: keyof PassengerInfo, value: string) => {
    setPassengers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
    setErrors(prev => {
      if (!prev[i]?.[field as keyof FieldErrors]) return prev;
      return prev.map((e, idx) => idx === i ? { ...e, [field]: undefined } : e);
    });
  };

  const addPassenger = () => {
    if (passengers.length >= 9) return;
    const base = draft?.from ?? "";
    const defaultPickup = stationOf(base) ?? (cityOf(base) || "สถานีขนส่งสายใต้ใหม่");
    setPassengers(prev => [...prev, { ...EMPTY_PAX, pickup: defaultPickup }]);
    setErrors(prev => [...prev, {}]);
  };

  const validate = (): boolean => {
    const errs: FieldErrors[] = passengers.map(p => {
      const e: FieldErrors = {};
      if (!p.firstName.trim()) e.firstName = "กรุณากรอกชื่อ";
      if (!p.lastName.trim())  e.lastName  = "กรุณากรอกนามสกุล";

      const idDigits = p.idNumber.replace(/\D/g, "");
      if (!p.idNumber.trim()) {
        e.idNumber = "กรุณากรอกเลขบัตรประจำตัว";
      } else if (p.idType === "citizen" && idDigits.length !== 13) {
        e.idNumber = "เลขบัตรประชาชนต้องมี 13 หลัก";
      }

      const phoneDigits = p.phone.replace(/\D/g, "");
      if (!p.phone.trim()) {
        e.phone = "กรุณากรอกเบอร์โทรศัพท์";
      } else if (phoneDigits.length < 9 || phoneDigits.length > 10) {
        e.phone = "เบอร์โทรศัพท์ต้องมี 9-10 หลัก";
      }

      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        e.email = "รูปแบบอีเมลไม่ถูกต้อง";
      }

      return e;
    });
    setErrors(errs);
    return errs.every(e => Object.keys(e).length === 0);
  };

  if (!ready || !draft) return null;

  const pricePerSeat = draft.pricePerSeat;
  const total        = passengers.length * pricePerSeat;

  const handleNext = () => {
    if (!validate()) return;
    writeDraft({ ...draft, passengers });
    router.push("/seat");
  };

  const baseCls = "w-full border rounded-lg px-3 py-2.5 text-[14px] text-[#101828] outline-none focus:ring-1";

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={2} />

      <div className="max-w-[1100px] mx-auto px-4 py-6 w-full flex gap-6">
        {/* Main form */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Login banner */}
          <div className="bg-[#fff0f4] border border-[#f9c0d0] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#cd416e] rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#cd416e]">เข้าสู่ระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น</p>
                <p className="text-[12.5px] text-[#667085]">บันทึกข้อมูลผู้โดยสารและดูประวัติการจองได้ง่ายขึ้น</p>
              </div>
            </div>
            <button className="text-[13px] font-semibold text-[#cd416e] border border-[#cd416e] px-4 py-1.5 rounded-lg hover:bg-[#cd416e] hover:text-white">
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Passenger forms */}
          {passengers.map((pax, i) => {
            const e = errors[i] ?? {};
            return (
              <div key={i} className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="bg-[#f9fafb] border-b border-[#ece9ec] px-5 py-3">
                  <h3 className="text-[15px] font-semibold text-[#101828]">ผู้โดยสารลำดับที่ {i + 1}</h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {/* Pickup */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">จุดรับผู้โดยสาร</label>
                    <select
                      value={pax.pickup}
                      onChange={ev => updatePax(i, "pickup", ev.target.value)}
                      className={`${baseCls} border-[#d0d5dd] focus:ring-[#171b82] focus:border-[#171b82] bg-white`}
                    >
                      <option>สถานีขนส่งสายใต้ใหม่</option>
                      <option>สถานีขนส่งหมอชิต 2</option>
                      <option>สถานีขนส่งเอกมัย</option>
                    </select>
                  </div>

                  {/* Name row */}
                  <div className="flex gap-3">
                    <div className="w-[120px]">
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">คำนำหน้า</label>
                      <select
                        value={pax.title}
                        onChange={ev => updatePax(i, "title", ev.target.value)}
                        className={`${baseCls} border-[#d0d5dd] focus:ring-[#171b82] bg-white`}
                      >
                        <option>นาย</option>
                        <option>นาง</option>
                        <option>นางสาว</option>
                        <option>เด็กชาย</option>
                        <option>เด็กหญิง</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                        ชื่อ <span className="text-[#f04438]">*</span>
                      </label>
                      <input
                        value={pax.firstName}
                        onChange={ev => updatePax(i, "firstName", ev.target.value)}
                        className={`${baseCls} ${errCls(e.firstName)}`}
                        placeholder="ชื่อ"
                      />
                      <FieldError msg={e.firstName} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                        นามสกุล <span className="text-[#f04438]">*</span>
                      </label>
                      <input
                        value={pax.lastName}
                        onChange={ev => updatePax(i, "lastName", ev.target.value)}
                        className={`${baseCls} ${errCls(e.lastName)}`}
                        placeholder="นามสกุล"
                      />
                      <FieldError msg={e.lastName} />
                    </div>
                  </div>

                  {/* ID type + number */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                      ประเภทบัตรประจำตัว <span className="text-[#f04438]">*</span>
                    </label>
                    <div className="flex gap-4 mb-2">
                      {([["citizen", "เลขประจำตัวประชาชน"], ["passport", "หนังสือเดินทาง"]] as const).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={pax.idType === val}
                            onChange={() => updatePax(i, "idType", val)}
                            className="accent-[#171b82]"
                          />
                          <span className="text-[13.5px] text-[#344054]">{label}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      value={pax.idNumber}
                      onChange={ev => updatePax(i, "idNumber", ev.target.value)}
                      className={`${baseCls} ${errCls(e.idNumber)}`}
                      placeholder={pax.idType === "citizen" ? "เลขบัตรประชาชน 13 หลัก" : "หมายเลขหนังสือเดินทาง"}
                    />
                    <FieldError msg={e.idNumber} />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#344054] mb-1.5">ประเภทผู้โดยสาร</label>
                    <div className="flex gap-2">
                      {([["male", "ชาย"], ["female", "หญิง"], ["child", "เด็ก"]] as const).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => updatePax(i, "gender", val)}
                          className={`px-5 py-2 rounded-lg text-[14px] font-medium border ${
                            pax.gender === val
                              ? "bg-[#171b82] text-white border-[#171b82]"
                              : "bg-white text-[#344054] border-[#d0d5dd] hover:bg-[#f9fafb]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone + Email */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                        เบอร์โทรศัพท์ <span className="text-[#f04438]">*</span>
                      </label>
                      <input
                        value={pax.phone}
                        onChange={ev => updatePax(i, "phone", ev.target.value)}
                        className={`${baseCls} ${errCls(e.phone)}`}
                        placeholder="0812345678"
                      />
                      <FieldError msg={e.phone} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[13px] font-medium text-[#344054] mb-1.5">อีเมล</label>
                      <input
                        value={pax.email}
                        onChange={ev => updatePax(i, "email", ev.target.value)}
                        className={`${baseCls} ${errCls(e.email)}`}
                        placeholder="example@email.com"
                      />
                      <FieldError msg={e.email} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add passenger */}
          {passengers.length < 9 && (
            <button
              onClick={addPassenger}
              className="bg-white border-2 border-dashed border-[#d0d5dd] rounded-xl py-4 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#667085] hover:border-[#171b82] hover:text-[#171b82]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
              เพิ่มผู้โดยสาร
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-[300px] shrink-0 flex flex-col gap-4">
          {/* Trip card */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-[#cd416e] px-4 py-3">
              <p className="text-white font-semibold text-[14px]">{cityOf(draft.from)} – {cityOf(draft.to)} {draft.busType}</p>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-[22px] font-semibold text-[#101828]">{draft.dep}</div>
                  <div className="text-[11px] text-[#667085]">{cityOf(draft.from)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
                  <div className="text-[11px] text-[#667085]">{draft.dur}</div>
                  <div className="w-full h-px bg-[#d0d5dd] relative">
                    <svg className="absolute top-1/2 right-0 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[22px] font-semibold text-[#101828]">{draft.arr}</div>
                  <div className="text-[11px] text-[#667085]">{cityOf(draft.to)}</div>
                </div>
              </div>
              <div className="text-[12.5px] text-[#667085] border-t border-[#f3f4f6] pt-3 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>วันที่</span>
                  <span className="text-[#344054] font-medium">{thaiDateLong(draft.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ชั้นรถ</span>
                  <span className="text-[#344054] font-medium">{draft.busType}</span>
                </div>
                <div className="flex justify-between">
                  <span>ต้นทาง</span>
                  <span className="text-[#344054] font-medium text-right max-w-[160px] truncate">
                    {stationOf(draft.from) ?? cityOf(draft.from)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-xl border border-[#ece9ec] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)] p-4">
            <h4 className="text-[14px] font-semibold text-[#101828] mb-3">สรุปราคา</h4>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <div className="flex justify-between text-[#667085]">
                <span>เที่ยวไป x {passengers.length} ({pricePerSeat.toLocaleString()} บาท/ที่นั่ง)</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span />
                <span className="text-[#344054]">{total.toLocaleString()} บาท</span>
              </div>
              <div className="border-t border-[#f3f4f6] pt-2 mt-1 flex justify-between font-semibold text-[#101828] text-[15px]">
                <span>รวมทั้งหมด</span>
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
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#344054] hover:text-[#101828]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            กลับไปเลือกเที่ยวรถ
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[20px] font-semibold text-[#a43458]">{total.toLocaleString()} บาท</div>
              <div className="text-[12px] text-[#667085]">ราคารวม ({passengers.length} ผู้โดยสาร)</div>
            </div>
            <button
              onClick={handleNext}
              className="bg-[#171b82] text-white text-[15px] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#131566]"
            >
              ถัดไป · เลือกที่นั่ง
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
