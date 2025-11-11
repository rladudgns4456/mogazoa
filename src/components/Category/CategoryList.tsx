import React, { useCallback } from "react";
import CategoryChip, { CategoryChipProps } from "./CategoryChip";

export type CategoryItem = { id: string; label: string; icon: string };

export type CategoryListProps = {
  items: CategoryItem[];
  className?: string;
  layout?: "list" | "grid";
  columns?: 1 | 2 | 3 | 4;
  withDividers?: boolean;
  size?: CategoryChipProps["size"];
  iconPlacement?: CategoryChipProps["iconPlacement"];
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export default function CategoryList({
  items,
  className,
  layout = "list",
  columns = 2,
  withDividers = true,
  size = "lg",
  iconPlacement = "right",
  selectable = false,
  selectedId = null,
  onSelect,
}: CategoryListProps) {
  const handleClick = useCallback((id: string) => () => onSelect?.(id), [onSelect]);

  const colClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    }[columns] || "grid-cols-2";

  const a11yProps = selectable
    ? { role: "listbox", "aria-activedescendant": selectedId ?? undefined }
    : { role: "list" };

  return (
    <div className={className} {...a11yProps}>
      {layout === "grid" ? (
        <ul className={["grid gap-4", colClass].join(" ")}>
          {items.map(it => (
            <li key={it.id} role={selectable ? "option" : undefined} aria-selected={selectedId === it.id}>
              <CategoryChip
                as="button"
                label={it.label}
                icon={it.icon}
                size={size}
                iconPlacement={iconPlacement}
                onClick={handleClick(it.id)}
                selected={selectedId === it.id}
                className="justify-start"
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="w-full">
          {items.map((it, idx) => (
            <li
              key={it.id}
              role={selectable ? "option" : undefined}
              aria-selected={selectedId === it.id}
              className={withDividers && idx !== items.length - 1 ? "border-gray-200/80 border-b" : undefined}
            >
              <CategoryChip
                as="button"
                label={it.label}
                icon={it.icon}
                size={size}
                iconPlacement={iconPlacement}
                onClick={handleClick(it.id)}
                selected={selectedId === it.id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
