"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { getThumbIcon } from "@/assets/icons/thumbspanel/icons";

export type ThumbButtonProps = {
  label?: string;
  count?: number;
  variant?: "light" | "dark";
  size?: "l" | "s"; // ⭐ 추가
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function ThumbButton({
  label = "도움이 돼요",
  count = 0,
  variant = "light",
  size = "l", // ⭐ 기본은 Large
  onClick,
  className,
  ariaLabel,
}: ThumbButtonProps) {
  const Icon = getThumbIcon(variant === "dark" ? "ic_fill_True" : "ic_fill_False");

  /** ------------------------
   *  SIZE 스타일 정의
   *  ------------------------ */

  const sizeStyles =
    size === "l"
      ? {
          container: "flex-row h-[42px] px-16 gap-10 min-w-[135px]",
          icon: "w-20 h-20",
          label: "text-14",
          count: "text-12",
        }
      : {
          container: "flex-col h-[31px] px-8 py-4 gap-2 min-w-[108px]",
          icon: "w-16 h-16",
          label: "text-12",
          count: "text-11",
        };

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      className={cn(
        // -------------------------
        // Large 기본(Hug)
        // -------------------------
        "h-[42px] w-auto min-w-[135px] px-16",

        // -------------------------
        // 모바일 Small(Hug)
        // -------------------------
        "md:h-[42px] md:min-w-[135px] md:px-16",
        "h-[31px] min-w-[108px] px-10",

        "flex items-center justify-between rounded-full shadow-sm ring-1 transition-colors",
        variant === "dark" ? "bg-gray-900 text-white ring-gray-800" : "bg-white text-gray-900 ring-gray-200",

        className,
      )}
    >
      <span className="inline-flex items-center gap-10 md:gap-10">
        <Icon className="h-20 w-20 md:h-20 md:w-20" aria-hidden />
        <span className="text-12 leading-none md:text-14">{label}</span>
      </span>

      <span
        className={cn(
          "text-[14px] md:text-[14px]",
          "max-md:text-[11px]",
          "ml-[5px]",
          "tabular-nums leading-none",
          variant === "dark" ? "text-white/80" : "text-gray-500",
        )}
      >
        {count}
      </span>
    </button>
  );
}
