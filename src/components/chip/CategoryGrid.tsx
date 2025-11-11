import React from "react";
import CategoryChip from "@/components/chip/CategoryChip";

export type CategoryItem = { id: string; label: string; icon: string };

export default function CategoryGrid({
  items,
  columns = 2,
  onSelect,
}: {
  items: CategoryItem[];
  columns?: 1 | 2 | 3 | 4;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className={`grid gap-y-4 gap-x-8`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
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
