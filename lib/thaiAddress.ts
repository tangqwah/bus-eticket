export type SubDistrict = { name: string; post_code: string };
export type District = { name: string; sub_districts: SubDistrict[] };
export type Province = { name: string; districts: District[] };

export const THAI_PROVINCES: Province[] = [
  {
    name: "กรุงเทพมหานคร",
    districts: [
      {
        name: "ดอนเมือง",
        sub_districts: [
          { name: "ดอนเมือง", post_code: "10210" },
          { name: "สีกัน", post_code: "10210" },
          { name: "สนามบิน", post_code: "10210" },
        ],
      },
      {
        name: "ลาดกระบัง",
        sub_districts: [
          { name: "ลาดกระบัง", post_code: "10520" },
          { name: "คลองสาม", post_code: "10520" },
          { name: "ขุมทอง", post_code: "10520" },
        ],
      },
      {
        name: "พระโขนง",
        sub_districts: [
          { name: "บางจาก", post_code: "10260" },
        ],
      },
      {
        name: "บึงกุ่ม",
        sub_districts: [
          { name: "คลองกุ่ม", post_code: "10230" },
          { name: "นวมินทร์", post_code: "10230" },
        ],
      },
    ],
  },
  {
    name: "เชียงใหม่",
    districts: [
      {
        name: "เมืองเชียงใหม่",
        sub_districts: [
          { name: "ศรีภูมิ", post_code: "50200" },
          { name: "พระสิงห์", post_code: "50200" },
          { name: "หายยา", post_code: "50100" },
          { name: "ช้างเผือก", post_code: "50300" },
        ],
      },
      {
        name: "สันทราย",
        sub_districts: [
          { name: "สันทรายหลวง", post_code: "50210" },
          { name: "สันทรายน้อย", post_code: "50210" },
        ],
      },
      {
        name: "หางดง",
        sub_districts: [
          { name: "หางดง", post_code: "50230" },
          { name: "หนองแก๋ว", post_code: "50230" },
        ],
      },
    ],
  },
  {
    name: "ขอนแก่น",
    districts: [
      {
        name: "เมืองขอนแก่น",
        sub_districts: [
          { name: "ในเมือง", post_code: "40000" },
          { name: "สาวะถี", post_code: "40000" },
          { name: "บ้านทุ่ม", post_code: "40000" },
        ],
      },
      {
        name: "บ้านฝาง",
        sub_districts: [
          { name: "บ้านฝาง", post_code: "40270" },
          { name: "ป่าหวายนั่ง", post_code: "40270" },
        ],
      },
    ],
  },
  {
    name: "ภูเก็ต",
    districts: [
      {
        name: "เมืองภูเก็ต",
        sub_districts: [
          { name: "ตลาดใหญ่", post_code: "83000" },
          { name: "ตลาดเหนือ", post_code: "83000" },
          { name: "เกาะแก้ว", post_code: "83000" },
        ],
      },
      {
        name: "ถลาง",
        sub_districts: [
          { name: "เทพกระษัตรี", post_code: "83110" },
          { name: "ศรีสุนทร", post_code: "83110" },
          { name: "ป่าคลอก", post_code: "83110" },
        ],
      },
    ],
  },
  {
    name: "นครราชสีมา",
    districts: [
      {
        name: "เมืองนครราชสีมา",
        sub_districts: [
          { name: "ในเมือง", post_code: "30000" },
          { name: "โพธิ์กลาง", post_code: "30000" },
          { name: "หนองระเวียง", post_code: "30000" },
        ],
      },
      {
        name: "โชคชัย",
        sub_districts: [
          { name: "โชคชัย", post_code: "30190" },
          { name: "กระโทก", post_code: "30190" },
        ],
      },
    ],
  },
  {
    name: "สงขลา",
    districts: [
      {
        name: "เมืองสงขลา",
        sub_districts: [
          { name: "บ่อยาง", post_code: "90000" },
          { name: "เขารูปช้าง", post_code: "90000" },
        ],
      },
      {
        name: "หาดใหญ่",
        sub_districts: [
          { name: "หาดใหญ่", post_code: "90110" },
          { name: "คอหงส์", post_code: "90110" },
          { name: "คลองแห", post_code: "90110" },
        ],
      },
    ],
  },
];

export function getDistricts(provinceName: string): District[] {
  return THAI_PROVINCES.find(p => p.name === provinceName)?.districts ?? [];
}

export function getSubDistricts(provinceName: string, districtName: string): SubDistrict[] {
  return getDistricts(provinceName).find(d => d.name === districtName)?.sub_districts ?? [];
}

export function getPostCode(provinceName: string, districtName: string, subDistrictName: string): string {
  return getSubDistricts(provinceName, districtName).find(s => s.name === subDistrictName)?.post_code ?? "";
}
