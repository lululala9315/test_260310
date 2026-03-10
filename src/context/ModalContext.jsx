/**
 * 역할: 구독 모달 전역 상태 관리
 * 주요 기능: openModal(showPlans), closeModal 제공
 * 의존성: 없음
 */
import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [state, setState] = useState({ open: false, showPlans: true });

  const openModal = (showPlans = true) => setState({ open: true, showPlans });
  const closeModal = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <ModalContext.Provider value={{ ...state, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
