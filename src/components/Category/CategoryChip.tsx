import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { getCategoryIcon } from "@/assets/icons/category/icons";

export type CategoryChipProps = {
  label: string;
  icon: string;
  as?: "button" | "div";
  className?: string;
  onClick?: () => void;
  iconPlacement?: "left" | "right";
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  variant?: "default" | "pill";
};

const sizeMap = {
  sm: { iconBox: 16, pad: "px-2 py-1", text: "text-14 font-bold" },
  md: { iconBox: 20, pad: "px-3 py-2", text: "text-16-bold md:text-20-bold" },
  lg: { iconBox: 24, pad: "px-4 py-3", text: "text-18 font-bold" },
};

const CategoryChip = forwardRef<HTMLElement, CategoryChipProps>(function CategoryChip(
  {
    label,
    icon,
    as = "button",
    className,
    onClick,
    iconPlacement = "right",
    size = "md",
    selected = false,
    variant = "default",
  },
  ref,
) {
  const Comp: any = as;
  const SvgIcon = (getCategoryIcon(icon) as React.ComponentType<React.SVGProps<SVGSVGElement>>) || undefined;

  const S = sizeMap[size];
  const isPill = variant === "pill";

  const IconBox = SvgIcon ? (
    <div
      className={cn("relative shrink-0 overflow-visible", size === "md" && "md:!h-28 md:!w-28")}
      style={{ width: S.iconBox * 1.2, height: S.iconBox }}
      aria-hidden
    >
      <SvgIcon className="absolute inset-0 block h-full w-full text-gray-800" />
    </div>
  ) : (
    <span className="text-10 text-red-500">[missing: {icon}]</span>
  );

  return (
    <Comp
      ref={ref as any}
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      aria-pressed={as === "button" ? selected : undefined}
      className={cn(
        "leading-none text-gray-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        isPill
          ? [
              "flex flex-col items-center justify-center gap-2", // gap 8px
              "h-[90px] w-[90px]", // 고정 크기
              "rounded-[16px]", // radius 16px
              "border border-gray-300", // 1px border
              "bg-gray-200", // 배경색
              "px-[20px] pb-[15px] pt-[15px]", // padding
            ].join(" ")
          : ["flex w-full items-center justify-between", S.pad].join(" "),
        selected && (isPill ? "border-primary-400 bg-white" : "bg-gray-100"),
        className,
      )}
    >
      {isPill ? (
        <>
          {IconBox}
          <span className="mt-1 font-spoqa text-[12px] font-normal leading-none tracking-[-0.4px] text-gray-700">
            {label}
          </span>
        </>
      ) : (
        <>
          {iconPlacement === "left" && <span className="mr-2">{IconBox}</span>}
          <span className={cn("font-spoqa tracking-[-0.2px]", S.text)}>{label}</span>
          {iconPlacement === "right" && <span className="ml-2">{IconBox}</span>}
        </>
      )}
    </Comp>
  );
});

export default CategoryChip;
