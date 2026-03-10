/**
 * 역할: 어드민 에디터의 공통 입력 필드 컴포넌트
 * 주요 기능: 텍스트/텍스트영역/이미지 업로드 필드 렌더링
 * 의존성: 없음
 */

/** 단일 입력 필드 — label + input/textarea */
export function Field({ label, value, onChange, multiline = false, placeholder = "" }) {
  const baseClass =
    "w-full px-4 py-3 rounded-xl border border-neo-border/50 text-sm text-neo-dark bg-neo-light/50 focus:outline-none focus:ring-2 focus:ring-neo-accent/30 focus:border-neo-accent transition-colors";

  return (
    <div>
      <label className="block text-xs font-medium text-neo-gray mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}

/** 이미지를 최대 1200px, JPEG 0.82 품질로 압축 — localStorage 용량 초과 방지 */
function compressImage(file, maxSize = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/** 이미지 업로드 필드 — URL 입력 + 파일 업로드 + 미리보기 */
export function ImageField({ label, value, onChange }) {
  /** 파일 선택 시 압축 후 Data URL로 변환 */
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    onChange(compressed);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-neo-gray mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="이미지 URL 또는 파일 업로드"
            className="w-full px-4 py-3 rounded-xl border border-neo-border/50 text-sm text-neo-dark bg-neo-light/50 focus:outline-none focus:ring-2 focus:ring-neo-accent/30 focus:border-neo-accent transition-colors"
          />
          <label className="inline-flex items-center gap-1.5 mt-2 text-xs text-neo-accent font-medium cursor-pointer hover:underline">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            파일 선택
          </label>
        </div>
        {value && (
          <img
            src={value}
            alt="미리보기"
            className="w-20 h-14 rounded-lg object-cover border border-neo-border/30"
          />
        )}
      </div>
    </div>
  );
}

/** 동영상 URL 입력 필드 — URL 입력 + 미리보기 */
export function VideoField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neo-gray mb-1.5">{label}</label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/video.mp4"
        className="w-full px-4 py-3 rounded-xl border border-neo-border/50 text-sm text-neo-dark bg-neo-light/50 focus:outline-none focus:ring-2 focus:ring-neo-accent/30 focus:border-neo-accent transition-colors"
      />
      {value && (
        <video
          src={value}
          className="mt-3 w-full rounded-xl border border-neo-border/30"
          style={{ maxHeight: "160px", objectFit: "cover" }}
          muted
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}

/** 저장 완료 표시 + 저장 버튼 */
export function SaveButton({ onSave, saved }) {
  return (
    <div className="flex items-center gap-3 pt-6 border-t border-neo-border/30">
      <button onClick={onSave} className="btn-pill btn-pill-dark text-sm">
        저장하기
      </button>
      {saved && <span className="text-sm text-green-600 font-medium">저장 완료</span>}
    </div>
  );
}

/** 섹션 제목 */
export function SectionHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-neo-dark">{title}</h2>
      {description && <p className="text-sm text-neo-gray mt-1">{description}</p>}
    </div>
  );
}
