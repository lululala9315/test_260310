import { useEffect, useRef } from "react";

/** 기본 스크롤 reveal 애니메이션 — IntersectionObserver 기반 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("scroll-hidden");
          entry.target.classList.add("scroll-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, ...options }
    );

    element.classList.add("scroll-hidden");
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}

/** 자식 요소들에 stagger 딜레이를 적용하는 스크롤 애니메이션 */
export function useStaggerAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll("[data-stagger]");
    children.forEach((child) => child.classList.add("scroll-hidden"));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            const delay = (options.staggerDelay || 0.1) * i;
            child.style.transitionDelay = `${delay}s`;
            child.classList.remove("scroll-hidden");
            child.classList.add("scroll-visible");
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/** 스크롤 진행도(0~1)를 반환하는 훅 — parallax/프로그레시브 전환용 */
export function useScrollProgress() {
  const ref = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      /* 요소가 뷰포트 하단에서 상단으로 지나가는 진행도 계산 */
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      progressRef.current = progress;

      element.style.setProperty("--scroll-progress", progress.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return ref;
}
