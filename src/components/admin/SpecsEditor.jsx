/**
 * 역할: 사양 섹션 콘텐츠 에디터
 * 주요 기능: 섹션 타이틀, 스펙 항목 값/단위/라벨 수정, 항목 추가·삭제
 * 의존성: useContent, EditorField
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Field, SaveButton, SectionHeader } from "./EditorField";

export default function SpecsEditor() {
  const { content, updateContent } = useContent();
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(content.specs)));
  const [saved, setSaved] = useState(false);

  const updateTitle = (value) => {
    setDraft((prev) => ({ ...prev, title: value }));
    setSaved(false);
  };

  const updateItem = (index, key, value) => {
    setDraft((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
    setSaved(false);
  };

  const addItem = () => {
    setDraft((prev) => ({
      ...prev,
      items: [...prev.items, { value: "", unit: "", label: "" }],
    }));
    setSaved(false);
  };

  const removeItem = (index) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("specs", draft);
    setSaved(true);
  };

  return (
    <div>
      <SectionHeader title="사양 섹션" description="스펙 수치와 단위를 수정합니다." />
      <Field label="섹션 타이틀" value={draft.title} onChange={updateTitle} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {draft.items.map((item, i) => (
          <div key={i} className="p-5 bg-neo-light/50 rounded-[16px] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neo-dark">스펙 {i + 1}</p>
              <button
                onClick={() => removeItem(i)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
            <Field label="값" value={item.value} onChange={(v) => updateItem(i, "value", v)} placeholder="예: 166" />
            <Field label="단위" value={item.unit} onChange={(v) => updateItem(i, "unit", v)} placeholder="예: cm" />
            <Field label="라벨" value={item.label} onChange={(v) => updateItem(i, "label", v)} placeholder="예: 신장" />
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-4 text-sm text-neo-accent font-medium hover:underline"
      >
        + 스펙 항목 추가
      </button>

      <SaveButton onSave={handleSave} saved={saved} />
    </div>
  );
}
