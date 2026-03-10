/**
 * 역할: Hero 섹션 — Apple MacBook Air 스타일, 대형 타이틀 + pill CTA
 * 주요 기능: 대형 타이틀, pill 라운드 버튼 CTA, 스크롤 시 이미지 reveal
 * 의존성: useScrollAnimation, useContent
 */
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useContent } from "../context/ContentContext";
import { Typewriter } from "./ui/typewriter-text";
import { useModal } from "../context/ModalContext";

export default function HeroSection() {
  const imageRef = useScrollAnimation({ threshold: 0.1 });
  const { content } = useContent();
  const hero = content.hero;
  const { openModal } = useModal();

  return (
    <section className="relative" style={{ backgroundColor: "#F5F5F7" }}>
      {/* 텍스트 영역 */}
      <div className="flex flex-col items-center px-6 pt-[16vh] pb-8">
        <p
          className="animate-fade-in-up text-center text-neo-gray font-medium"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", animationDelay: "0s" }}
        >
          {hero.subtitle}
        </p>

        <h1
          className="animate-fade-in-up text-center font-bold text-neo-dark leading-[1.05] mt-3"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.04em", animationDelay: "0.1s" }}
        >
          <Typewriter text={hero.title} speed={130} cursor="|" loop={false} />
        </h1>

        <div
          className="animate-fade-in-up mt-8"
          style={{ animationDelay: "0.2s" }}
        >
          <button onClick={() => openModal(true)} className="btn-pill btn-pill-dark" style={{ border: "none", cursor: "pointer" }}>
            {hero.ctaText}
          </button>
        </div>

        <p
          className="animate-fade-in-up text-neo-gray text-sm mt-4"
          style={{ animationDelay: "0.3s" }}
        >
          {hero.priceText}
        </p>
      </div>

      {/* 이미지 영역 — 풀 블리드, scale reveal */}
      <div ref={imageRef} className="w-full scroll-scale">
        <img
          src={hero.image}
          alt={hero.imageAlt}
          className="w-full h-auto block"
        />
      </div>

      {/* 하단 그라데이션 — #F5F5F7 → white */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(to bottom, transparent, #ffffff)",
        }}
      />
    </section>
  );
}
