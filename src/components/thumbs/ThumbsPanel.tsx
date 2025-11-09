import React from "react";
import ThumbButton from "./ThumbButton";

export default function ThumbsPanel({
  items = [
    { id: "a", label: "도움이 돼요", count: 0 },
    { id: "b", label: "도움이 돼요", count: 0 },
    { id: "c", label: "도움이 돼요", count: 0 },
  ],
  title = "thumbs",
  onClick,
}: {
  items?: { id: string; label: string; count: number; active?: boolean }[];
  title?: string;
  onClick?: (id: string) => void;
}) {
  return (
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
    </div>
  );
}
