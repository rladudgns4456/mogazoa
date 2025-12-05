"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Review } from "@/types/review";
import { ThumbButton } from "@/components/thumbs";
import StarRating from "./StarRating";
import { useAuth } from "@/components/login/AuthContext";
import { isValidImageUrl } from "@/utils/validateImageUrl";
import { useToast } from "@/components/toast";
import { Toast } from "@/components/toast";
import cn from "clsx";

interface ReviewCardProps {
  review: Review; // 리뷰 데이터 객체
  onLike?: (reviewId: number) => void; // 좋아요 버튼 클릭 시 호출되는 콜백 (API 호출 등)
  showActions?: boolean; // 수정/삭제 버튼 표시 여부 (본인 리뷰일 때 true)
  onEdit?: (reviewId: number) => void; // 수정 버튼 클릭 시 호출되는 콜백
  onDelete?: (reviewId: number) => void; // 삭제 버튼 클릭 시 호출되는 콜백
  value?: number;
}

/**
 * 리뷰 카드 컴포넌트
 *
 * @description
 * - 리뷰어 정보, 별점, 리뷰 내용, 이미지, 좋아요 수 표시
 * - 본인의 리뷰인 경우 수정/삭제 버튼 표시 가능
 *
 * @example
 * ```tsx
 * // 기본 사용 (읽기 전용)
 * <ReviewCard review={reviewData} onLike={handleLike} />
 *
 * // 본인 리뷰 (수정/삭제 버튼 표시)
 * const { user } = useAuth();
 *
 * <ReviewCard
 *   review={reviewData}
 *   onLike={handleLike}
 *   showActions={user?.id === reviewData.userId}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 *
 * @important
 * - showActions는 페이지/부모 컴포넌트에서 권한 체크 후 전달해야 합니다
 */

export default function ReviewCard({ review, onLike, showActions = false, onEdit, onDelete }: ReviewCardProps) {
  const { id, user, rating, content, reviewImages, createdAt } = review;
  const { user: authUser } = useAuth();
  const { openToast } = useToast();

  // 로컬 상태로 좋아요 관리 (낙관적 업데이트)
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  // 본인 리뷰 여부 확인
  const isOwnReview = authUser?.id && user ? authUser.id === user.id : false;

  // 날짜 포맷팅 (YYYY-MM-DD) - memoization
  const formattedDate = useMemo(() => {
    if (createdAt && typeof createdAt === "string") {
      return createdAt.split("T")[0];
    }
    return "";
  }, [createdAt]);

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
      // 에러 토스트 표시
      openToast(<Toast label="다시 시도해 주세요" error />);
    }
  };

  return (
    <div className={cn("rounded-20 bg-white px-20 py-24 shadow md:px-40")}>
      {/* 헤더: 리뷰어 정보 + 날짜 */}
      <div className={cn("mb-12 flex items-start justify-between")}>
        <Link href={`/user/${user?.id}`} className={cn("flex items-center gap-12 hover:opacity-90")}>
          {/* 별점(닉네임포함) */}
          <StarRating rating={rating} readonly nickname={user?.nickname} />
        </Link>

        <span className={cn("text-12-regular text-gray-700 md:text-14-regular")}>{formattedDate}</span>
      </div>

      <p className={cn("mb-12 whitespace-pre-wrap text-16-regular text-gray-900")}>{content}</p>

      {reviewImages?.length > 0 && (
        <div className={cn("mb-12 flex gap-12")}>
          {reviewImages
            .filter(img => isValidImageUrl(img.source))
            .map(img => (
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

      {/* 하단: 좋아요 버튼 + 수정/삭제 버튼 */}
      <div className={cn("flex items-center justify-between")}>
        {/* 수정/삭제 버튼 (showActions가 true일 때만 표시) */}
        {showActions && (
          <div className={cn("flex gap-8")}>
            <button
              onClick={() => onEdit?.(id)}
              aria-label="리뷰 수정"
              className={cn(
                "bg-gray-300 px-20 py-6 text-14-regular text-gray-700",
                "transition-colors hover:bg-primary-600 hover:text-white",
                "rounded-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              )}
            >
              수정
            </button>
            <button
              onClick={() => onDelete?.(id)}
              aria-label="리뷰 삭제"
              className={cn(
                "bg-gray-300 px-20 py-6 text-14-regular text-gray-700",
                "transition-colors hover:bg-red-500 hover:text-white",
                "rounded-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              )}
            >
              삭제
            </button>
          </div>
        )}

        {/* 좋아요 버튼 */}
        <div className={cn("ml-auto")}>
          <ThumbButton
            label="도움이 돼요"
            count={likeCount}
            variant={isLiked ? "dark" : "light"}
            onClick={handleClickLike}
            disabled={isOwnReview}
          />
        </div>
      </div>
    </div>
  );
}
