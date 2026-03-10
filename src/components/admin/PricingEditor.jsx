/**
 * 역할: 구독 플랜 섹션 콘텐츠 에디터
 * 주요 기능: 섹션 타이틀, 플랜별 이름/가격/설명/기능/추천 여부 수정
 * 의존성: useContent, EditorField
 */
import { useState } from "react";
import { useContent } from "../../context/ContentContext";
import { Field, ImageField, SaveButton, SectionHeader } from "./EditorField";

export default function PricingEditor() {
  const { content, updateContent } = useContent();
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(content.pricing)));
  const [saved, setSaved] = useState(false);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updatePlan = (index, key, value) => {
    setDraft((prev) => {
      const plans = [...prev.plans];
      plans[index] = { ...plans[index], [key]: value };
      return { ...prev, plans };
    });
    setSaved(false);
  };

  /** 기능 목록을 줄바꿈 구분 텍스트로 변환 */
  const featuresText = (features) => features.join("\n");

  /** 줄바꿈 텍스트를 기능 배열로 변환 */
  const parseFeatures = (text) => text.split("\n").filter((s) => s.trim());

  const addPlan = () => {
    setDraft((prev) => ({
      ...prev,
      plans: [...prev.plans, { name: "", yearlyPrice: "", description: "", recommended: false, features: [] }],
    }));
    setSaved(false);
  };

  const removePlan = (index) => {
    setDraft((prev) => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("pricing", draft);
    setSaved(true);
  };

  return (
    <div>
      <SectionHeader title="구독 플랜 섹션" description="플랜 정보와 가격을 수정합니다." />
      <div className="space-y-5">
        <Field label="섹션 타이틀" value={draft.title} onChange={(v) => updateField("title", v)} />
        <Field label="섹션 서브타이틀" value={draft.subtitle} onChange={(v) => updateField("subtitle", v)} />
        <Field label="하단 각주" value={draft.footnote} onChange={(v) => updateField("footnote", v)} />
        <ImageField label="섹션 이미지 (비어있으면 Hero 이미지 사용)" value={draft.image || ""} onChange={(v) => updateField("image", v)} />
      </div>

      <div className="mt-10 space-y-6">
        {draft.plans.map((plan, i) => (
          <div key={i} className="p-6 bg-neo-light/50 rounded-[16px] space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neo-dark">플랜 {i + 1}</p>
              <button
                onClick={() => removePlan(i)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="플랜명" value={plan.name} onChange={(v) => updatePlan(i, "name", v)} />
              <Field
                label="연간 가격 (원 단위, 숫자만)"
                value={plan.yearlyPrice || plan.price || ""}
                onChange={(v) => updatePlan(i, "yearlyPrice", v)}
                placeholder="예: 4,680,000"
              />
            </div>
            {/* 자동 계산 안내 */}
            {(() => {
              const yearly = parseInt((plan.yearlyPrice || plan.price || "0").replace(/,/g, ""));
              if (!yearly) return null;
              const yearlyMo = Math.round(yearly / 12);
              const monthlyMo = Math.round(yearlyMo / 0.8);
              return (
                <p className="text-xs text-neo-gray -mt-2">
                  자동 계산 → 연간 {yearlyMo.toLocaleString("ko-KR")}원/월 · 월간 {monthlyMo.toLocaleString("ko-KR")}원/월
                </p>
              );
            })()}
            <Field label="설명" value={plan.description} onChange={(v) => updatePlan(i, "description", v)} />
            <Field
              label="기능 목록 (줄바꿈으로 구분)"
              value={featuresText(plan.features)}
              onChange={(v) => updatePlan(i, "features", parseFeatures(v))}
              multiline
            />
            <label className="flex items-center gap-2 text-sm text-neo-dark cursor-pointer">
              <input
                type="checkbox"
                checked={plan.recommended}
                onChange={(e) => updatePlan(i, "recommended", e.target.checked)}
                className="w-4 h-4 accent-neo-accent"
              />
              추천 플랜 (강조 표시)
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={addPlan}
        className="mt-4 text-sm text-neo-accent font-medium hover:underline"
      >
        + 플랜 추가
      </button>

      <SaveButton onSave={handleSave} saved={saved} />
    </div>
  );
}
