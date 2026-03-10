# Handoff: NEO Home Robot 랜딩페이지 (01)

> 마지막 업데이트: 2026-03-10

---

## 프로젝트 개요

**NEO Home Robot** — 휴머노이드 로봇 가사 도우미 월 구독 서비스 랜딩페이지
**기술 스택**: Vite + React 19 + Tailwind CSS v4 + motion/react + lucide-react
**개발 서버**: `cd 01 && npm run dev` → http://localhost:5173

---

## 완료된 작업

### 구독 모달 시스템 (핵심)

세 군데 CTA 버튼이 모두 모달을 트리거하도록 연결됨.

| 버튼 위치 | 버튼 텍스트 | 모달 뷰 |
|-----------|------------|---------|
| Navbar | 구독하기 | 플랜 선택 포함 (`showPlans: true`) |
| HeroSection | 지금 시작하기 | 플랜 선택 포함 (`showPlans: true`) |
| PricingSection | 구독 시작하기 | 플랜 없이 간단 신청 폼 (`showPlans: false`) |

### 새로 생성된 파일

#### `src/context/ModalContext.jsx`
- 전역 모달 상태 관리 (`open`, `showPlans`)
- `openModal(showPlans = true)` / `closeModal()` 제공
- `LandingPage` 최상단에서 `ModalProvider`로 감쌈

#### `src/components/SubscribeModal.jsx`
- 두 가지 뷰:
  - `showPlans=true`: PricingSection과 동일한 플랜 카드 UI (월간/연간 토글, 슬라이딩 하이라이트, 가격 카운트업)
  - `showPlans=false`: 이름/이메일/연락처 입력 폼
- 디폴트 선택 플랜: **Pro** (`pricing.plans.findIndex((p) => p.name === "Pro")`)
- 닫기: ESC 키 / 배경 오버레이 클릭 / X 버튼
- 열릴 때 body 스크롤 잠금
- 애니메이션: `motion.div` scale + y + opacity

### 수정된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/pages/LandingPage.jsx` | `ModalProvider` 래퍼 추가, `SubscribeModal` 마운트 |
| `src/components/Navbar.jsx` | `구독하기` → `<button>` + `openModal(true)` 연결 |
| `src/components/HeroSection.jsx` | CTA → `<button>` + `openModal(true)` 연결 |
| `src/components/PricingSection.jsx` | `구독 시작하기` → `<motion.button>` + `openModal(false)` 연결 |

---

## 주요 구현 이슈 & 해결

### 모달 센터링 — motion transform 충돌
- **문제**: `motion.div`에 CSS `translate(-50%, -50%)` 적용 시 motion의 scale/y 애니메이션이 override됨
- **해결**: 센터링 전담 wrapper div(flex) + motion.div는 애니메이션만 담당하도록 분리

```jsx
// 센터링 래퍼 (pointerEvents: none)
<div style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center" }}>
  // 애니메이션 전담 (pointerEvents: auto)
  <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} ...>
```

---

## 삭제된 기능

- **CursorTooltip** (`src/components/ui/CursorTooltip.jsx`): 버튼 호버 시 커서 따라다니는 툴팁 — 사용자 요청으로 완전 삭제

---

## 현재 섹션 구성

```
Navbar (floating pill scroll)
└── HeroSection
└── FeaturesSection
└── [SpecsSection - 주석 처리됨]
└── PricingSection
└── CtaSection
SubscribeModal (전역)
```

---

## 다음 작업 제안

- 모달 폼 제출 로직 (API 연동 또는 이메일 발송)
- 모바일 반응형 확인
- 애니메이션 최적화 (reduced-motion 대응)
