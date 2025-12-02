"use client";

import React from "react";
import clsx from "clsx";
import IcWin from "@/assets/icons/ic_win.svg";

// Row & Props
export type CompareRow = {
  label?: React.ReactNode;
  a: React.ReactNode | number;
  b: React.ReactNode | number;
  betterBy?: "higher" | "lower" | "none";
  format?: (v: React.ReactNode | number) => React.ReactNode;
  isBetter?: (a: React.ReactNode | number, b: React.ReactNode | number) => "a" | "b" | "tie" | null | undefined;
};

export type CompareTableProps = {
  top?: { a: React.ReactNode; b: React.ReactNode };
  rows?: CompareRow[];
  side?: React.ReactNode[];
  className?: string;
  size?: "L" | "M";
  typography?: {
    top?: string; // 상단 숫자(별점)
    label?: string; // 왼쪽 라벨
    value?: string; // 행 값(A/B)
    side?: string; // 우측 보조 pill
  };
};

// Pill (폰트는 부모에서 상속)
function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-24 min-w-28 items-center justify-center rounded-full px-3 py-1 leading-none",
        active ? "bg-amber-200/90 text-gray-900" : "bg-gray-100 text-gray-700",
      )}
    >
      {children}
    </span>
  );
}

// 텍스트는 중앙, 트로피는 오른쪽 절대배치
function ValueCell({
  children,
  active,
  iconRight = 0,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  iconRight?: number;
  className?: string;
}) {
  return (
    <div className={clsx("relative flex items-center justify-center border-t border-gray-100", className)}>
      {children}
      {active && (
        <IcWin className="absolute top-1/2 h-24 w-24 -translate-y-1/2" style={{ right: iconRight }} aria-hidden />
      )}
    </div>
  );
}

const strictWin = (a: number, b: number, by: "higher" | "lower") => (by === "higher" ? a > b : a < b);

export default function CompareTable({ top, rows = [], side, className, size = "L", typography }: CompareTableProps) {
  // 타이포 (프로젝트 커스텀 유틸 기준)
  const typoTopBase = "text-20 font-bold tabular-nums";
  const typoTop = typography?.top ?? typoTopBase;
  const typoLabel = typography?.label ?? "text-12 font-medium text-gray-600";
  const typoValue = typography?.value ?? typoTopBase; // 행 값 = 별점과 동일
  const typoSide = typography?.side ?? "text-12 font-medium tabular-nums";

  // 사이즈
  const px = size === "L" ? "px-28" : "px-6";
  const py = size === "L" ? "py-4" : "py-3";
  const rowH = size === "L" ? "h-35" : "h-9";
  const gapX = "gap-x-6";
  const gapY = size === "L" ? "gap-y-6" : "gap-y-4";

  return (
    <section
      className={clsx("w-full rounded-20 bg-white shadow-sm ring-1 ring-gray-100", px, py, className)}
      aria-label="compare table"
    >
      {/* 4열 고정: [라벨 160] [A] [B] [사이드 72] */}
      <div className={clsx("grid items-start", "[grid-template-columns:160px_1fr_1fr_72px]", gapX, gapY)}>
        {/* 상단 대표 수치는 2~3열에 위치시켜 가운데 정렬 */}
        <div className="col-span-2 col-start-2 grid grid-cols-2 text-center">
          <div className={clsx(typoTop)}>{top?.a}</div>
          <div className={clsx(typoTop)}>{top?.b}</div>
        </div>
        {/* 4열(사이드) 상단은 비움 */}
        <div className="col-start-4" />

        {/* 데이터 행 */}
        {rows.map((row, i) => {
          const fmt = row.format ?? (v => v);

          let winA = false,
            winB = false;
          if (row.isBetter) {
            const r = row.isBetter(row.a, row.b);
            winA = r === "a";
            winB = r === "b";
          } else if (row.betterBy && row.betterBy !== "none") {
            const aNum = typeof row.a === "number" ? (row.a as number) : NaN;
            const bNum = typeof row.b === "number" ? (row.b as number) : NaN;
            if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
              winA = strictWin(aNum, bNum, row.betterBy);
              winB = strictWin(bNum, aNum, row.betterBy);
            }
          }

          return (
            <React.Fragment key={i}>
              {/* 1열: 라벨 */}
              <div className={clsx(rowH, "flex items-center", typoLabel)}>{row.label ?? ""}</div>
              {/* 2열: A */}
              <ValueCell active={winA} className={clsx(rowH, typoValue)} iconRight={0}>
                <Pill active={winA}>{fmt(row.a)}</Pill>
              </ValueCell>
              {/* 3열: B */}
              <ValueCell active={winB} className={clsx(rowH, typoValue)} iconRight={0}>
                <Pill active={winB}>{fmt(row.b)}</Pill>
              </ValueCell>
              {/* 4열: 사이드 */}
              <div className={clsx(rowH, "flex items-center justify-end", typoSide)}>
                {side?.[i] && <Pill>{side[i]}</Pill>}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

export { Pill, ValueCell };
