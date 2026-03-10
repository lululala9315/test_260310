/**
 * 역할: 랜딩페이지 전체 콘텐츠 기본값 정의
 * 주요 기능: Hero, Features, Specs, Pricing, CTA, Footer 텍스트·이미지 데이터
 * 의존성: 없음
 */
const defaultContent = {
  hero: {
    title: "집안일의 새로운 시대.",
    subtitle: "NEO Home Robot",
    ctaText: "구독 시작하기",
    linkText: "",
    priceText: "월 ₩390,000부터",
    image: `${import.meta.env.BASE_URL}2277cb5f5952be3c4c48b5bd66cafeccddb6ed27-3665x2062.avif`, // hero
    imageAlt: "NEO 휴머노이드 로봇",
  },

  features: {
    title: "NEO가 하는 일.",
    subtitle: "NEO는 가사의 모든 영역에서 인간처럼 움직입니다.",
    items: [
      {
        title: "집안의 지루하고 단조로운 일들을 대신 처리\n당신은 당신에게 중요한 일에 집중 가능",
        textColor: "#FFFFFF",
        headline: "최신 드립\n웃으면서 배우기.",
        subtitle: "COMPANION",
        description: "질문하고 지식, 개인 맞춤형 정보 또는 유머까지 즉시 받아보세요.",
        image: `${import.meta.env.BASE_URL}bbe5409d23f3339d6dde93baef0fb8f11c1eeccb-1100x655-복사본.png`,
        video: "https://stream.mux.com/DM1B1loQuxwllFemIHB7VzNvOjK4wvjevdVEMXrPmpk.m3u8?max_resolution=1440p&min_resolution=540p&redundant_streams=true",
      },
      {
        title: "할 일 목록을 주고, \n원하는 시간을 예약해 두면 매일 더 깨끗해진 집",
        textColor: "#FFFFFF",
        headline: "집을 새롭게 바꾸기.",
        subtitle: "UTILITY",
        description: "집안의 지루하고 단조로운 일들을 대신 처리해 주므로,\n당신은 당신에게 중요한 일에 집중할 수 있습니다.",
        image: `${import.meta.env.BASE_URL}16ac313d16c3550c96e2d9432ca52b07e887ec44-1920x1080.avif`,
        video: "https://stream.mux.com/O7s2Tr00rN8VGzB7ZOw5xVX02Y8qx1UTQHnpFfjk68PwM.m3u8?max_resolution=1440p&min_resolution=540p&redundant_streams=true",
      },
      {
        title: "헤어 케어부터 생활 보조까지,\n손 하나 까딱하지 않아도 이지",
        textColor: "#FFFFFF",
        headline: "소중한 가족을\n24시간 지켜봅니다.",
        subtitle: "",
        description: "아이와 반려동물의 안전을 모니터링하고, 위험 상황을 즉시 알립니다.",
        image: `${import.meta.env.BASE_URL}ec0f8362df66c8d01103e97689223e3cc15ca2ce-2880x2160.avif`,
        video: "",
      },
      {
        title: "귀엽고 러블리한 얼굴 디자인으로\n사람과 가정환경에 적합",
        textColor: "#FFFFFF",
        headline: "사용할수록\n당신에게 최적화.",
        subtitle: "",
        description: "생활 패턴을 학습해 집에 최적화됩니다. 쓸수록 더 똑똑해지는 로봇.",
        image: `${import.meta.env.BASE_URL}f195d31c59c24f31a4168efdf28526ea9a192ace-3351x2234.avif`,
        video: "",
      },
      {
        title: "심심한 노후 생활\n귀여운 친구 만들고 힐링",
        textColor: "#FFFFFF",
        headline: "",
        subtitle: "",
        description: "",
        image: `${import.meta.env.BASE_URL}6e5bada17d498aea32c49710fbb76c4f3730d729-1600x844.avif`,
        video: "",
      },
    ],
  },

  specs: {
    title: "한눈에 보는 사양.",
    items: [
      { value: "166", unit: "cm", label: "신장" },
      { value: "30", unit: "kg", label: "무게" },
      { value: "8", unit: "시간", label: "연속 작동" },
      { value: "40", unit: "dB", label: "작동 소음" },
    ],
  },

  pricing: {
    title: "나에게 맞는 플랜.",
    subtitle: "로봇 구매 없이, 월 구독으로 시작하세요.",
    footnote: "",
    image: `${import.meta.env.BASE_URL}1054db069547b8a970273c62fa96fb6ae1818e8a-3665x2062.avif`,
    plans: [
      {
        name: "Standard",
        price: "742,000",
        yearlyPrice: "7,123,200",
        description: "기본적인 서비스",
        recommended: false,
        features: ["월간 구독", "스타터 생산성 패키지", "표준 배송"],
      },
      {
        name: "Pro",
        price: "29,740,000",
        yearlyPrice: "285,504,000",
        description: "가장 인기 있는 선택",
        recommended: true,
        features: ["3년 보증 포함 소유권", "프리미엄 지원", "우선 배송"],
      },
    ],
  },

  cta: {
    title: "당장 집안일에서 \n해방되세요.",
    subtitle: "",
    buttonText: "",
    linkText: "FAQ 알아보기",
    image: `${import.meta.env.BASE_URL}hoodie_compressed_12.avif`,
    image2: "",
    image3: "",
  },

  footer: {
    companyName: "NEO Home Inc.",
    year: "2026",
  },
};

export default defaultContent;
