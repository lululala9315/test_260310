/**
 * 역할: Hero 섹션 콘텐츠 에디터
 * 주요 기능: 제목, 서브타이틀, CTA, 가격, 이미지 수정
 * 의존성: useContent, EditorField
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Field, ImageField, SaveButton, SectionHeader } from "./EditorField";

export default function HeroEditor() {
  const { content, updateContent } = useContent();
  const [draft, setDraft] = useState({ ...content.hero });
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("hero", draft);
    setSaved(true);
  };

  return (
    <div>
      <SectionHeader title="Hero 섹션" description="메인 화면의 타이틀, CTA, 이미지를 수정합니다." />
      <div className="space-y-5">
        <Field label="메인 타이틀" value={draft.title} onChange={(v) => update("title", v)} />
        <Field label="서브타이틀" value={draft.subtitle} onChange={(v) => update("subtitle", v)} />
        <Field label="CTA 버튼 텍스트" value={draft.ctaText} onChange={(v) => update("ctaText", v)} />
        <Field label="링크 텍스트" value={draft.linkText} onChange={(v) => update("linkText", v)} />
        <Field label="가격 텍스트" value={draft.priceText} onChange={(v) => update("priceText", v)} />
        <ImageField label="히어로 이미지" value={draft.image} onChange={(v) => update("image", v)} />
        <Field label="이미지 Alt 텍스트" value={draft.imageAlt} onChange={(v) => update("imageAlt", v)} />
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
}
