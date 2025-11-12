"use client";
import * as React from "react";
import { cn } from "@/utils/cn";

/** 셀 값 + 우측 배지(선택) */
type Cell =
  | React.ReactNode
  | {
      value: React.ReactNode;
      /** 우측에 붙는 배지 텍스트(예: 300개) */
      badge?: React.ReactNode;
      /** 배지 색상 */
      badgeTone?: "yellow" | "purple" | "gray";
      /** 배지 앞에 붙을 작은 아이콘(선택) */
      badgeIcon?: React.ReactNode;
    };

export type CompareTableProps = {
  /** 왼쪽 큰 이미지/플레이스홀더 */
  leftVisual?: React.ReactNode;
  /** 왼쪽/오른쪽 상단의 굵은 숫자 (예: 0.0) */
  top: { a: Cell; b: Cell };

  /** 아래 행들(예: 0개 / 0개 …) — 같은 길이로 맞추는 것을 권장 */
  rows: Array<{ a: Cell; b: Cell }>;

  /** 컨테이너 className 커스터마이즈 */
  className?: string;
};

function Pill({
  children,
  tone = "yellow",
  className,
}: {
  children: React.ReactNode;
  tone?: "yellow" | "purple" | "gray";
  className?: string;
}) {
  const toneClass =
    tone === "yellow"
      ? "bg-amber-100 text-amber-700"
      : tone === "purple"
        ? "bg-violet-600 text-white"
        : "bg-gray-100 text-gray-600";

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] leading-none", toneClass, className)}
    >
      {children}
    </span>
  );
}

function renderCell(cell: Cell) {
  if (cell !== null && typeof cell === "object" && !React.isValidElement(cell)) {
    const { value, badge, badgeTone = "yellow", badgeIcon } = cell as Exclude<Cell, React.ReactNode>;
    return (
      <div className="flex items-center justify-between gap-2">
        <div>{value}</div>
        {badge != null && (
          <Pill tone={badgeTone}>
            <span className="inline-flex items-center gap-1">
              {badgeIcon ? <i className="inline-block">{badgeIcon}</i> : null}
              {badge}
            </span>
          </Pill>
        )}
      </div>
    );
  }
  return <div>{cell as React.ReactNode}</div>;
}

/** 비교 테이블 메인 컴포넌트 */
export default function CompareTable({ leftVisual, top, rows, className }: CompareTableProps) {
  return (
    <section className={cn("rounded-2xl border border-dashed border-violet-300 p-4 md:p-6", className)}>
      <div className="grid grid-cols-[140px_1fr_1fr] gap-4 md:gap-6">
        {/* 좌측 비주얼 */}
        <div className="flex items-center justify-center">
          <div className="flex aspect-square w-[140px] max-w-full items-center justify-center rounded-xl bg-gray-50 text-gray-400 ring-1 ring-gray-200">
            {leftVisual ?? "비교할 상품을 입력해 주세요"}
          </div>
        </div>

        {/* 좌/우 컬럼 */}
        <div className="space-y-3">
          {/* 상단 굵은 숫자 */}
          <div className="text-center text-xl font-semibold text-gray-900">{renderCell(top.a)}</div>

          {/* 하단 행 */}
          <ul className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <li key={`a-${idx}`} className="py-2 text-sm text-gray-900">
                {renderCell(r.a)}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-center text-xl font-semibold text-gray-900">{renderCell(top.b)}</div>
          <ul className="divide-y divide-gray-100">
            {rows.map((r, idx) => (
              <li key={`b-${idx}`} className="py-2 text-sm text-gray-900">
                {renderCell(r.b)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
