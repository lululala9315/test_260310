import { useState, useEffect } from "react";

export default function FloatingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="bg-white px-5 py-3"
        style={{ boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="max-w-[980px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neo-light flex items-center justify-center border border-neo-border">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="7" y="1" width="6" height="5" rx="2" fill="#1A1A1A" />
                <rect x="5" y="7" width="10" height="8" rx="2" fill="#1A1A1A" />
                <rect x="6" y="16" width="3" height="3" rx="1" fill="#1A1A1A" />
                <rect x="11" y="16" width="3" height="3" rx="1" fill="#1A1A1A" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neo-dark">NEO Home 구독</p>
              <p className="text-xs text-neo-gray">
                <span className="text-neo-accent font-medium">월 390,000원</span>
                <span>부터</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="#pricing"
              className="hidden sm:block text-sm font-medium text-neo-gray hover:text-neo-dark transition-colors whitespace-nowrap"
            >
              플랜 비교
            </a>
            <a
              href="#cta"
              className="block w-full sm:w-auto text-center bg-neo-dark text-white text-[15px] font-medium px-6 py-3 rounded-xl hover:bg-neo-dark-hover transition-colors"
            >
              무료 체험 시작하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
