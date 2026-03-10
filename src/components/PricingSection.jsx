/**
 * 역할: 구독 플랜 섹션 — 1x.tech/order 스타일 6:4 스플릿 레이아웃 + pricing-interaction 라디오 선택
 * 주요 기능: 이미지(6) + 플랜 선택 카드(4), 월간/연간 토글, 슬라이딩 하이라이트, 말풍선 CTA
 * 의존성: useContent, motion/react, lucide-react
 * 참고: yearlyPrice 기준 — 연간: yearlyPrice/12, 월간: yearlyPrice/12/0.8
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useModal } from "../context/ModalContext";

/** 카운트업 애니메이션 — 값 변경 시 이전 값에서 새 값으로 부드럽게 카운트 */
function CountUpPrice({ value }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;

    const duration = 500;
    const startTime = performance.now();

    cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      /* easeOutCubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
        setDisplay(end);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display.toLocaleString("ko-KR")}</>;
}

export default function PricingSection() {
  const { content } = useContent();
  const pricing = content.pricing;
  const hero = content.hero;

  const { openModal } = useModal();
  const [isYearly, setIsYearly] = useState(false);
  const defaultActive = pricing.plans.findIndex((p) => p.recommended);
  const [activePlan, setActivePlan] = useState(defaultActive >= 0 ? defaultActive : 0);

  /* 슬라이딩 하이라이트 동적 위치 계산 */
  const cardRefs = useRef([]);
  const [highlight, setHighlight] = useState({ top: 0, height: 0 });

  const updateHighlight = useCallback(() => {
    const el = cardRefs.current[activePlan];
    if (el) setHighlight({ top: el.offsetTop, height: el.offsetHeight });
  }, [activePlan]);

  useEffect(() => { updateHighlight(); }, [updateHighlight, activePlan]);
  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  /* 연간 절약 금액 계산 */
  const getAnnualSaving = (plan) => {
    const yearlyTotal = parseInt((plan?.yearlyPrice || plan?.price || "0").replace(/,/g, ""));
    const yearlyMonthly = Math.round(yearlyTotal / 12);
    const monthlyPrice = Math.round(yearlyMonthly / 0.8);
    return (monthlyPrice - yearlyMonthly) * 12;
  };

  const imageSrc = pricing.image || hero.image;

  return (
    <section id="pricing" className="py-24 md:py-36 font-sans">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-16">

        {/* 섹션 타이틀 */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2
            className="font-bold text-neo-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em" }}
          >
            {pricing.title}
          </h2>
          <p className="text-neo-gray text-lg">{pricing.subtitle}</p>
        </motion.div>

        {/* 6:4 스플릿 레이아웃 — stretch로 이미지가 카드 높이에 맞게 채워짐 */}
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-10 lg:gap-14 items-stretch">

          {/* 왼쪽(6): 이미지 — 우측 카드 높이만큼 채움 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1 min-h-[300px]"
          >
            {imageSrc && (
              <img
                src={imageSrc}
                alt={hero.imageAlt}
                className="w-full h-full rounded-[28px] object-cover object-center"
              />
            )}
          </motion.div>

          {/* 오른쪽(4): 플랜 선택 카드 + 각주 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="order-1 lg:order-2 flex flex-col gap-4"
          >
            {/* 플랜 카드 */}
            <div className="border border-gray-100 rounded-[28px] p-4 flex flex-col gap-3 bg-white">

              {/* 월간/연간 토글 */}
              <div className="rounded-full relative w-full bg-slate-100 p-1.5 flex items-center">
                <button
                  className="font-semibold rounded-full w-full py-2 text-slate-800 z-20 text-sm cursor-pointer"
                  onClick={() => setIsYearly(false)}
                >
                  월간
                </button>
                <button
                  className="font-semibold rounded-full w-full py-2 text-slate-800 z-20 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => setIsYearly(true)}
                >
                  연간
                  <span className="text-xs bg-orange-100 text-neo-accent px-2 py-0.5 rounded-full font-medium">
                    20% 할인
                  </span>
                </button>
                {/* 슬라이딩 pill */}
                <div
                  className="p-1.5 flex items-center justify-center absolute inset-0 w-1/2 z-10 pointer-events-none"
                  style={{
                    transform: `translateX(${isYearly ? 100 : 0}%)`,
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="bg-white shadow-sm rounded-full w-full h-full" />
                </div>
              </div>

              {/* 플랜 목록 */}
              <div className="relative flex flex-col gap-2.5">
                {pricing.plans.map((plan, i) => {
                  const yearlyTotal = parseInt((plan.yearlyPrice || plan.price || "0").replace(/,/g, ""));
                  const yearlyMonthly = Math.round(yearlyTotal / 12);
                  const monthlyPrice = Math.round(yearlyMonthly / 0.8);
                  const displayPrice = isYearly ? yearlyMonthly : monthlyPrice;

                  return (
                    <div
                      key={i}
                      ref={(el) => (cardRefs.current[i] = el)}
                      className="w-full cursor-pointer border border-gray-100 px-4 py-4 rounded-2xl"
                      onClick={() => setActivePlan(i)}
                    >
                      {/* 플랜명 + 라디오 */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-base text-gray-900">{plan.name}</p>
                          {plan.recommended && (
                            <span className="py-0.5 px-2 rounded-lg bg-orange-100 text-neo-accent text-xs font-medium">
                              인기
                            </span>
                          )}
                        </div>
                        <div
                          className="border-2 size-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{
                            borderColor: activePlan === i ? "#1D1D1F" : "#cbd5e1",
                            transition: "border-color 0.25s",
                          }}
                        >
                          <div
                            className="size-2.5 bg-neo-dark rounded-full"
                            style={{
                              opacity: activePlan === i ? 1 : 0,
                              transform: activePlan === i ? "scale(1)" : "scale(0.4)",
                              transition: "opacity 0.25s, transform 0.25s",
                            }}
                          />
                        </div>
                      </div>

                      {/* 가격 — 카운트업 애니메이션 */}
                      <div className="mt-2 flex items-baseline gap-0.5">
                        <span
                          className="font-bold text-neo-dark"
                          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.03em" }}
                        >
                          ₩<CountUpPrice value={displayPrice} />
                        </span>
                        <span className="text-sm text-slate-400 ml-1">/월</span>
                      </div>

                      {/* 기능 목록 — 상시 노출, font-medium */}
                      <div className="mt-3 flex flex-col gap-1.5">
                        {plan.features.map((feature, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Check className="size-3 flex-shrink-0" style={{ color: activePlan === i ? "#E8622C" : "#cbd5e1" }} strokeWidth={2.5} />
                            <span className="text-xs text-slate-600 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* 슬라이딩 하이라이트 테두리 */}
                <div
                  className="absolute left-0 right-0 border-2 border-neo-dark rounded-2xl pointer-events-none"
                  style={{
                    top: `${highlight.top}px`,
                    height: `${highlight.height}px`,
                    transition: "top 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>

              {/* CTA 버튼 — 말풍선이 우측 상단에 절대 위치 */}
              <div className="relative">
                <AnimatePresence>
                  {isYearly && (
                    <motion.div
                      key="bubble"
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10"
                    >
                      {/* 꼬리 — 상단 센터 (버튼 방향) */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -top-[7px]"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderBottom: "7px solid white",
                          filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.04))",
                        }}
                      />
                      {/* 말풍선 본체 */}
                      <div className="bg-white text-neo-dark text-xs font-semibold px-3 py-2 rounded-xl shadow-md whitespace-nowrap">
                        연간 구독 시 <span style={{ color: "#E8622C" }}>₩{getAnnualSaving(pricing.plans[activePlan]).toLocaleString("ko-KR")}</span> 절약 🎉
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={() => openModal(false)}
                  className="rounded-full bg-neo-dark text-white text-base font-semibold w-full py-3.5 text-center block"
                  whileHover={{ scale: 1.02, backgroundColor: "#2E2E2E" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ transition: "background-color 0.2s", border: "none", cursor: "pointer" }}
                >
                  구독 시작하기
                </motion.button>
              </div>
            </div>

            {/* 각주 — 카드 바로 아래 */}
            <p className="text-xs text-neo-gray px-1">{pricing.footnote}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
