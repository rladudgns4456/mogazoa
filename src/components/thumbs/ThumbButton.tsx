"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { getThumbIcon } from "@/assets/icons/thumbspanel/icons";

export type ThumbButtonProps = {
  label?: string;
  count?: number;
  variant?: "light" | "dark";
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function ThumbButton({
  label = "도움이 돼요",
  count = 0,
  variant = "light",
  onClick,
  className,
  ariaLabel,
}: ThumbButtonProps) {
  const Icon = getThumbIcon(variant === "dark" ? "ic_fill_True" : "ic_fill_False");

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      className={cn(
        "h-42 w-180",
        "flex items-center justify-between rounded-full text-14 font-medium transition-colors",
        "px-16 shadow-sm ring-1 hover:ring-gray-300",
        variant === "dark" ? "bg-gray-900 text-white ring-gray-800" : "bg-white text-gray-900 ring-gray-200",
        className,
      )}
    >
      {/* 왼쪽: 아이콘 + 라벨 */}
      <span className="inline-flex items-center gap-10">
        <Icon className="h-20 w-20" aria-hidden />
        <span className="leading-none">{label}</span>
      </span>

      {/* 오른쪽 숫자 pill — 배경/색도 variant에 따라 고정 */}
      <span
        className={cn(
          "rounded-full px-8 py-2 text-12 leading-none",
          variant === "dark" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-900",
        )}
      >
        {count}
      </span>
    </button>
  );
}
