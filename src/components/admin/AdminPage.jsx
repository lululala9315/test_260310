/**
 * 역할: 콘텐츠 관리 어드민 페이지
 * 주요 기능: 섹션별 텍스트·이미지 수정, 실시간 미리보기 링크, 초기화
 * 의존성: useContent, 각 섹션 에디터 컴포넌트
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import HeroEditor from "./HeroEditor";
import FeaturesEditor from "./FeaturesEditor";
import SpecsEditor from "./SpecsEditor";
import PricingEditor from "./PricingEditor";
import CtaEditor from "./CtaEditor";

const tabs = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "기능 소개" },
  { id: "specs", label: "사양" },
  { id: "pricing", label: "구독 플랜" },
  { id: "cta", label: "CTA / 푸터" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const { resetContent } = useContent();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  /** 전체 초기화 처리 */
  const handleReset = () => {
    resetContent();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-neo-light">
      {/* 어드민 헤더 */}
      <header className="bg-white border-b border-neo-border/50 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-neo-dark">NEO Home Admin</h1>
            <span className="text-xs text-neo-gray bg-neo-light px-2 py-0.5 rounded-full">콘텐츠 관리</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neo-accent font-medium hover:underline"
            >
              사이트 미리보기 ↗
            </a>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-neo-gray hover:text-red-500 transition-colors"
            >
              전체 초기화
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8">
        {/* 탭 네비게이션 */}
        <nav className="flex gap-1 bg-white rounded-[14px] p-1.5 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-[10px] text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-neo-dark text-white"
                  : "text-neo-gray hover:text-neo-dark hover:bg-neo-light"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* 에디터 영역 */}
        <div className="bg-white rounded-[20px] p-6 md:p-10">
          {activeTab === "hero" && <HeroEditor />}
          {activeTab === "features" && <FeaturesEditor />}
          {activeTab === "specs" && <SpecsEditor />}
          {activeTab === "pricing" && <PricingEditor />}
          {activeTab === "cta" && <CtaEditor />}
        </div>
      </div>

      {/* 초기화 확인 모달 */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[20px] p-8 max-w-sm w-full text-center">
            <p className="text-lg font-bold text-neo-dark">전체 초기화</p>
            <p className="text-sm text-neo-gray mt-2">
              모든 콘텐츠가 기본값으로 돌아갑니다.<br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 btn-pill btn-pill-outline text-sm"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="flex-1 btn-pill text-sm bg-red-500 text-white hover:bg-red-600"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
