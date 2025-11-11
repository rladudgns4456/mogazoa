import React from "react";
import clsx from "clsx";

type CategoryChipProps = {
  label: string;
  icon: string; // 파일명만: 예) "ic_movie.svg"
  as?: "button" | "div";
  className?: string;
  onClick?: () => void;
};

export default function CategoryChip({ label, icon, as = "button", className, onClick }: CategoryChipProps) {
  const Comp: any = as;

  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-md",
        "px-2 py-1",
        "text-gray-900",
        "hover:bg-gray-100 active:bg-gray-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        className,
      )}
    >
      {/* 아이콘: public/icons/category 아래의 파일을 사용 */}
      <img src={`/icons/category/${icon}`} alt="" width={20} height={20} className="shrink-0" />
      <span className="font-spoqa text-16-bold">{label}</span>
    </Comp>
  );
}
