/**
 * 역할: 네비게이션 — 스크롤 전 전체 너비 바 / 스크롤 후 플로팅 pill
 * 구조: 외부(배경 전체 너비) + 내부(콘텐츠 1024px 고정)
 */
import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";

const NAV_LINKS = [
  { href: "#features", label: "기능", id: "features" },
  { href: "#pricing",  label: "플랜", id: "pricing"  },
];

export default function Navbar() {
  const [floating, setFloating] = useState(false);
  const [activeId, setActiveId] = useState("features");
  const { openModal } = useModal();

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > window.innerHeight * 0.55);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis.length) {
          const top = vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActiveId(top.target.id);
        }
      },
      { threshold: 0.2, rootMargin: "-10% 0px -60% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const font = { fontFamily: "'Pretendard', sans-serif" };

  return (
    /* 외부 — 전체 너비, 비플로팅 시 배경+라인이 화면 가득 채움 */
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 9998,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: floating ? "10px 20px 0" : "0",
        boxSizing: "border-box",
        background: floating ? "transparent" : "rgba(255,255,255,0.72)",
        backdropFilter: floating ? "none" : "blur(12px)",
        WebkitBackdropFilter: floating ? "none" : "blur(12px)",
        borderBottom: floating ? "none" : "1px solid rgba(0,0,0,0.06)",
        transition: "background 0.35s ease, border-color 0.35s ease, padding 0.35s ease",
        overflow: "visible",
      }}
    >
      {/* 내부 — 1024px 고정, 플로팅 시 pill 스타일 */}
      <div
        style={{
          width: "100%",
          maxWidth: "1024px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxSizing: "border-box",
          borderRadius: floating ? "32px" : "0",
          background: floating ? "rgba(255,255,255,0.72)" : "transparent",
          backdropFilter: floating ? "blur(12px)" : "none",
          WebkitBackdropFilter: floating ? "blur(12px)" : "none",
          boxShadow: floating ? "0 0 0 1px rgba(0,0,0,0.07)" : "none",
          transition: "border-radius 0.35s ease, background 0.35s ease, box-shadow 0.35s ease",
          ...font,
        }}
      >
        {/* 로고 — 좌측 */}
        <a href="#" style={{ fontSize: "17px", fontWeight: 600, color: "#1D1D1F", letterSpacing: "-0.02em", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, ...font }}>
          NEO Home Robot
        </a>

        {/* 메뉴 + 버튼 — 우측 */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {NAV_LINKS.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              onClick={() => setActiveId(id)}
              style={{
                fontSize: "15px",
                fontWeight: activeId === id ? 700 : 500,
                color: activeId === id ? "#1D1D1F" : "#6E6E73",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                ...font,
              }}
            >
              {label}
            </a>
          ))}

          <button
            onClick={() => { setActiveId("pricing"); openModal(true); }}
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#E8622C",
              padding: "8px 18px",
              borderRadius: "980px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "opacity 0.15s",
              ...font,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            구독하기
          </button>
        </div>
      </div>
    </div>
  );
}
