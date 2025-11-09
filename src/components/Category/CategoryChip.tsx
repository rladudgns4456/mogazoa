import React from "react";
import clsx from "clsx";
import { getCategoryIcon } from "@/assets/icons/category/icons";

type Props = {
  label: string;
  icon: string; // "ic_search" 같은 키
  as?: "button" | "div";
  className?: string;
  onClick?: () => void;
};

export default function CategoryChip({ label, icon, as = "button", className, onClick }: Props) {
  const Comp: any = as;
  const SvgIcon = getCategoryIcon(icon);

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md px-2 py-1 text-gray-900 hover:bg-gray-100 active:bg-gray-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        className,
      )}
    >
      {SvgIcon ? (
        <SvgIcon className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        <span className="text-xs text-red-500">[missing: {icon}]</span>
      )}
      <span className="font-spoqa text-16-bold">{label}</span>
    </Comp>
  );
}
