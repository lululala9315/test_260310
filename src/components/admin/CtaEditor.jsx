/**
 * 역할: CTA + 푸터 섹션 콘텐츠 에디터
 * 주요 기능: CTA 타이틀/설명/버튼 텍스트, 푸터 회사명/연도 수정
 * 의존성: useContent, EditorField
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Field, ImageField, SaveButton, SectionHeader } from "./EditorField";

export default function CtaEditor() {
  const { content, updateContent } = useContent();
  const [ctaDraft, setCtaDraft] = useState({ ...content.cta });
  const [footerDraft, setFooterDraft] = useState({ ...content.footer });
  const [saved, setSaved] = useState(false);

  const updateCta = (key, value) => {
    setCtaDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateFooter = (key, value) => {
    setFooterDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("cta", ctaDraft);
    updateContent("footer", footerDraft);
    setSaved(true);
  };

  return (
    <div>
      <SectionHeader title="CTA 섹션" description="최종 전환 유도 영역을 수정합니다." />
      <div className="space-y-5">
        <Field
          label="타이틀"
          value={ctaDraft.title}
          onChange={(v) => updateCta("title", v)}
          multiline
          placeholder="줄바꿈은 \n으로 입력"
        />
        <Field label="서브타이틀" value={ctaDraft.subtitle} onChange={(v) => updateCta("subtitle", v)} />
        <Field label="버튼 텍스트" value={ctaDraft.buttonText} onChange={(v) => updateCta("buttonText", v)} />
        <Field label="링크 텍스트" value={ctaDraft.linkText || ""} onChange={(v) => updateCta("linkText", v)} placeholder="더 알아보기 (비워두면 숨김)" />
        <ImageField label="이미지" value={ctaDraft.image || ""} onChange={(v) => updateCta("image", v)} />
      </div>

      <div className="mt-10 pt-8 border-t border-neo-border/30">
        <SectionHeader title="푸터" description="하단 푸터 정보를 수정합니다." />
        <div className="grid grid-cols-2 gap-4">
          <Field label="회사명" value={footerDraft.companyName} onChange={(v) => updateFooter("companyName", v)} />
          <Field label="연도" value={footerDraft.year} onChange={(v) => updateFooter("year", v)} />
        </div>
      </div>

      <SaveButton onSave={handleSave} saved={saved} />
    </div>
  );
}
