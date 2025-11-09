import React from "react";
import clsx from "clsx";

export default function ThumbButton({
  label = "도움이 돼요",
  count = 0,
  active = false,
  onClick,
  className,
}: {
  label?: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center justify-between rounded-full px-3 py-2 text-sm",
        active ? "bg-gray-900 text-white" : "bg-white text-gray-900",
        "shadow-sm ring-1 ring-gray-200 hover:ring-gray-300",
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden>👍</span>
        {label}
      </span>
      <span className={clsx("rounded-full px-2 py-0.5 text-xs", active ? "bg-white/20" : "bg-gray-100")}>{count}</span>
    </button>
  );
}
