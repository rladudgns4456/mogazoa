"use client";

import { getStarIcon } from "@/assets/icons/star/icons";
import cn from "clsx";
import { useState } from "react";

// StarRating 컴포넌트 별점 0~5점

interface StarRatingProps {
  rating?: number; // 별점 값 (0~5점)
  onChange?: (rating: number) => void; // 별점 변경 콜백 (readonly=false일 때만 작동)
  readonly?: boolean; // 읽기 전용 여부
  nickname?: string; // 별점 옆에 표시할 닉네임 (readonly=true일 때만 표시)
  className?: string;
  disabled?: boolean;
}

export default function StarRating({
  rating = 0,
  onChange,
  readonly = false,
  nickname,
  className,
  disabled = false,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // 반응형 크기: 모바일(기본) → PC/태블릿(md 이상)
  const sizeClasses = readonly ? "w-10 h-10 md:w-15 md:h-15" : "w-23 h-23 md:w-33 md:h-33";

  const gap = readonly ? "gap-2" : "gap-8";

  const handleClick = (star: number) => {
    if (readonly || disabled) return;
    onChange?.(star);
  };

  const handleMouseEnter = (star: number) => {
    if (readonly || disabled) return;
    setHoveredStar(star);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoveredStar(null);
  };

  const displayRating = readonly ? rating : (hoveredStar ?? rating);

  return (
    <div className={cn("flex items-center", gap, className)} onMouseLeave={handleMouseLeave}>
      <div className={cn("flex", gap)}>
        {Array.from({ length: 5 }, (_, i) => {
          const star = i + 1;
          const isFilled = star <= displayRating;
          // readonly면 검은별, 인터랙티브면 노란별
          const filledIcon = readonly ? "ic_star_fill" : "ic_star_y";
          const StarIcon = getStarIcon(isFilled ? filledIcon : "ic_star_empty");

          if (readonly) {
            return <StarIcon key={star} className={cn("flex-shrink-0", sizeClasses)} />;
          }

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              disabled={disabled}
              className={cn("flex-shrink-0 transition-transform", "cursor-pointer hover:scale-110 active:scale-95")}
              aria-label={`${star}점`}
            >
              <StarIcon className={cn("flex-shrink-0", sizeClasses)} />
            </button>
          );
        })}
      </div>
      {readonly && nickname && (
        <span className="ml-4 text-12-regular text-gray-600 md:text-14-regular">{nickname}</span>
      )}
    </div>
  );
}
