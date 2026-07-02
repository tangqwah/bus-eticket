import Link from "next/link";

const BKS_LOGO = "https://www.figma.com/api/mcp/asset/8e69ea32-6f68-40e5-ac2c-47e43d378771";

export default function Header() {
  return (
    <header className="bg-white border-b border-[#ededed] sticky top-0 z-50">
      <div className="max-w-[1512px] mx-auto px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/">
            <img src={BKS_LOGO} alt="BKS" className="h-9 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#344054]">
            <Link href="/" className="hover:text-[#171b82]">หน้าแรก</Link>
            <button className="flex items-center gap-1 hover:text-[#171b82]">
              จัดการการเดินทาง
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="hover:text-[#171b82] cursor-pointer">วิธีการจองและชำระเงิน</span>
            <span className="hover:text-[#171b82] cursor-pointer">สิทธิพิเศษ</span>
            <span className="hover:text-[#171b82] cursor-pointer">ติดต่อเรา</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-[15px] font-semibold text-[#222]">
            ไทย
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="bg-[#171b82] text-white text-[14px] font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-[#131566]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </header>
  );
}
