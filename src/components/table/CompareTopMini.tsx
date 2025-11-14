"use client";

import React from "react";
import clsx from "clsx";
import IcWin from "@/assets/icons/ic_win.svg";

export type CompareTopMiniProps = {
  /** 상단 큰 숫자(좌/우) */
  top: { a: React.ReactNode; b: React.ReactNode };
  /** 하단 pill 값(좌/우) */
  bottom: { a: React.ReactNode; b: React.ReactNode };
  /**
   * 승자 표시: 'a' | 'b' | 'none'
   * - 'a'면 왼쪽 pill 오른쪽에 트로피 아이콘 표시
   * - 'b'면 오른쪽 pill 오른쪽에 트로피 아이콘 표시
   * - 'none'이면 아이콘 없음
   */
  winner?: "a" | "b" | "none";
  /** 폰트/굵기 커스터마이즈 */
  typography?: {
    top?: string; // 상단 큰 숫자
    bottom?: string; // 하단 pill 텍스트
  };
  /** 레이아웃 여백/간격 커스터마이즈 */
  spacing?: {
    gapY?: number; // 상단↔하단 세로 간격(px)
    trophyRight?: number; // 트로피 아이콘을 pill 텍스트 기준 오른쪽으로 이동(px)
    trophySize?: number; // 트로피 아이콘 크기(px)
  };
  className?: string;
};

function Pill({
  children,
  active = true, // 디자인 상 항상 노란 pill처럼 보이도록 기본 true
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 leading-none",
        active ? "bg-amber-200/90 text-gray-900" : "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default function CompareTopMini({
  top,
  bottom,
  winner = "a",
  typography,
  spacing,
  className,
}: CompareTopMiniProps) {
  const typoTop = typography?.top ?? "text-20 font-bold tabular-nums";
  const typoBottom = typography?.bottom ?? "text-20 font-bold tabular-nums";

  const gapY = spacing?.gapY ?? 20; // 상/하 간격
  const trophyRight = spacing?.trophyRight ?? 8; // 아이콘을 pill 텍스트 오른쪽으로 약간 이동
  const trophySize = spacing?.trophySize ?? 18; // 아이콘 사이즈

  return (
    <section className={clsx("w-full", className)} aria-label="compare top mini">
      {/* 상단 숫자 */}
      <div className="grid grid-cols-2">
        <div className={clsx("text-left", typoTop)}>{top.a}</div>
        <div className={clsx("text-right", typoTop)}>{top.b}</div>
      </div>

      <div style={{ height: gapY }} />

      {/* 하단 pill + 트로피(승자 쪽) */}
      <div className="relative grid grid-cols-2 items-center">
        {/* Left pill */}
        <div className={clsx("flex", "justify-start")}>
          <Pill className={clsx(typoBottom)}>{bottom.a}</Pill>
        </div>

        {/* Right pill */}
        <div className={clsx("flex", "justify-end")}>
          <Pill className={clsx(typoBottom)}>{bottom.b}</Pill>
        </div>

        {/* 트로피 아이콘: 승자 쪽 셀의 오른쪽 가장자리 근처에 배치 */}
        {winner !== "none" && (
          <IcWin
            className="absolute -translate-y-1/2"
            style={{
              top: `calc(50% + ${trophySize / 2}px)`, // pill 중앙보다 살짝 아래(보기 좋게)
              right: winner === "b" ? trophyRight : undefined,
              left: winner === "a" ? trophyRight : undefined,
              width: trophySize,
              height: trophySize,
            }}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
}
