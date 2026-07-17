# BKS eTicket — Product Requirements Document

**Product:** ระบบจองตั๋วโดยสารออนไลน์ บริษัท ขนส่ง จำกัด (BKS)
**URL:** https://bus-eticket.vercel.app
**Stack:** Next.js 16.2.10 App Router · React 19 · TypeScript · Tailwind CSS 4 · Vercel
**Last updated:** 17 Jul 2026

---

## 1. Overview

BKS eTicket is a full-stack bus ticket booking web app with two distinct surfaces:

- **Customer portal** — public-facing booking flow, login/register, and profile
- **Backoffice** — admin tool for managing trips, bookings, routes, members, and discounts

All state is persisted in `localStorage` (no backend/database). UI text is in Thai; code is in English.

---

## 2. Tech Decisions

| Concern | Decision |
|---|---|
| Routing | Next.js App Router, file-system pages |
| State | `localStorage` keys per domain (see §6) |
| Fonts | Google Sans (Latin) via `next/font/google`; Thai text falls back to system sans-serif |
| Colours | Primary `#171b82`, CTA/rose `#cd416e`, success `#059669`, error `#f04438` |
| Deployment | Vercel (production auto-aliased to `bus-eticket.vercel.app`) |

---

## 3. Customer Portal

### 3.1 Home (`/`)

- Full-width search form: ต้นทาง → ปลายทาง, วันเดินทาง, จำนวนผู้โดยสาร (1–4)
- Submits → `/search` with query params

### 3.2 Search (`/search`)

- 7-day date strip centered on selected date; tap to jump to another date
- Filter sidebar: bus type (ทั้งหมด / รถด่วนพิเศษ / รถนอน / รถด่วน / รถปรับอากาศ)
- Sort: เวลาออก / ราคา / ระยะเวลา
- Trip cards: route, departure/arrival, duration, bus type badge, price, seat availability
- Selecting a trip writes initial draft → navigates to `/seat`

### 3.3 Seat Selection (`/seat`)

- Visual seat map rendered from trip data
- Highlights occupied vs available seats
- Requires selection of exactly `paxCount` seats
- Proceeds → `/passenger`

### 3.4 Passenger Info (`/passenger`)

- One form section per passenger (e.g. 2 passengers = 2 sections)
- Fields: คำนำหน้า, ชื่อ, นามสกุล, เพศ, ประเภทบัตร (บัตรประชาชน / พาสปอร์ต), เลขบัตร, เบอร์โทร, อีเมล, จุดรับ
- **Validation** (inline Thai errors, clears on input):
  - ชื่อ / นามสกุล: required
  - เลขบัตรประชาชน: required + exactly 13 digits
  - เบอร์โทร: required + 9–10 digits
  - อีเมล: optional + format check
- Proceeds → `/review`

### 3.5 Review (`/review`)

- Summary card: route, date/time, bus type, seats, passengers, price breakdown
- Total = pricePerSeat × paxCount
- Confirm → `/payment`

### 3.6 Payment (`/payment`)

- Payment method tabs: บัตรเครดิต/เดบิต · QR Code PromptPay · Counter Service
- **Card validation** (only for card method):
  - ชื่อบนบัตร: required
  - หมายเลขบัตร: exactly 16 digits
  - MM/YY: valid format + not expired
  - CVV: 3–4 digits
- QR and Counter methods skip validation entirely
- On confirm: generates `bookingNo` (e.g. `BKS-AB3X7K`), writes final draft → `/confirmation`

### 3.7 Confirmation (`/confirmation`)

- Displays booking number, route, date, seats, passengers, total paid
- "กลับหน้าหลัก" button

### 3.8 Login (`/login`) & Register (`/register`)

- Mock auth: stores `bks_user` in localStorage
- Login redirects to previous page or home

### 3.9 Profile (`/profile`)

- Shows logged-in user info
- **การจองของฉัน** section: reads `bks_booking_draft`; if the draft has a `bookingNo`, `passengers`, and `seats`, it prepends it as a real ticket above mock upcoming bookings
- Ticket modal: shows per-passenger seat/price breakdown

---

## 4. Backoffice

Admin login stores `bks_admin = { name, role }`. Role `"super_admin"` unlocks member editing.

### 4.1 Login (`/backoffice/login`)

- Credential-free mock login; sets `bks_admin` in localStorage

### 4.2 Layout (`/backoffice/(admin)/layout.tsx`)

- Left sidebar (dark `#0f1260`), top bar with page title and "หน้าลูกค้า" link
- Nav items: แดชบอร์ด · เที่ยวรถ · การจอง · เส้นทาง · **รออนุมัติ** (badge) · **สมาชิกทั้งหมด** · ตั้งค่า
- Pending badge on "รออนุมัติ": live count computed from `MOCK_MEMBERS` + `bks_member_overrides`
- Active detection scoped correctly so "รออนุมัติ" and "สมาชิกทั้งหมด" don't conflict

### 4.3 Dashboard (`/backoffice/dashboard`)

- KPI cards: รายได้วันนี้, การจองวันนี้, เที่ยวรถวันนี้, สมาชิกรอตรวจสอบ
- Recent trips and booking activity

### 4.4 Trips (`/backoffice/trips`)

- Table: date, route, type, seats sold/total, status badge, revenue
- Status values: กำหนดการ / กำลังดำเนินการ / เสร็จสิ้น / ยกเลิก
- Filter by status; search by route/destination

**Trip Detail** (`/backoffice/trips/[id]`)

- Trip summary header
- Passenger manifest table: booking ID, name, seats, payment method, status, member type

### 4.5 Bookings (`/backoffice/bookings`)

- All bookings across all trips
- Search + filter by status

### 4.6 Routes (`/backoffice/routes`)

- Route list with origin, destination, distance, bus types, active status

### 4.7 Members — Pending Queue (`/backoffice/members/pending`)

- Shows only `status === "pending"` members
- FIFO sort: oldest `submittedAt` first
- Columns: #, ชื่อ-นามสกุล / อีเมล, ประเภทสมาชิก, วันที่ยื่น, เอกสารที่ต้องการ, ตรวจสอบ button
- Empty state when queue is clear
- Clicking any row → member detail page

### 4.8 Members — All (`/backoffice/members`)

- Full member list with type and status filters (tab pills with counts), search, CSV export
- Summary cards: สมาชิกทั้งหมด, รอตรวจสอบ, ใกล้หมดอายุ
- Expiry warning banner when any approved member expires within `reminderDays`
- Clicking a row → member detail page

### 4.9 Member Detail (`/backoffice/members/[id]`)

- Info card: name, member type badge, status badge, email/phone/submitted date/document
- Approve/Reject for `pending` or `rejected` members:
  - **อนุมัติ** modal: set expiry date (if type has expiry), set discount % (if type needs doc)
  - **ไม่อนุมัติ** modal: required rejection reason text
- **แก้ไขข้อมูลสมาชิก** card (super_admin only): toggle edit mode to change memberType, status, expiryDate, discountPercent; every save recorded in audit log with field-level diff
- Document viewer: styled mock card rendered per member type (employee / official / senior / student / disabled)
- Audit log: full history of all actions, newest-first, with action-specific icons

### 4.10 Settings — Discounts (`/backoffice/settings/discounts`)

- Configure default discount % per member type: พนักงาน บขส., ข้าราชการ/ทหาร, ผู้สูงอายุ, นักเรียน/นักศึกษา, ผู้พิการ
- Configure `renewalReminderDays` (days before expiry to warn)
- Saved to `bks_discount_settings`

---

## 5. Member Types & Rules

| Type | Thai label | Needs doc | Has expiry | Default discount |
|---|---|---|---|---|
| `general` | ผู้ใช้ทั่วไป | No | No | 0% |
| `employee` | พนักงาน บขส. | Yes | Yes | 50% |
| `official` | ข้าราชการ/ทหาร | Yes | Yes | 50% |
| `senior` | ผู้สูงอายุ | Yes | No | 30% |
| `student` | เด็กนักเรียน/นักศึกษา | Yes | Yes | 30% |
| `disabled` | ผู้พิการ | Yes | Yes | 40% |

Status values: `pending` · `approved` · `rejected` · `expired`

---

## 6. State (localStorage Keys)

| Key | Contents |
|---|---|
| `bks_booking_draft` | `BookingDraft` — live booking in progress; `bookingNo` set only after payment |
| `bks_user` | `{ name, email }` — logged-in customer |
| `bks_admin` | `{ name, role }` — logged-in admin; `role === "super_admin"` for elevated access |
| `bks_member_overrides` | `Record<memberId, Partial<Member>>` — admin edits layered over `MOCK_MEMBERS` |
| `bks_audit_log` | `StoredAuditEntry[]` — append-only log of all admin actions on members |
| `bks_discount_settings` | `{ employeeDiscount, officialDiscount, seniorDiscount, studentDiscount, disabledDiscount, renewalReminderDays }` |

---

## 7. Data Libraries (`/lib`)

| File | Exports |
|---|---|
| `bookingStore.ts` | `BookingDraft`, `PassengerInfo`, `readDraft`, `writeDraft`, `generateBookingNo`, `thaiDateLong`, `buildDateStrip`, `cityOf`, `stationOf`, `paxFullName` |
| `mockMembers.ts` | `MOCK_MEMBERS` (21 members), `Member`, `MemberType`, `MemberStatus`, `AuditEntry`, label/color maps, `MEMBER_TYPE_HAS_EXPIRY`, `MEMBER_TYPE_NEEDS_DOC`, `MEMBER_TYPE_DOC_LABEL`, `isoToThai`, `isExpiringSoon`, `daysUntilExpiry` |
| `mockTrips.ts` | `MOCK_TRIPS` (12 trips), `MOCK_TRIP_PASSENGERS`, `Trip`, `TripPassenger`, `TripStatus`, `TRIP_STATUS_MAP` |

---

## 8. Conventions

- **Code in English; all UI text visible to users in Thai**
- Inline pixel font sizes (`text-[15px]`) — backoffice base is 2px larger than the original customer-portal sizes
- Error fields: `border-[#f04438]` + `focus:ring-[#f04438]`; error text via `<p className="text-[12px] text-[#f04438] mt-1">`
- Overrides pattern: read base from mock data, merge `bks_member_overrides` on top
- Audit entries appended to `bks_audit_log` with ISO timestamp rendered via `toLocaleString("th-TH")`
