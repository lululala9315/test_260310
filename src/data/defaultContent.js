/**
 * 역할: 랜딩페이지 전체 콘텐츠 기본값 정의
 * 주요 기능: Hero, Features, Specs, Pricing, CTA, Footer 텍스트·이미지 데이터
 * 의존성: 없음
 */
const defaultContent = {
  hero: {
    title: "NEO Home",
    subtitle: "당신의 집, 다시 설계됩니다.",
    ctaText: "지금 시작하기",
    linkText: "더 알아보기",
    priceText: "월 ₩390,000부터 시작",
    image: "/ba6083f5add3b381b4034a9176609e92e75e29ec-1100x655.avif",
    imageAlt: "NEO 휴머노이드 로봇",
  },

  features: {
    title: "NEO가 하는 일.",
    subtitle: "NEO는 가사의 모든 영역에서 인간처럼 움직입니다.",
    items: [
      {
        title: "매일, 완벽하게.",
        textColor: "#1D1D1F",
        headline: "청소는 NEO가.\n당신은 쉬세요.",
        subtitle: "자율 청소",
        description: "바닥 청소, 정리정돈, 세탁 관리까지.\nNEO가 매일 집을 최상의 상태로 유지합니다.",
        image: "",
        video: "",
      },
      {
        title: "주방까지 함께.",
        textColor: "#1D1D1F",
        headline: "요리의 번거로움,\nNEO가 덜어냅니다.",
        subtitle: "주방 보조",
        description: "식재료 손질부터 간단한 조리, 설거지까지.\n주방에서도 NEO가 옆에 있습니다.",
        image: "",
        video: "",
      },
      {
        title: "항상 곁에.",
        textColor: "#1D1D1F",
        headline: "소중한 가족을\n24시간 지킵니다.",
        subtitle: "돌봄 모니터링",
        description: "아이와 반려동물의 안전을 실시간으로 파악하고,\n위험 상황을 즉시 알립니다.",
        image: "",
        video: "",
      },
      {
        title: "쓸수록 똑똑하게.",
        textColor: "#1D1D1F",
        headline: "당신의 집을 배웁니다.\n매일 더 정확하게.",
        subtitle: "AI 개인화",
        description: "생활 패턴을 학습해 우리 집에 최적화됩니다.\n사용할수록 더 나은 NEO.",
        image: "",
        video: "",
      },
    ],
  },

  specs: {
    title: "숫자로 보는 NEO.",
    items: [
      { value: "166", unit: "cm", label: "신장" },
      { value: "30", unit: "kg", label: "무게" },
      { value: "8", unit: "시간", label: "연속 작동" },
      { value: "40", unit: "dB", label: "작동 소음" },
    ],
  },

  pricing: {
    title: "나에게 맞는 플랜.",
    subtitle: "구매 없이 구독으로. 언제든 바꾸거나 해지할 수 있습니다.",
    footnote: "로봇 직접 구매 시 약 3억 원. 구독은 월 39만 원부터.",
    image: "",
    plans: [
      {
        name: "Light",
        yearlyPrice: "3,744,000",
        description: "기본적인 청소 서비스",
        recommended: false,
        features: ["주 3회 파견", "청소 전용", "1회 4시간 운용"],
      },
      {
        name: "Standard",
        yearlyPrice: "5,664,000",
        description: "가장 인기 있는 선택",
        recommended: true,
        features: ["주 5회 파견", "청소 + 요리 보조", "1회 6시간 운용", "긴급 호출 월 2회"],
      },
      {
        name: "Pro",
        yearlyPrice: "8,544,000",
        description: "완전한 가사 자동화",
        recommended: false,
        features: ["매일 파견", "전체 가사 서비스", "1회 10시간 운용", "긴급 호출 무제한", "전담 매니저 포함"],
      },
    ],
  },

  cta: {
    title: "집안일에서 해방되세요.\n진짜 여유가 시작됩니다.",
    subtitle: "첫 달 무료. 약정 없음. 언제든 해지 가능.",
    buttonText: "지금 시작하기",
    linkText: "더 알아보기",
    image: "",
    image2: "",
    image3: "",
  },

  footer: {
    companyName: "NEO Home Inc.",
    year: "2026",
  },
};

export default defaultContent;
