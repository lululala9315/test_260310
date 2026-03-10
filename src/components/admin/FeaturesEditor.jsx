/**
 * 역할: 기능 소개 섹션 콘텐츠 에디터
 * 주요 기능: 캐러셀 카드(문구+이미지) 추가·삭제·수정, 상세 기능 섹션 편집
 * 의존성: useContent, EditorField
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Field, ImageField, VideoField, SaveButton, SectionHeader } from "./EditorField";

export default function FeaturesEditor() {
  const { content, updateContent } = useContent();
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(content.features)));
  const [saved, setSaved] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
      items: [...prev.items, { title: "", headline: "", description: "", image: "" }],
    }));
    setActiveCard(draft.items.length);
    setSaved(false);
  };

  const removeItem = (index) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setActiveCard((prev) => Math.max(0, prev >= index ? prev - 1 : prev));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("features", draft);
    setSaved(true);
  };

  return (
    <div>
      <SectionHeader title="기능 소개 섹션" description="캐러셀 카드와 상세 기능 내용을 수정합니다." />

      {/* 섹션 타이틀 */}
      <div className="space-y-4 mb-10">
        <Field label="섹션 타이틀" value={draft.title} onChange={(v) => updateField("title", v)} />
      </div>

      {/* 캐러셀 카드 편집 */}
      <div className="mb-2">
        <p className="text-xs font-bold text-neo-gray uppercase tracking-wider mb-4">캐러셀 카드</p>

        {/* 카드 탭 선택 */}
        <div className="flex gap-2 flex-wrap mb-5">
          {draft.items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveCard(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCard === i
                  ? "bg-neo-dark text-white"
                  : "bg-neo-light text-neo-gray hover:text-neo-dark"
              }`}
            >
              카드 {i + 1}
            </button>
          ))}
          <button
            onClick={addItem}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-neo-accent border border-neo-accent/30 hover:bg-neo-accent/5 transition-colors"
          >
            + 추가
          </button>
        </div>

        {/* 선택된 카드 편집 */}
        {draft.items[activeCard] && (
          <div className="p-5 bg-neo-light/50 rounded-[16px] space-y-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-neo-dark">카드 {activeCard + 1}</p>
              {draft.items.length > 1 && (
                <button
                  onClick={() => removeItem(activeCard)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  이 카드 삭제
                </button>
              )}
            </div>

            <Field
              label="카드 문구"
              value={draft.items[activeCard].title}
              onChange={(v) => updateItem(activeCard, "title", v)}
              multiline
              placeholder={"예) 매일 깨끗한 집.\n손 하나 까딱하지 않아도."}
            />

            {/* 텍스트 색상 선택 */}
            <div>
              <p className="text-xs font-medium text-neo-gray mb-2">텍스트 색상</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.items[activeCard].textColor || "#1D1D1F"}
                  onChange={(e) => updateItem(activeCard, "textColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-neo-border cursor-pointer p-0.5 bg-white"
                />
                <div className="flex gap-2 flex-wrap">
                  {["#1D1D1F", "#FFFFFF", "#F5F5F7", "#E8622C", "#86868B"].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateItem(activeCard, "textColor", color)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: draft.items[activeCard].textColor === color ? "#1D1D1F" : "#D2D2D7",
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <span className="text-xs text-neo-gray font-mono">
                  {draft.items[activeCard].textColor || "#1D1D1F"}
                </span>
              </div>
            </div>

            <ImageField
              label="카드 이미지"
              value={draft.items[activeCard].image}
              onChange={(v) => updateItem(activeCard, "image", v)}
            />
          </div>
        )}
      </div>

      {/* 상세 기능 섹션 */}
      <div className="mt-10">
        <p className="text-xs font-bold text-neo-gray uppercase tracking-wider mb-4">상세 기능 (교차 레이아웃)</p>
        <div className="space-y-6">
          {draft.items.map((item, i) => (
            <div key={i} className="p-5 bg-neo-light/30 rounded-[16px] space-y-4 border border-neo-border/40">
              <p className="text-xs font-semibold text-neo-gray">기능 {i + 1} — {item.title || "(카드 문구 없음)"}</p>
              <Field
                label="헤드라인"
                value={item.headline}
                onChange={(v) => updateItem(i, "headline", v)}
                multiline
                placeholder="줄바꿈은 \n으로 입력"
              />
              <Field
                label="서브타이틀"
                value={item.subtitle || ""}
                onChange={(v) => updateItem(i, "subtitle", v)}
                placeholder="헤드라인 아래 강조 문구 (선택)"
              />
              <Field
                label="설명"
                value={item.description}
                onChange={(v) => updateItem(i, "description", v)}
                multiline
              />
              <ImageField
                label="상세 이미지"
                value={item.image}
                onChange={(v) => updateItem(i, "image", v)}
              />
              <VideoField
                label="상세 동영상 URL"
                value={item.video || ""}
                onChange={(v) => updateItem(i, "video", v)}
              />
            </div>
          ))}
        </div>
      </div>

      <SaveButton onSave={handleSave} saved={saved} />
    </div>
  );
}
