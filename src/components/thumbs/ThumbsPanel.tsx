<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7ff90f2 ([추가] Chip 공통 컴포넌트 개발 완료( category, thumbs, ranking ))
"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
<<<<<<< HEAD
import ThumbButton from "./ThumbButton";

export type ThumbsItem = {
  id: string;
  label: string;
  count: number;
  /** 라이트/다크 고정 스타일 */
  variant?: "light" | "dark";
  /** 내부 토글 상태(색엔 영향 X) */
  checked?: boolean;
};

export type ThumbsPanelProps = {
  items?: ThumbsItem[];
  title?: string;
  className?: string;
};

export default function ThumbsPanel({
  items = [
    { id: "1", label: "도움이 돼요", count: 0, variant: "light" }, // 흰 배경
    { id: "2", label: "도움이 돼요", count: 0, variant: "dark" }, // 검정 배경
  ],
  title = "thumbs",
  className,
}: ThumbsPanelProps) {
  const [list, setList] = useState<ThumbsItem[]>(items);

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const nextChecked = !item.checked;
        const nextCount = nextChecked ? item.count + 1 : Math.max(0, item.count - 1);
        return { ...item, checked: nextChecked, count: nextCount };
      }),
    );
  };

  return (
    <div title={title} className={cn("flex w-auto flex-col gap-12", className)}>
      {list.map(x => (
        <ThumbButton
          key={x.id}
          label={x.label}
          count={x.count}
          variant={x.variant ?? "light"}
          onClick={() => handleToggle(x.id)}
        />
      ))}
=======
import React from "react";
=======
>>>>>>> 7ff90f2 ([추가] Chip 공통 컴포넌트 개발 완료( category, thumbs, ranking ))
import ThumbButton from "./ThumbButton";

export type ThumbsItem = {
  id: string;
  label: string;
  count: number;
  /** 라이트/다크 고정 스타일 */
  variant?: "light" | "dark";
  /** 내부 토글 상태(색엔 영향 X) */
  checked?: boolean;
};

export type ThumbsPanelProps = {
  items?: ThumbsItem[];
  title?: string;
  className?: string;
};

export default function ThumbsPanel({
  items = [
    { id: "1", label: "도움이 돼요", count: 0, variant: "light" }, // 흰 배경
    { id: "2", label: "도움이 돼요", count: 0, variant: "dark" }, // 검정 배경
  ],
  title = "thumbs",
  className,
}: ThumbsPanelProps) {
  const [list, setList] = useState<ThumbsItem[]>(items);

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const nextChecked = !item.checked;
        const nextCount = nextChecked ? item.count + 1 : Math.max(0, item.count - 1);
        return { ...item, checked: nextChecked, count: nextCount };
      }),
    );
  };

  return (
<<<<<<< HEAD
    <div title={title} className="w-[210px]">
      <div className="flex flex-col gap-3">
        {items.map(x => (
          <ThumbButton
            key={x.id}
            label={x.label}
            count={x.count}
            active={!!x.active}
            onClick={onClick ? () => onClick(x.id) : undefined}
          />
        ))}
      </div>
>>>>>>> ab3a883 ([추가] chip 컴포넌트 완성 / catgory , thumbs 컴포넌트 제작 중)
=======
    <div title={title} className={cn("flex w-auto flex-col gap-12", className)}>
      {list.map(x => (
        <ThumbButton
          key={x.id}
          label={x.label}
          count={x.count}
          variant={x.variant ?? "light"}
          onClick={() => handleToggle(x.id)}
        />
      ))}
>>>>>>> 7ff90f2 ([추가] Chip 공통 컴포넌트 개발 완료( category, thumbs, ranking ))
    </div>
  );
}
