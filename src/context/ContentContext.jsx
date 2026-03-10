/**
 * 역할: 콘텐츠 상태를 전역으로 관리하는 Context Provider
 * 주요 기능: localStorage 기반 콘텐츠 저장/불러오기, 기본값 fallback
 * 의존성: defaultContent
 */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import defaultContent from "../data/defaultContent";

const STORAGE_KEY = "neo-home-content";

const ContentContext = createContext(null);

/** localStorage에서 저장된 콘텐츠를 불러오되, 없으면 기본값 반환 */
function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultContent;
    const parsed = JSON.parse(saved);
    const merged = deepMerge(defaultContent, parsed);

    /* 구 데이터 마이그레이션: price → yearlyPrice */
    if (merged.pricing?.plans) {
      merged.pricing.plans = merged.pricing.plans.map((plan) => {
        if (!plan.yearlyPrice && plan.price) {
          /* 월간 가격 → 연간 가격으로 변환 (×12×0.8) */
          const monthly = parseInt(plan.price.replace(/,/g, ""));
          const yearly = Math.round(monthly * 12 * 0.8);
          return { ...plan, yearlyPrice: yearly.toLocaleString("ko-KR") };
        }
        return plan;
      });
    }

    return merged;
  } catch {
    return defaultContent;
  }
}

/** 기본값 구조를 보장하면서 저장된 값으로 덮어쓰기 */
function deepMerge(defaults, overrides) {
  const result = { ...defaults };
  for (const key in overrides) {
    if (
      overrides[key] &&
      typeof overrides[key] === "object" &&
      !Array.isArray(overrides[key]) &&
      defaults[key]
    ) {
      result[key] = deepMerge(defaults[key], overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent);

  /** 다른 탭에서 localStorage가 변경될 때 동기화 */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setContent(loadContent());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /** 특정 섹션의 콘텐츠를 업데이트하고 localStorage에 저장 */
  const updateContent = useCallback((section, data) => {
    setContent((prev) => {
      const next = { ...prev, [section]: data };
      /* localStorage 실패(용량 초과 등)해도 React 상태는 반드시 업데이트 */
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        console.warn("localStorage 저장 실패 — 새로고침 시 초기화될 수 있습니다.");
      }
      return next;
    });
  }, []);

  /** 전체 콘텐츠를 기본값으로 초기화 */
  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(defaultContent);
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent는 ContentProvider 안에서 사용해야 합니다.");
  return ctx;
}
