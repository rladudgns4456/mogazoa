"use client";

import { getStarIcon } from "@/assets/icons/star/icons";
import cn from "clsx";
import { useEffect, useState, useRef } from "react";

// StarRating 컴포넌트 별점 0~5점

interface StarRatingProps {
  rating?: number; // 별점 값 (0~5점)
  onChange?: (rating: number) => void; // 별점 변경 콜백 (readonly=false일 때만 작동)
  readonly?: boolean; // 읽기 전용 여부
  nickname?: string; // 별점 옆에 표시할 닉네임 (readonly=true일 때만 표시)
  className?: string;
  disabled?: boolean;
  value?: number;
}

export default function StarRating({
  rating = 0,
  onChange,
  readonly = false,
  nickname,
  className,
  disabled = false,
  value,
}: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isRating, setIsRating] = useState<boolean[]>([]);

  useEffect(() => {
    if (value) {
      const button = document.querySelectorAll(`#starRating button`);
      console.log(value);
      if (button.length > 0) {
        setTimeout(() => {
          for (let i = 0; i < value; i++) {
            (button[i] as HTMLElement).focus();
          }
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const starArr = Array.from({ length: 5 }, () => false); //별 길이 만큼 배열 생성
    setIsRating(starArr);
  }, []);

  // 반응형 크기: 모바일(기본) → PC/태블릿(md 이상)
  const sizeClasses = readonly ? "w-10 h-10 md:w-15 md:h-15" : "w-23 h-23 md:w-33 md:h-33";

  const gap = readonly ? "gap-2" : "gap-8";

  const handleClick = (e: React.MouseEvent, star: number) => {
    if (readonly || disabled) return;
    const rating = e.currentTarget.id;
    const newRating = isRating.map((_, i) => {
      if (i <= Number(rating)) {
        return true;
      } else {
        return false;
      }
    });

    setIsRating(newRating);
    onChange?.(star);
  };

  const handleMouseEnter = (e: React.MouseEvent, star: number) => {
    if (readonly || disabled) return;
    setHoveredStar(star);
  };

  const handleFocus = (e: React.FocusEvent, star: number) => {
    if (readonly || disabled) return;
    setHoveredStar(star);
  };

  //현재 점수 유지 하면서 null
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!readonly) {
      const rating = isRating.filter(value => value === true).length;
      setHoveredStar(rating);
    }
  };

  const displayRating = readonly ? rating : (hoveredStar ?? rating);

  return (
    <div className={cn("flex items-center", gap, className)} onMouseLeave={handleMouseLeave} id="starRating">
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
              id={`${star - 1}`}
              type="button"
              tabIndex={0}
              onClick={e => handleClick(e, star)}
              onFocus={e => handleFocus(e, star)}
              onMouseEnter={e => handleMouseEnter(e, star)}
              // disabled={disabled}
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
