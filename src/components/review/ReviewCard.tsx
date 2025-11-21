"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Review } from "@/types/review";
import { ThumbButton } from "@/components/thumbs";
import StarRating from "./StarRating";
import cn from "clsx";

interface ReviewCardProps {
  review: Review;
  onLike?: (reviewId: number) => void;
}

/**
 * 리뷰 카드 컴포넌트
 * - 리뷰어 정보, 별점, 리뷰 내용, 이미지, 좋아요 수 표시
 * - 내가 작성한 리뷰면 수정/삭제 버튼 표시
 */
export default function ReviewCard({ review, onLike }: ReviewCardProps) {
  const { id, user, rating, content, reviewImages, createdAt } = review;

  // 로컬 상태로 좋아요 관리 (낙관적 업데이트)
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  // 날짜 포맷팅 (YYYY-MM-DD) - memoization
  const formattedDate = useMemo(() => createdAt.split("T")[0], [createdAt]);

  // 좋아요 토글 핸들러
  const handleClickLike = async () => {
    // 낙관적 업데이트 (UI 즉시 반영)
    const newIsLiked = !isLiked;
    const delta = newIsLiked ? 1 : -1;

    setIsLiked(newIsLiked);
    setLikeCount(prev => prev + delta);

    try {
      // 부모 컴포넌트의 onLike 호출 (API 요청)
      await onLike?.(id);
    } catch (error) {
      // 실패 시 롤백
      setIsLiked(!newIsLiked);
      setLikeCount(prev => prev - delta);
    }
  };

  return (
    <div className={cn("rounded-20 bg-white px-20 py-24 shadow md:px-40")}>
      {/* 헤더: 리뷰어 정보 + 날짜 */}
      <div className={cn("mb-12 flex items-start justify-between")}>
        <Link href={`/user/${user.id}`} className={cn("flex items-center gap-12 hover:opacity-90")}>
          {/* 별점(닉네임포함) */}
          <div>
            <StarRating rating={rating} readonly nickname={user.nickname} />
          </div>
        </Link>

        <span className={cn("text-12-regular text-gray-700 md:text-14-regular")}>{formattedDate}</span>
      </div>

      <p className={cn("mb-12 whitespace-pre-wrap text-16-regular text-gray-900")}>{content}</p>

      {reviewImages.length > 0 && (
        <div className={cn("mb-12 flex gap-12")}>
          {reviewImages.map(img => (
            <div key={img.id} className={cn("relative size-64 overflow-hidden rounded-8 md:size-100")}>
              {!loadedImages.has(img.id) && <div className={cn("absolute inset-0 animate-pulse bg-gray-300")} />}
              <Image
                src={img.source}
                alt="리뷰 이미지"
                fill
                className={cn("object-cover", {
                  "opacity-0": !loadedImages.has(img.id),
                })}
                onLoad={() => setLoadedImages(prev => new Set(prev).add(img.id))}
              />
            </div>
          ))}
        </div>
      )}

      {/* 하단: 좋아요 버튼*/}
      <div className={cn("flex items-center justify-end")}>
        <ThumbButton
          label="도움이 돼요"
          count={likeCount}
          variant={isLiked ? "dark" : "light"}
          onClick={handleClickLike}
        />
      </div>
    </div>
  );
}
