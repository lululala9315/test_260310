/**
 * 역할: 구독 신청 모달 — 플랜 선택 포함/미포함 두 가지 뷰
 * 주요 기능: 배경 클릭·닫기 버튼 클로즈, 플랜 카드 재사용, 폼 입력
 * 의존성: useModal, useContent, motion/react, lucide-react
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { useModal } from "../context/ModalContext";
import { useContent } from "../context/ContentContext";

/** 가격 카운트업 (PricingSection과 동일) */
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

export default function SubscribeModal() {
  const { open, showPlans, closeModal } = useModal();
  const { content } = useContent();
  const pricing = content.pricing;

  const [isYearly, setIsYearly] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /** 구독 시작하기 클릭 — 모달 닫고 이미지 팝업 표시 후 자동 소멸 */
  const handleSubscribe = () => {
    closeModal();
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 1000);
  };
  const defaultActive = pricing.plans.findIndex((p) => p.recommended);
  const [activePlan, setActivePlan] = useState(defaultActive >= 0 ? defaultActive : 0);

  /* 슬라이딩 하이라이트 */
  const cardRefs = useRef([]);
  const [highlight, setHighlight] = useState({ top: 0, height: 0 });

  const updateHighlight = useCallback(() => {
    const el = cardRefs.current[activePlan];
    if (el) setHighlight({ top: el.offsetTop, height: el.offsetHeight });
  }, [activePlan]);

  useEffect(() => { updateHighlight(); }, [updateHighlight, activePlan, open]);
  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  /* ESC 키로 닫기 */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  /* 모달 열릴 때 스크롤 잠금 */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
    {/* 구독 확인 이미지 팝업 */}
    <AnimatePresence>
      {showConfirm && (
        <motion.div
          key="confirm-popup"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShowConfirm(false)}
          style={{
            position: "fixed", inset: 0,
            zIndex: 20000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            cursor: "pointer",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}8395d998311eb1d7f5d77f888bc3c892.jpg`}
            alt="구독 완료"
            style={{
              maxWidth: "min(480px, 90vw)",
              maxHeight: "80dvh",
              borderRadius: "20px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
              objectFit: "contain",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {open && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 10000,
            }}
          />

          {/* 모달 센터 래퍼 — transform 충돌 방지를 위해 센터링과 애니메이션 분리 */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              pointerEvents: "none",
            }}
          >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              pointerEvents: "auto",
              width: showPlans ? "min(520px, calc(100vw - 48px))" : "min(440px, calc(100vw - 48px))",
              maxHeight: "calc(100dvh - 48px)",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "28px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              padding: "28px",
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            {/* 헤더 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1D1D1F", letterSpacing: "-0.03em" }}>
                {showPlans ? "나에게 맞는 플랜" : "구독 시작하기"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#F5F5F7",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={16} color="#6E6E73" />
              </button>
            </div>

            {showPlans ? (
              /* ── 플랜 포함 뷰 ── */
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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

                        <div className="mt-2 flex items-baseline gap-0.5">
                          <span
                            className="font-bold text-neo-dark"
                            style={{ fontSize: "clamp(1.4rem, 3vw, 1.75rem)", letterSpacing: "-0.03em" }}
                          >
                            ₩<CountUpPrice value={displayPrice} />
                          </span>
                          <span className="text-sm text-slate-400 ml-1">/월</span>
                        </div>

                        <div className="mt-3 flex flex-col gap-1.5">
                          {plan.features.map((feature, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <Check
                                className="size-3 flex-shrink-0"
                                style={{ color: activePlan === i ? "#E8622C" : "#cbd5e1" }}
                                strokeWidth={2.5}
                              />
                              <span className="text-xs text-slate-600 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* 슬라이딩 하이라이트 */}
                  <div
                    className="absolute left-0 right-0 border-2 border-neo-dark rounded-2xl pointer-events-none"
                    style={{
                      top: `${highlight.top}px`,
                      height: `${highlight.height}px`,
                      transition: "top 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>

                {/* CTA 버튼 */}
                <motion.button
                  className="rounded-full bg-neo-dark text-white text-base font-semibold w-full py-3.5"
                  whileHover={{ scale: 1.02, backgroundColor: "#2E2E2E" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubscribe}
                  style={{ transition: "background-color 0.2s", border: "none", cursor: "pointer" }}
                >
                  구독 시작하기
                </motion.button>
              </div>
            ) : (
              /* ── 플랜 미포함 뷰 — 간단 신청 폼 ── */
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ fontSize: "14px", color: "#6E6E73", lineHeight: 1.6 }}>
                  아래 정보를 입력하시면 담당자가 연락드립니다.
                </p>

                {[
                  { label: "이름", placeholder: "홍길동", type: "text" },
                  { label: "이메일", placeholder: "hello@example.com", type: "email" },
                  { label: "연락처", placeholder: "010-0000-0000", type: "tel" },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#6E6E73", marginBottom: "6px" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        fontSize: "14px",
                        color: "#1D1D1F",
                        background: "#FAFAFA",
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                ))}

                <motion.button
                  className="rounded-full bg-neo-dark text-white text-base font-semibold w-full py-3.5"
                  whileHover={{ scale: 1.02, backgroundColor: "#2E2E2E" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ transition: "background-color 0.2s", border: "none", cursor: "pointer", marginTop: "4px" }}
                >
                  신청하기
                </motion.button>
              </div>
            )}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
