import cn from "clsx";
import NotCardImage from "@/assets/images/not_card.svg";

interface EmptyReviewCardProps {
  message?: string;
  className?: string;
}

/**
 * 빈 리뷰 카드 컴포넌트
 * - 리뷰가 없을 때 표시되는 카드
 */
export default function EmptyReviewCard({ message = "첫 리뷰를 작성해 보세요!", className }: EmptyReviewCardProps) {
  return (
    <div className={cn("w-full rounded-20 bg-gray-200 py-24 text-center", className)}>
      <NotCardImage className="mx-auto mb-20 size-160" />
      <p className={cn("mb-35 text-16-medium text-gray-600")}>{message}</p>
    </div>
  );
}
