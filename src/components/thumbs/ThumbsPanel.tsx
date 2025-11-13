"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ThumbButton from "./ThumbButton";

export type ThumbsItem = {
  id: string;
  label: string;
  count: number;
  variant?: "light" | "dark";
  checked?: boolean;
};

export type ThumbsPanelProps = {
  items?: ThumbsItem[];
  title?: string;
  className?: string;
};

export default function ThumbsPanel({
  items = [{ id: "1", label: "도움이 돼요", count: 0, variant: "light" }],
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
        return {
          ...item,
          checked: nextChecked,
          count: nextCount,
          variant: nextChecked ? "dark" : "light", // ✅ 클릭 시 색상 변경
        };
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
    </div>
  );
}
