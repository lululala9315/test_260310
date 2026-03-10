/**
 * 역할: 사이트 푸터 — 저작권 + 약관 링크
 * 의존성: useContent
 */
import { useContent } from "../context/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer;

  return (
    <footer className="border-t border-neo-border/50 py-6 px-6 bg-white">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neo-gray">
        <span>&copy; {footer.year} {footer.companyName}</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-neo-dark transition-colors">서비스 약관</a>
          <a href="#" className="hover:text-neo-dark transition-colors">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  );
}
