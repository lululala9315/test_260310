/**
 * 역할: 기능 소개 섹션 — iPhone 17e card-set-full-bleed 스타일 캐러셀 + 상세 교차 레이아웃
 * 주요 기능: full-bleed 스냅 스크롤 캐러셀, 인디케이터 바, 스크롤 reveal
 * 의존성: useScrollAnimation, useContent
 */
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import Hls from "hls.js";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useContent } from "../context/ContentContext";

export default function FeaturesSection() {
  const { content } = useContent();
  const features = content.features;

  return (
    <section id="features" className="pt-24 md:pt-36">
      {/* 섹션 타이틀 + 캐러셀 + 상세 기능 1 — 흰색 배경 */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionTitle title={features.title} />
      </div>

      <HighlightCarousel items={features.items} />

      {features.items[0] && (
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mt-24 md:mt-[180px]">
          <FeatureDetail feature={features.items[0]} />
        </div>
      )}

      {/* 상세 기능 2부터 #F5F5F7 배경 시작 — 그라데이션은 비디오 아래 flow에 배치 */}
      {features.items[1] && (
        <div style={{ backgroundColor: "#F5F5F7", marginTop: "clamp(96px, 12vw, 180px)" }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-24 md:pt-[180px]">
            <FeatureDetail feature={features.items[1]} animated={false} />
          </div>
          {/* 그라데이션 — 비디오 아래, 오버레이 아님 */}
          <div
            style={{
              height: "120px",
              background: "linear-gradient(to bottom, #F5F5F7, #ffffff)",
            }}
          />
        </div>
      )}
    </section>
  );
}

function SectionTitle({ title }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref}>
      <h2
        className="font-bold text-neo-dark leading-tight"
        style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em" }}
      >
        {title}
      </h2>
    </div>
  );
}

const AUTOPLAY_DURATION = 6250; // Apple 원본: 6.25s

/** iPhone 17e 스타일 가로 스냅 스크롤 캐러셀 — 오토플레이 + 플레이버튼 */
function HighlightCarousel({ items }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  /* 활성 카드 변경 시 progress 애니메이션 리셋용 키 */
  const [progressKey, setProgressKey] = useState(0);
  const userScrollingRef = useRef(false);
  const timerRef = useRef(null);

  /* 스크롤 위치로 활성 인덱스 계산 */
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const inner = container.querySelector(".carousel-inner");
    if (!inner) return;
    const cards = inner.children;
    if (!cards.length) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i].querySelector(".carousel-card");
      if (!card) continue;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    setActiveIndex((prev) => {
      if (prev !== closestIndex) setProgressKey((k) => k + 1);
      return closestIndex;
    });

    /* 사용자가 손으로 스크롤 중 — 오토플레이 잠시 중지 후 재개 */
    userScrollingRef.current = true;
    clearTimeout(timerRef._scrollTimeout);
    timerRef._scrollTimeout = setTimeout(() => {
      userScrollingRef.current = false;
    }, 1200);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* 특정 인덱스로 스크롤 */
  const scrollToIndex = useCallback((index) => {
    const container = scrollRef.current;
    if (!container) return;
    const inner = container.querySelector(".carousel-inner");
    if (!inner) return;
    const card = inner.children[index]?.querySelector(".carousel-card");
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (cardRect.left - containerRect.left) -
      (containerRect.width / 2 - cardRect.width / 2);

    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, []);

  /* 오토플레이 — 6.25s마다 다음 카드로 */
  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      if (userScrollingRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length;
        scrollToIndex(next);
        setProgressKey((k) => k + 1);
        return next;
      });
    }, AUTOPLAY_DURATION);

    return () => clearInterval(id);
  }, [isPlaying, items.length, scrollToIndex]);

  return (
    <div className="mt-6 md:mt-10">
      {/* scroll-container */}
      <div ref={scrollRef} className="carousel-track">
        <div className="carousel-inner">
          {items.map((item, i) => (
            <CarouselCard key={i} item={item} isActive={activeIndex === i} />
          ))}
        </div>
      </div>

      {/* 컨트롤 바 — 플레이버튼 + dotnav progress */}
      <div className="flex items-center justify-center gap-3 mt-7">
        {/* 플레이/일시정지 버튼 */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="carousel-play-btn"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            /* 일시정지 아이콘 */
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <rect x="0" y="0" width="3.5" height="12" rx="1.5" />
              <rect x="6.5" y="0" width="3.5" height="12" rx="1.5" />
            </svg>
          ) : (
            /* 재생 아이콘 */
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <path d="M0 0 L10 6 L0 12 Z" />
            </svg>
          )}
        </button>

        {/* dotnav — 활성 dot이 확장되며 progress fill 표시 */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { scrollToIndex(i); setProgressKey((k) => k + 1); }}
              className={`carousel-dot ${activeIndex === i ? "active" : ""}`}
              aria-label={`${i + 1}번째 기능으로 이동`}
            >
              {activeIndex === i && isPlaying && (
                <span
                  key={progressKey}
                  className="carousel-dot-progress"
                  style={{ animationDuration: `${AUTOPLAY_DURATION}ms` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 캐러셀 카드 — Apple MediaCardGallery 정확한 구조 */
function CarouselCard({ item, isActive }) {
  return (
    <div className="carousel-item-container">
      <div className="carousel-card">
        {/* 이미지 — 카드 전체 배경 */}
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold"
              style={{ fontSize: "clamp(5rem, 12vw, 10rem)", color: "rgba(29,29,31,0.06)" }}
            >
              {item.title.charAt(0)}
            </span>
          </div>
        )}

        {/* caption — Apple 패럴랙스: --caption-progress 기반 translateX + opacity */}
        <div
          className={`carousel-caption ${isActive ? "carousel-caption-active" : ""}`}
          style={{
            position: "absolute",
            top: "clamp(32px, 4vw, 48px)",
            left: "clamp(32px, 4vw, 48px)",
            right: "clamp(32px, 4vw, 48px)",
          }}
        >
          <h3
            className="font-semibold whitespace-pre-line"
            style={{
              fontSize: "28px",
              lineHeight: "37px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: item.textColor || "#1D1D1F",
            }}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

/** 뷰포트 진입 시 재생되는 비디오 — HLS(.m3u8) 및 일반 mp4 모두 지원 */
function AutoPlayVideo({ src, style }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    /* HLS 스트림인 경우 hls.js로 로드, 아니면 src 직접 설정 */
    let hls = null;
    if (src.includes(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls({ autoStartLoad: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        /* Safari는 네이티브 HLS 지원 */
        video.src = src;
      }
    } else {
      video.src = src;
    }

    /* 뷰포트 진입 시 재생 */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      style={style}
      muted
      loop
      playsInline
    />
  );
}

/** 스크롤 inset 확장 애니메이션 — pill 형태에서 전체 너비로 펼쳐지면 고정 */
function VideoInset({ feature, mediaHeight }) {
  const sectionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* inset: 양쪽 20% → 0% 로 좁혀지며 확장 */
  const insetX = useTransform(scrollYProgress, [0, 0.6], [20, 0]);
  const insetY = useTransform(scrollYProgress, [0, 0.6], [8, 0]);
  /* border-radius: 1000px(pill) → 16px */
  const roundedness = useTransform(scrollYProgress, [0, 0.6], [1000, 28]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

  /* insetX가 0.5 이하가 되면 완전히 펼쳐진 것으로 보고 고정 */
  useEffect(() => {
    return insetX.on("change", (v) => {
      if (v <= 0.5) setExpanded(true);
    });
  }, [insetX]);

  const mediaStyle = { width: "100%", height: "auto", display: "block" };

  return (
    <div ref={sectionRef} style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
      <motion.div
        style={{
          clipPath: expanded ? "inset(0% 0% 0% 0% round 28px)" : clipPath,
          willChange: expanded ? "auto" : "clip-path",
        }}
        className="overflow-hidden"
      >
        {feature.video ? (
          <AutoPlayVideo src={feature.video} style={mediaStyle} />
        ) : (
          <img
            src={feature.image}
            alt={feature.title}
            style={mediaStyle}
          />
        )}
      </motion.div>
    </div>
  );
}

/** 상세 기능 미디어 — 인터렉션 없이 동일 비율로 표시 */
function PlainMedia({ feature }) {
  const mediaStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
  return (
    <div style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
      <div className="feature-media rounded-[28px] overflow-hidden bg-neo-light">
        {feature.video ? (
          <AutoPlayVideo src={feature.video} style={mediaStyle} />
        ) : feature.image ? (
          <img src={feature.image} alt={feature.title} style={mediaStyle} />
        ) : (
          /* 미디어 없을 때 플레이스홀더 */
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#E8E8ED" }}>
            <span className="font-bold" style={{ fontSize: "clamp(5rem, 12vw, 10rem)", color: "rgba(29,29,31,0.06)" }}>
              {feature.title?.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** 상세 기능 — 텍스트 + 미디어 (animated: VideoInset 애니메이션 여부) */
function FeatureDetail({ feature, animated = true, mediaHeight }) {
  const ref = useScrollAnimation();

  return (
    <div ref={ref} className="scroll-hidden">
      {/* 텍스트 — 상단 가운데 정렬 */}
      <div className="text-center mx-auto" style={{ maxWidth: "640px" }}>
        {feature.subtitle && (
          <p
            className="font-semibold text-neo-accent mb-4"
            style={{ fontSize: "0.8125rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            {feature.subtitle}
          </p>
        )}
        <h3
          className="font-bold text-neo-dark leading-tight whitespace-pre-line"
          style={{ fontSize: "clamp(1.875rem, 3.5vw, 3rem)", letterSpacing: "-0.03em" }}
        >
          {feature.headline}
        </h3>
        <p
          className="text-neo-gray mt-4 leading-relaxed mx-auto whitespace-pre-line"
          style={{ fontSize: "1.0625rem", maxWidth: "560px" }}
        >
          {feature.description}
        </p>

      </div>

      {/* 미디어 — animated: pill 확장 애니메이션 / plain: 그대로 표시 */}
      {animated
        ? (feature.video || feature.image) && <VideoInset feature={feature} mediaHeight={mediaHeight} />
        : <PlainMedia feature={feature} />
      }
    </div>
  );
}
