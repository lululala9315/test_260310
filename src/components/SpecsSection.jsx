/**
 * 역할: 스펙 섹션 — stats-default 스타일 (21st.dev/r/meschacirung/stats-default)
 * 주요 기능: 중앙 타이틀 + divide 그리드 스탯 레이아웃
 * 의존성: useContent
 */
import { useContent } from "../context/ContentContext";

export default function SpecsSection() {
  const { content } = useContent();
  const specs = content.specs;

  return (
    <section id="specs" className="py-12 md:py-20 font-sans">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">

        {/* 타이틀 */}
        <div className="relative z-10 mx-auto max-w-xl space-y-4 text-center">
          <h2
            className="font-bold text-neo-dark leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em" }}
          >
            {specs.title}
          </h2>
        </div>

        {/* 스탯 그리드 — divide 스타일 */}
        <div className="grid gap-12 divide-y *:text-center md:grid-cols-4 md:gap-2 md:divide-x md:divide-y-0 divide-neo-border">
          {specs.items.map((spec, i) => (
            <div key={i} className="space-y-3 py-6 md:py-0 md:px-6">
              <div
                className="font-bold text-neo-dark leading-none font-sans"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", letterSpacing: "-0.04em", fontFamily: "var(--font-family-sans)" }}
              >
                {spec.value}
                <span className="text-neo-gray" style={{ fontSize: "0.45em", fontWeight: 500 }}>
                  {spec.unit}
                </span>
              </div>
              <p className="text-neo-gray text-sm">{spec.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
