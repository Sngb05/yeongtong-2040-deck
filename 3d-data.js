window.YEONGTONG_3D_DATA = {
  meta: {
    title: "3D Strategy Map",
    subtitle: "경량 3D 도시계획 전략지도",
    notice: "본 지도는 영통생활권 전략 검토를 위한 개념도이며, 실제 건물 높이·용적률·사업 경계를 재현한 것이 아닙니다.",
    heightNotice: "3D 높이와 색상은 공간 구조와 기능 구분을 돕기 위한 시각화 요소입니다.",
    kpi: [
      { label: "현재 상주인구", value: "22.4만 명" },
      { label: "2040 공식계획", value: "24.3만 명" },
      { label: "계획 유지 기준값", value: "1.9만 명" }
    ]
  },
  palette: {
    mangpo: 0x087a46,
    yeongtong: 0x1f2f3b,
    maetan: 0xd47a00,
    base: 0xdce7f3,
    road: 0xe9eef7,
    transit: 0x35c46a,
    station: 0x7df0a4,
    renewal: 0xf59e0b,
    industry: 0x0f1720,
    soc: 0x2f7fc1,
    park: 0x74c69d,
    risk: 0xd63b3b
  },
  subareaLabels: [
    { label: "망포권", x: 250, y: 452, tone: "green" },
    { label: "영통권", x: 470, y: 315, tone: "black" },
    { label: "매탄권", x: 248, y: 230, tone: "amber" }
  ],
  stations: [
    { label: "망포권 역세권", x: 250, y: 420, radius: 54 },
    { label: "영통권 역세권", x: 420, y: 352, radius: 56 },
    { label: "청명·영통축", x: 505, y: 268, radius: 60 }
  ],
  axes: [
    { label: "수인분당선 생활축", from: [188, 458], to: [560, 260], color: "transit", width: 0.045 },
    { label: "망포-영통 연계축", from: [220, 430], to: [430, 340], color: "road", width: 0.055 },
    { label: "매탄-영통 접점축", from: [230, 230], to: [515, 245], color: "industry", width: 0.05 },
    { label: "녹지·보행 회복축", from: [170, 420], to: [470, 360], color: "park", width: 0.04 }
  ],
  parks: [
    { label: "망포 생활녹지", x: 205, y: 468, rx: 52, ry: 26 },
    { label: "영통 보행녹지", x: 458, y: 352, rx: 72, ry: 24 },
    { label: "매탄 생활녹지", x: 230, y: 318, rx: 58, ry: 28 }
  ],
  massingClusters: [
    {
      label: "망포권 주거·생활SOC",
      x: 240,
      y: 438,
      radiusX: 72,
      radiusY: 48,
      count: 24,
      minHeight: 0.22,
      maxHeight: 1.35,
      use: "residential",
      tone: "mangpo"
    },
    {
      label: "망포권 가족수요 보완",
      x: 325,
      y: 440,
      radiusX: 54,
      radiusY: 42,
      count: 14,
      minHeight: 0.16,
      maxHeight: 0.85,
      use: "soc",
      tone: "soc"
    },
    {
      label: "영통권 역세권 복합",
      x: 445,
      y: 334,
      radiusX: 94,
      radiusY: 62,
      count: 28,
      minHeight: 0.3,
      maxHeight: 1.55,
      use: "mixed",
      tone: "yeongtong"
    },
    {
      label: "영통권 산업-주거 접점",
      x: 498,
      y: 235,
      radiusX: 76,
      radiusY: 50,
      count: 20,
      minHeight: 0.2,
      maxHeight: 1.05,
      use: "industry",
      tone: "industry"
    },
    {
      label: "매탄권 정비·관리 검토",
      x: 254,
      y: 266,
      radiusX: 86,
      radiusY: 70,
      count: 30,
      minHeight: 0.18,
      maxHeight: 1.05,
      use: "renewal",
      tone: "maetan"
    },
    {
      label: "매탄권 저층·생활권 보완",
      x: 266,
      y: 160,
      radiusX: 54,
      radiusY: 34,
      count: 12,
      minHeight: 0.12,
      maxHeight: 0.62,
      use: "lowrise",
      tone: "maetan"
    }
  ],
  planningLayers: [
    { label: "역세권 영향권 링", tone: "green", text: "접근성 기반 조건부 검토 범위" },
    { label: "정비·관리 검토권역", tone: "amber", text: "노후주거·생활SOC 보완을 함께 검토" },
    { label: "산업-주거 기능 접점", tone: "black", text: "삼성전자 중심 직주근접 구조" },
    { label: "SOC 보완축", tone: "blue", text: "인구 수용 전제 조건으로 제시" }
  ],
  viewPoints: {
    overview: {
      label: "전체",
      camera: [0, 9.2, 12.5],
      target: [0.2, 0, 0.15],
      copy: "8개 행정동과 3대 권역을 한 번에 보는 전략 개념도"
    },
    transit: {
      label: "역세권",
      camera: [2.9, 6.8, 8.2],
      target: [1.2, 0, 1.0],
      copy: "역세권 링은 접근성 검토 범위이며 확정 사업경계가 아님"
    },
    renewal: {
      label: "정비",
      camera: [-2.7, 6.7, 7.2],
      target: [-2.4, 0, 1.2],
      copy: "매탄권의 정비·관리 검토는 기반시설 보완과 묶어서 판단"
    },
    interface: {
      label: "접점/SOC",
      camera: [5.2, 6.5, 5.9],
      target: [3.2, 0, 1.6],
      copy: "산업-주거 접점과 SOC 보완축이 조건부 수용의 핵심 전제"
    }
  }
};
