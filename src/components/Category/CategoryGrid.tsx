import React from "react";
import CategoryChip from "./CategoryChip";

export type CategoryItem = { id: string; label: string; icon: string };

export default function CategoryGrid({
  items,
  columns = 2,
  onSelect,
  className,
}: {
  items: CategoryItem[];
  columns?: 1 | 2 | 3 | 4;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ display: "grid", gap: "1rem", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map(it => (
        <CategoryChip
          key={it.id}
          label={it.label}
          icon={it.icon}
          onClick={onSelect ? () => onSelect(it.id) : undefined}
          className="justify-start"
        />
      ))}
    </div>
  );
}
