const STEPS = [
  { id: 1, label: "เลือกเที่ยวรถ" },
  { id: 2, label: "ผู้โดยสาร" },
  { id: 3, label: "เลือกที่นั่ง" },
  { id: 4, label: "ตรวจสอบ" },
  { id: 5, label: "ชำระเงิน" },
  { id: 6, label: "เสร็จสิ้น" },
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StepProgress({ current }: { current: number }) {
  return (
    <div className="bg-white border-b border-[#efeaee]">
      <div className="max-w-[780px] mx-auto px-6 py-5">
        <div className="flex items-start justify-center">
          {STEPS.map((step, i) => {
            const done = step.id < current;
            const active = step.id === current;

            return (
              <div key={step.id} className="flex flex-1 flex-col items-center gap-2 relative">
                {/* connector line */}
                {i > 0 && (
                  <div
                    className="absolute h-0.5 top-[17px] right-1/2 left-[-50%]"
                    style={{ backgroundColor: done || active ? (done ? "#079455" : "#e5e7eb") : "#e5e7eb" }}
                  />
                )}
                {i > 0 && done && (
                  <div className="absolute h-0.5 top-[17px] right-1/2 left-[-50%] bg-[#079455]" />
                )}

                {/* circle */}
                <div className="relative z-10">
                  {done ? (
                    <div className="w-[34px] h-[34px] rounded-full bg-[#079455] flex items-center justify-center">
                      <CheckIcon />
                    </div>
                  ) : active ? (
                    <div className="w-[34px] h-[34px] rounded-full bg-[#cd416e] flex items-center justify-center shadow-[0_0_0_4px_#f4d0da]">
                      <span className="text-white text-[15px] font-bold">{step.id}</span>
                    </div>
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full border-2 border-[#e5e7eb] flex items-center justify-center">
                      <span className="text-[#9ca3af] text-[14px] font-semibold">{step.id}</span>
                    </div>
                  )}
                </div>

                {/* label */}
                <span
                  className="text-[12.5px] text-center whitespace-nowrap"
                  style={{
                    color: done ? "#444" : active ? "#cd416e" : "#9ca3af",
                    fontWeight: active || done ? 600 : 500,
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
