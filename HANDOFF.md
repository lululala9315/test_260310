# HANDOFF.md — NEO Home Landing Page

> 작성일: 2026-03-09
> 최종 수정: 2026-03-09 (세션 2)
> 현재 상태: **기능 구현 완료, 빌드 통과**

---

## 프로젝트 개요

**NEO Home** — 휴머노이드 로봇 가사 도우미 월 구독 서비스 랜딩페이지

- **URL**: `http://localhost:5173` (dev), `/admin` (어드민)
- **디렉토리**: `/Users/haeunlee/Desktop/claude/01/`

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| React | 19.2.0 |
| Vite | 7.x |
| Tailwind CSS | v4 (`@theme` directive, `tailwind.config.js` 없음) |
| React Router DOM | 7.x |
| 폰트 | Pretendard (CDN) |

```bash
# 개발 서버
npm run dev

# 빌드
npm run build
```

---

## 파일 구조

```
src/
├── App.jsx                      # BrowserRouter + ContentProvider 루트
├── main.jsx
├── index.css                    # 전체 커스텀 CSS (Tailwind @theme 포함)
│
├── data/
│   └── defaultContent.js        # 전체 섹션 기본 콘텐츠 데이터
│
├── context/
│   └── ContentContext.jsx        # localStorage 기반 전역 콘텐츠 상태
│
├── hooks/
│   └── useScrollAnimation.js    # IntersectionObserver 스크롤 애니메이션
│
├── pages/
│   └── LandingPage.jsx          # 섹션 조합 레이아웃
│
└── components/
    ├── Navbar.jsx
    ├── HeroSection.jsx          # Hero: 풀블리드 이미지 + F5F5F7→white 그라데이션 + Typewriter 타이틀
    ├── FeaturesSection.jsx      # 기능 소개: 캐러셀 + 상세 1개 (VideoInset + AutoPlayVideo)
    ├── SpecsSection.jsx         # 사양 숫자 스탯
    ├── PricingSection.jsx       # 구독 플랜: 스플릿 레이아웃(이미지+카드) + 라디오 선택
    ├── CtaSection.jsx           # CTA + 푸터
    ├── FloatingBar.jsx          # 스크롤 50% 후 등장하는 고정 CTA
    ├── ui/
    │   └── typewriter-text.jsx  # Typewriter 컴포넌트 (loop/cursor/isDone 지원)
    └── admin/
        ├── AdminPage.jsx        # 어드민 탭 레이아웃 + 초기화 모달
        ├── EditorField.jsx      # 공용 Field, ImageField, SaveButton 컴포넌트
        ├── HeroEditor.jsx
        ├── FeaturesEditor.jsx   # 캐러셀 카드 + 상세 기능 에디터
        ├── SpecsEditor.jsx
        ├── PricingEditor.jsx
        └── CtaEditor.jsx
```

---

## 디자인 시스템 (`src/index.css`)

### 색상 (`@theme`)
```
neo-accent:       #E8622C  (오렌지 포인트 — 가격, 라벨, 체크)
neo-accent-hover: #D4561F
neo-dark:         #1D1D1F  (주 텍스트, 버튼)
neo-dark-hover:   #2E2E2E
neo-gray:         #86868B  (보조 텍스트)
neo-light:        #F5F5F7  (배경, 카드)
neo-border:       #D2D2D7
```

### 공용 클래스
- `.btn-pill` / `.btn-pill-dark` / `.btn-pill-accent` / `.btn-pill-outline` — pill 버튼
- `.link-arrow` — Apple 스타일 화살표 링크
- `.scroll-hidden` / `.scroll-visible` — 스크롤 reveal (translateY + opacity)
- `.scroll-scale` — 스크롤 reveal (scale 0.92→1 + opacity)
- `.animate-fade-in-up` — Hero 로드 애니메이션

---

## 캐러셀 구현 (`FeaturesSection.jsx` + `index.css`)

Apple iPhone 17e "일단 핵심부터" 섹션을 레퍼런스로 구현.

### 레이아웃 간격
- **섹션 타이틀 ↔ 캐러셀**: `mt-6 md:mt-10` (모바일 24px, 데스크탑 40px)
- **캐러셀 ↔ 상세 기능**: `mt-28 md:mt-40`

### 핵심 동작
- **카드 너비**: `max(87.5vw, 280px)` — 화면 거의 꽉 참
- **높이**: 480→560→628→680→740px (반응형)
- **패딩**: 좌우 `6.25vw` (Apple `--shared-media-gallery-padding`)
- **갭**: `20px`
- **스냅**: 모바일 `scroll-snap-align: start`, 데스크탑(735px+) `center`
- **자동 재생**: 6250ms (Apple 원본 6.25s)
- **오토플레이 일시정지**: 사용자 수동 스크롤 시 1200ms 동안 중지

### 상태 구조 (`HighlightCarousel`)
```js
const [activeIndex, setActiveIndex]     // 현재 활성 카드 인덱스
const [isPlaying, setIsPlaying]         // 오토플레이 on/off
const [progressKey, setProgressKey]     // CSS dotFill 애니메이션 리셋 키
const userScrollingRef                  // 수동 스크롤 중 여부
```

### 캡션 애니메이션
```css
/* 비활성: 오른쪽에서 → 활성: 원위치 */
.carousel-caption        { opacity:0; transform:translateX(32px); transition: 0.55s 0.15s delay }
.carousel-caption-active { opacity:1; transform:translateX(0); }
```

### dotnav progress
```css
/* 활성 dot: 8px pill → 48px(모바일 32px)로 확장 */
/* 내부 fill: @keyframes dotFill 0%→100% width */
.carousel-dot-progress { animation: dotFill linear forwards; }
```

---

## 콘텐츠 관리 (`ContentContext.jsx`)

- **저장소**: `localStorage["neo-home-content"]`
- **초기화**: `defaultContent.js` (deepMerge로 구조 보장)
- **API**:
  - `content` — 현재 전체 콘텐츠 객체
  - `updateContent(section, data)` — 섹션 단위 업데이트
  - `resetContent()` — localStorage 삭제 후 기본값 복원

### features 데이터 구조
```js
features: {
  title: "일단 핵심부터.",
  items: [
    {
      title: "자율 청소 시스템.",   // 캐러셀 카드 문구 (\n 줄바꿈 지원)
      textColor: "#1D1D1F",         // 카드 텍스트 색상
      headline: "매일 깨끗한 집.\n손 하나 까딱하지 않아도.",
      description: "...",
      image: "",                     // URL 또는 base64
    },
    // ... items[1~3]
  ]
}
```

---

## 어드민 (`/admin`)

| 탭 | 에디터 | 주요 기능 |
|----|--------|-----------|
| Hero | HeroEditor | 타이틀, 서브타이틀, CTA 문구, 이미지 |
| 기능 소개 | FeaturesEditor | 캐러셀 카드 추가/삭제/수정, 색상 피커, 상세 기능 |
| 사양 | SpecsEditor | 숫자+단위+라벨 |
| 구독 플랜 | PricingEditor | 플랜명, 가격, 기능 목록 |
| CTA / 푸터 | CtaEditor | CTA 문구, 버튼, 회사명 |

**FeaturesEditor 색상 피커**: `<input type="color">` + 5개 프리셋 스와치 (#1D1D1F, #FFFFFF, #F5F5F7, #E8622C, #86868B) + HEX 값 표시

---

## 완료된 작업 이력

| 작업 | 내용 |
|------|------|
| FeaturesSection 캐러셀 | Apple iPhone 17e card-set-full-bleed 스타일 구현 |
| 카드 텍스트 스타일 | 28px / 37px line-height / `-0.02em` letter-spacing |
| 캡션 애니메이션 | 우→좌 `translateX(32px)→0`, 0.15s delay |
| 오토플레이 | 6250ms 인터벌, 플레이/일시정지 버튼 |
| dotnav | 8px→48px 확장, CSS fill progress 애니메이션 |
| Hero 이미지 | 풀블리드, `#F5F5F7→white` 하단 그라데이션 |
| 상세 기능 | `items[0]` 하나만 표시, 텍스트 상단+미디어 하단 레이아웃 |
| 어드민 FeaturesEditor | 탭형 카드 편집, 줄바꿈, 색상 피커, 동영상 URL 입력 |
| features subtitle/video | 각 항목에 `subtitle`, `video` 필드 추가 |
| 기능소개 타이틀↔캐러셀 간격 축소 | `mt-14 md:mt-20` → `mt-6 md:mt-10` |
| 캐러셀↔상세기능 간격 | `mt-24 md:mt-[180px]` |
| VideoInset 컴포넌트 | `motion/react` clip-path 스크롤 확장 (pill→full), 펼쳐지면 고정 |
| AutoPlayVideo 컴포넌트 | IntersectionObserver로 뷰포트 진입 시 `.play()` 호출 |
| 카드/미디어 비율 | iPhone 17e `--p-width/--p-height` 기반 반응형 aspect-ratio |
| Hero Typewriter | `speed=130`, 얇은 커서, 타이핑 완료 후 커서 사라짐 |
| PricingSection 전면 재설계 | 1x.tech/order 스타일 스플릿 레이아웃 (이미지+플랜 선택 카드) |
| pricing-interaction 패턴 | 월간/연간 슬라이딩 pill 토글, 라디오 선택+슬라이딩 하이라이트 |
| 플랜 기능 목록 전환 | 선택 플랜만 AnimatePresence 전환 표시 |
| 연간 절약 금액 | 연간 선택 시 height 애니메이션으로 표시 |

---

## PricingSection 구조 (세션 2 기준)

### 레이아웃
- `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16` — 이미지(왼) + 카드(오)
- 모바일: 카드 상단, 이미지 하단 (`order-2 lg:order-1`)

### 플랜 선택 카드 내부 구조
```
[월간/연간 토글] — 슬라이딩 pill 배경 (transform translateX 0↔100%)
[플랜 목록]
  - 각 카드: h-[88px], 라디오 버튼
  - 슬라이딩 하이라이트: translateY(index × (88 + 12)px) — 절대 위치
[선택 플랜 기능 목록] — AnimatePresence key=activePlan
[구독 시작하기 CTA]
[연간 절약 금액] — AnimatePresence 높이 애니메이션
```

### 상수 (슬라이더 위치 계산)
```js
const CARD_H = 88;    // 카드 고정 높이
const CARD_GAP = 12;  // gap-3 = 12px
// 슬라이더 Y = activePlan * (CARD_H + CARD_GAP)
```

---

## 미완료 / 향후 과제

- [ ] 이미지 실제 촬영본 적용 (현재 Hero만 `/ba6083f5...avif`, 나머지 빈 문자열)
- [ ] Pricing 전용 이미지 별도 설정 (현재 `hero.image` 재사용)
- [ ] FloatingBar 컴포넌트 LandingPage에 미포함 (확인 필요)
- [ ] 배포 환경 미설정 (현재 로컬 전용)

---

## 참고

- Apple CSS 레퍼런스: `/Users/haeunlee/Downloads/overview.built.css`
- 디자인 분석서: `docs/design-analysis.md`
- 마지막 빌드: 성공 (`dist/` 존재, 1.69s, 세션 2 기준)
