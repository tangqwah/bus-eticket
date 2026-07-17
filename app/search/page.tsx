"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StepProgress from "@/components/StepProgress";

const BUS_LOGO = "/assets/bks-bus-logo.png";

type BusType = "รถด่วนพิเศษ VIP" | "รถด่วนพิเศษ" | "รถด่วน" | "รถมาตรฐาน";
type SeatClass = "ชั้น 1" | "ชั้น 2" | "ชั้น 3";
type SortKey = "dep" | "price" | "dur" | "arr";

interface Bus {
  id: number;
  no: string;
  route: string;
  type: BusType;
  typeColor: string;
  dep: string;
  arr: string;
  nextDay: boolean;
  dur: string;
  seats: number;
  price: number;
  seatClass: SeatClass;
  amenities: string[];
}

const BUSES: Bus[] = [
  { id: 1, no: "081", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถด่วนพิเศษ VIP", typeColor: "#7c3aed", dep: "07:00", arr: "13:30", nextDay: false, dur: "6 ชม. 30 น.", seats: 4,  price: 620, seatClass: "ชั้น 1", amenities: ["ปรับอากาศ", "นอน"] },
  { id: 2, no: "155", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถด่วน",           typeColor: "#d97706", dep: "09:00", arr: "15:30", nextDay: false, dur: "6 ชม. 30 น.", seats: 12, price: 427, seatClass: "ชั้น 2", amenities: ["ปรับอากาศ"] },
  { id: 3, no: "202", route: "กรุงเทพฯ – กระนวน–บ้านแพง",  type: "รถมาตรฐาน",       typeColor: "#6b7280", dep: "10:30", arr: "18:00", nextDay: false, dur: "7 ชม. 30 น.", seats: 8,  price: 320, seatClass: "ชั้น 3", amenities: [] },
  { id: 4, no: "317", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถด่วนพิเศษ",     typeColor: "#4f46e5", dep: "18:00", arr: "00:30", nextDay: true,  dur: "6 ชม. 30 น.", seats: 0,  price: 520, seatClass: "ชั้น 1", amenities: ["ปรับอากาศ", "นอน"] },
  { id: 5, no: "089", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถด่วนพิเศษ VIP", typeColor: "#7c3aed", dep: "20:00", arr: "02:30", nextDay: true,  dur: "6 ชม. 30 น.", seats: 20, price: 620, seatClass: "ชั้น 1", amenities: ["ปรับอากาศ", "นอน"] },
  { id: 6, no: "441", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถด่วน",           typeColor: "#d97706", dep: "21:00", arr: "03:30", nextDay: true,  dur: "6 ชม. 30 น.", seats: 3,  price: 427, seatClass: "ชั้น 2", amenities: ["ปรับอากาศ"] },
  { id: 7, no: "567", route: "กรุงเทพฯ – ขอนแก่น",         type: "รถมาตรฐาน",       typeColor: "#6b7280", dep: "23:00", arr: "05:30", nextDay: true,  dur: "6 ชม. 30 น.", seats: 5,  price: 380, seatClass: "ชั้น 3", amenities: [] },
];

const DATE_STRIP = [
  { day: "จ.",   date: "22 มิ.ย." },
  { day: "อ.",   date: "23 มิ.ย." },
  { day: "พ.",   date: "24 มิ.ย." },
  { day: "พฤ.", date: "25 มิ.ย." },
  { day: "ศ.",   date: "26 มิ.ย." },
  { day: "ส.",   date: "27 มิ.ย." },
  { day: "อา.", date: "28 มิ.ย." },
];

const BUS_TYPES: BusType[]    = ["รถด่วนพิเศษ VIP", "รถด่วนพิเศษ", "รถด่วน", "รถมาตรฐาน"];
const SEAT_CLASSES: SeatClass[] = ["ชั้น 1", "ชั้น 2", "ชั้น 3"];
const TIME_SLOTS               = ["00:00 – 06:00", "06:00 – 12:00", "12:00 – 18:00", "18:00 – 24:00"];
const AMENITIES_LIST           = ["ปรับอากาศ", "นอน"];
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "dep",   label: "ออกเช้าสุด" },
  { key: "price", label: "ถูกสุด" },
  { key: "dur",   label: "เร็วสุด" },
  { key: "arr",   label: "ถึงเร็วสุด" },
];

function timeToMin(t: string): number {
  const parts = t.split(":").map(Number) as [number, number];
  return parts[0] * 60 + parts[1];
}

function matchesTimeSlot(dep: string, slot: string): boolean {
  const [s, e] = slot.split(" – ") as [string, string];
  const depMin = timeToMin(dep);
  return depMin >= timeToMin(s) && depMin < timeToMin(e);
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group" onClick={onChange}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
        checked ? "bg-[#171b82] border-[#171b82]" : "border-[#d0d5dd] group-hover:border-[#171b82]"
      }`}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-[13px] text-[#344054] select-none">{label}</span>
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide mb-2.5">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(4);
  const [busNo, setBusNo]               = useState("");
  const [timeSlots, setTimeSlots]       = useState<string[]>([]);
  const [busTypes, setBusTypes]         = useState<BusType[]>([]);
  const [seatClasses, setSeatClasses]   = useState<SeatClass[]>([]);
  const [amenities, setAmenities]       = useState<string[]>([]);
  const [sort, setSort]                 = useState<SortKey>("dep");

  const hasFilters = busNo || timeSlots.length || busTypes.length || seatClasses.length || amenities.length;

  function clearFilters() {
    setBusNo("");
    setTimeSlots([]);
    setBusTypes([]);
    setSeatClasses([]);
    setAmenities([]);
  }

  const filtered = useMemo(() => {
    const result = BUSES.filter(b => {
      if (busNo && !b.no.includes(busNo.trim())) return false;
      if (timeSlots.length && !timeSlots.some(s => matchesTimeSlot(b.dep, s))) return false;
      if (busTypes.length && !busTypes.includes(b.type)) return false;
      if (seatClasses.length && !seatClasses.includes(b.seatClass)) return false;
      if (amenities.length && !amenities.every(a => b.amenities.includes(a))) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sort === "dep")   return timeToMin(a.dep) - timeToMin(b.dep);
      if (sort === "price") return a.price - b.price;
      if (sort === "arr")   return timeToMin(a.arr) - timeToMin(b.arr);
      return 0;
    });
  }, [busNo, timeSlots, busTypes, seatClasses, amenities, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <StepProgress current={1} />

      {/* Summary bar */}
      <div className="bg-[#cd416e] text-white py-3">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center justify-between text-[14px] font-medium">
          <div className="flex items-center gap-3">
            <span className="font-semibold">กรุงเทพมหานคร</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span className="font-semibold">ขอนแก่น</span>
            <span className="text-white/60 mx-1">·</span>
            <span>ศ. 26 มิ.ย. 2569</span>
            <span className="text-white/60 mx-1">·</span>
            <span>1 ผู้โดยสาร</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4v16h16v-7"/><path d="M9 15L20 4"/><path d="M15 4h5v5"/></svg>
            แก้ไขการค้นหา
          </button>
        </div>
      </div>

      {/* Date strip */}
      <div className="bg-white border-b border-[#e5e7eb] shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex gap-1 py-2">
            {DATE_STRIP.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[76px] ${
                  selectedDate === i
                    ? "bg-[#171b82] text-white"
                    : "text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
                }`}
              >
                <span className={`text-[11px] font-medium ${selectedDate === i ? "text-white/70" : "text-[#9ca3af]"}`}>{d.day}</span>
                <span className="font-semibold text-[13px] mt-0.5">{d.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1100px] mx-auto px-4 py-5 w-full flex gap-5 items-start">

        {/* Filter sidebar */}
        <aside className="w-[220px] shrink-0 bg-white rounded-2xl border border-[#e5e7eb] p-4 sticky top-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#101828]">ตัวกรอง</h2>
            {hasFilters ? (
              <button onClick={clearFilters} className="text-[12px] font-medium text-[#171b82] hover:underline">
                ล้างทั้งหมด
              </button>
            ) : null}
          </div>

          <FilterSection title="หมายเลขขบวน">
            <input
              value={busNo}
              onChange={e => setBusNo(e.target.value)}
              placeholder="เช่น 081"
              className="w-full border border-[#d0d5dd] rounded-lg px-3 py-2 text-[13px] text-[#101828] placeholder:text-[#c0c7d0] outline-none focus:border-[#171b82] transition-colors"
            />
          </FilterSection>

          <div className="h-px bg-[#f3f4f6]" />

          <FilterSection title="เวลาออกเดินทาง">
            {TIME_SLOTS.map(slot => (
              <Checkbox
                key={slot}
                checked={timeSlots.includes(slot)}
                onChange={() => setTimeSlots(prev => toggle(prev, slot))}
                label={slot}
              />
            ))}
          </FilterSection>

          <div className="h-px bg-[#f3f4f6]" />

          <FilterSection title="ประเภทขบวนรถ">
            {BUS_TYPES.map(t => (
              <Checkbox
                key={t}
                checked={busTypes.includes(t)}
                onChange={() => setBusTypes(prev => toggle(prev, t))}
                label={t}
              />
            ))}
          </FilterSection>

          <div className="h-px bg-[#f3f4f6]" />

          <FilterSection title="ชั้นที่นั่ง">
            {SEAT_CLASSES.map(c => (
              <Checkbox
                key={c}
                checked={seatClasses.includes(c)}
                onChange={() => setSeatClasses(prev => toggle(prev, c))}
                label={c}
              />
            ))}
          </FilterSection>

          <div className="h-px bg-[#f3f4f6]" />

          <FilterSection title="สิ่งอำนวยความสะดวก">
            {AMENITIES_LIST.map(a => (
              <Checkbox
                key={a}
                checked={amenities.includes(a)}
                onChange={() => setAmenities(prev => toggle(prev, a))}
                label={a}
              />
            ))}
          </FilterSection>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Count + sort */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-[13px] text-[#667085]">
              พบ <span className="font-semibold text-[#344054]">{filtered.length}</span> เที่ยวรถ
            </p>
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    sort === opt.key
                      ? "bg-[#171b82] text-white"
                      : "bg-white border border-[#e5e7eb] text-[#667085] hover:bg-[#f3f4f6] hover:text-[#344054]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-[#e5e7eb] py-16 flex flex-col items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
              <p className="text-[14px] font-semibold text-[#344054]">ไม่พบเที่ยวรถที่ตรงกัน</p>
              <p className="text-[13px] text-[#9ca3af]">ลองปรับตัวกรองหรือเลือกวันอื่น</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-2 text-[13px] font-semibold text-[#171b82] hover:underline">
                  ล้างตัวกรอง
                </button>
              )}
            </div>
          )}

          {/* Bus cards */}
          {filtered.map(bus => {
            const full = bus.seats === 0;
            const low  = !full && bus.seats <= 5;
            return (
              <div key={bus.id} className="bg-white rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="p-5 flex items-center gap-5">

                  {/* Left: identity */}
                  <div className="flex flex-col gap-2 shrink-0 w-[160px]">
                    <span
                      className="self-start text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: bus.typeColor }}
                    >
                      {bus.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <img src={BUS_LOGO} alt="BKS" className="w-8 h-8 object-contain shrink-0" />
                      <div>
                        <div className="text-[13px] font-semibold text-[#101828]">ขบวนที่ {bus.no}</div>
                        <div className="text-[11px] text-[#9ca3af]">{bus.seatClass}</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#667085] leading-snug">{bus.route}</div>
                  </div>

                  {/* Middle: departure → duration → arrival */}
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="text-center">
                      <div className="text-[30px] font-semibold text-[#101828] leading-none tabular-nums">{bus.dep}</div>
                      <div className="text-[11px] text-[#9ca3af] mt-1.5">ออกเดินทาง</div>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1 max-w-[130px]">
                      <span className="text-[11px] text-[#9ca3af]">{bus.dur}</span>
                      <div className="relative w-full flex items-center">
                        <div className="w-2 h-2 rounded-full border-2 border-[#d0d5dd] bg-white shrink-0 z-10" />
                        <div className="flex-1 h-px bg-[#d0d5dd]" />
                        <div className="w-2 h-2 rounded-full bg-[#171b82] shrink-0 z-10" />
                      </div>
                      {bus.nextDay && (
                        <span className="text-[10px] font-semibold text-[#d97706]">+1 วัน</span>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="text-[30px] font-semibold text-[#101828] leading-none tabular-nums">{bus.arr}</div>
                      <div className="text-[11px] text-[#9ca3af] mt-1.5">ถึงปลายทาง</div>
                    </div>
                  </div>

                  {/* Right: status + price + action */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0 min-w-[140px]">
                    {full ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626]">เต็ม</span>
                    ) : low ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e]">เหลือ {bus.seats} ที่นั่ง</span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46]">ว่าง {bus.seats} ที่นั่ง</span>
                    )}

                    {!full ? (
                      <>
                        <div className="text-right">
                          <div className="text-[26px] font-semibold text-[#a43458] leading-none tabular-nums">{bus.price.toLocaleString()}</div>
                          <div className="text-[11px] text-[#9ca3af] mt-0.5">บาท / ที่นั่ง</div>
                        </div>
                        <button
                          onClick={() => router.push("/passenger")}
                          className="bg-[#171b82] text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-[#131566] transition-colors whitespace-nowrap"
                        >
                          เลือกเที่ยวรถนี้
                        </button>
                      </>
                    ) : (
                      <p className="text-[13px] text-[#9ca3af]">ไม่มีที่นั่งว่าง</p>
                    )}
                  </div>
                </div>

                {/* Amenities strip */}
                {bus.amenities.length > 0 && (
                  <div className="px-5 py-2.5 border-t border-[#f3f4f6] flex items-center gap-2">
                    {bus.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1 text-[11px] text-[#667085] bg-[#f9fafb] border border-[#e5e7eb] px-2.5 py-0.5 rounded-full">
                        {a === "ปรับอากาศ" && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>
                        )}
                        {a === "นอน" && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 20v-6a2 2 0 012-2h16a2 2 0 012 2v6M2 20h20M4 12V7a2 2 0 012-2h12a2 2 0 012 2v5"/></svg>
                        )}
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
