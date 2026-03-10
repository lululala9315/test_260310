/**
 * 역할: 최종 CTA + 푸터 — Apple shared-footer tile 스타일
 * 주요 기능: 라운드 카드 안에 텍스트(좌) + 이미지(우), 이미지 배경색 자동 추출
 * 의존성: useScrollAnimation, useContent
 */
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useContent } from "../context/ContentContext";

export default function CtaSection() {
  const ref = useScrollAnimation();
  const { content } = useContent();
  const cta = content.cta;
  const footer = content.footer;

  return (
    <>
      <section
        id="cta"
        className="relative overflow-hidden"
        style={{ backgroundColor: "#C5AC92", minHeight: "280px" }}
      >
        {/* 이미지 — 우측 절대 배치 */}
        {cta.image && (
          <div className="absolute right-0 top-0 h-full w-[50%] hidden md:block">
            <img
              src={cta.image}
              alt="CTA 이미지"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* 텍스트 — 좌측 세로 중앙 */}
        <div ref={ref} className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 py-14 md:py-20 flex items-center" style={{ minHeight: "280px" }}>
          <div className="md:max-w-[50%]">
            <h2
              className="font-bold text-neo-dark leading-tight whitespace-pre-line"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              {cta.title}
            </h2>
            <p className="text-neo-gray mt-4 leading-relaxed" style={{ fontSize: "1.0625rem" }}>
              {cta.subtitle}
            </p>
            {cta.linkText && (
              <div className="mt-6">
                <a href="#" className="text-neo-dark font-medium text-sm hover:underline underline-offset-2 flex items-center gap-1">
                  {cta.linkText} <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-neo-border/50 py-6 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neo-gray">
          <span>&copy; {footer.year} {footer.companyName}</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-neo-dark transition-colors">서비스 약관</a>
            <a href="#" className="hover:text-neo-dark transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </>
  );
}
