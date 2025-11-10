import React from "react";
import clsx from "clsx";

export type CompareRow = {
  a: React.ReactNode;
  b: React.ReactNode;
  /** 노란 알약처럼 강조할 쪽 */
  highlight?: "a" | "b";
};

export type CompareTableProps = {
  /** 상단 두 숫자(예: 평점) */
  top: { a: React.ReactNode; b: React.ReactNode };
  /** 중단/하단 행들 */
  rows: CompareRow[];
  /** 우측 사이드 정보 */
  side: {
    pill1?: React.ReactNode; // 예: 4.9
    pill2?: React.ReactNode; // 예: 300개
    pill3?: React.ReactNode; // 필요시
    trophyIcon?: React.ReactNode; // 기본 🏆
    trophyText?: React.ReactNode; // 예: 100개
  };
  /** 피그마 가이드용 점선 테두리 */
  debugBorder?: boolean;
  className?: string;
};

const Pill: React.FC<{ children: React.ReactNode; tone?: "primary" | "gray" }> = ({ children, tone = "primary" }) => (
  <span
    className={clsx(
      "inline-flex min-w-10 items-center justify-center rounded-full px-3 py-1",
      "text-14-medium",
      tone === "primary" && "bg-primary-200",
      tone === "gray" && "bg-gray-100",
    )}
  >
    {children}
  </span>
);

const Divider = () => <div className="h-px w-full bg-gray-100" />;

/** table/compare (좌측 이미지 영역 제외) */
const CompareTable: React.FC<CompareTableProps> = ({ top, rows, side, debugBorder, className }) => {
  return (
    <section
      className={clsx(
        "w-full rounded-2xl bg-white p-6 md:p-8",
        debugBorder && "border-2 border-dashed border-primary-300",
        className,
      )}
    >
      {/* 중앙 2열 + 우측 사이드 */}
      <div className="grid grid-cols-3 gap-6 md:gap-10">
        {/* 중앙 2열 */}
        <div className="col-span-2">
          {/* 상단 숫자 */}
          <div className="grid grid-cols-2 text-center">
            <div className="text-20-bold md:text-24-bold">{top.a}</div>
            <div className="text-20-bold md:text-24-bold">{top.b}</div>
          </div>

          {/* 행들 */}
          <div className="mt-6 space-y-5">
            {rows.map((r, idx) => (
              <div key={idx} className="space-y-3">
                {idx !== 0 && <Divider />}
                <div className="grid grid-cols-2 items-center text-center">
                  <div className="flex items-center justify-center text-16-medium">
                    {r.highlight === "a" ? <Pill>{r.a}</Pill> : r.a}
                  </div>
                  <div className="flex items-center justify-center text-16-medium">
                    {r.highlight === "b" ? <Pill>{r.b}</Pill> : r.b}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 사이드 */}
        <aside className="flex flex-col justify-between">
          <div className="space-y-4">
            {side.pill1 && (
              <div className="flex justify-end">
                <Pill>{side.pill1}</Pill>
              </div>
            )}
            {side.pill2 && (
              <div className="flex justify-end">
                <Pill>{side.pill2}</Pill>
              </div>
            )}
            {side.pill3 && (
              <div className="flex justify-end">
                <Pill>{side.pill3}</Pill>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <span className="text-20-bold">{side.trophyIcon ?? "🏆"}</span>
            <span className="text-14-medium md:text-16-medium">{side.trophyText ?? "0개"}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CompareTable;
