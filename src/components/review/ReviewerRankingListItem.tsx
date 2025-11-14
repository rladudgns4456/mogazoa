import { Reviewer, ReviewerRankingItemProps } from "@/types/review";
import { formatNumber } from "@/utils/formatNumber";
import Link from "next/link";
import cn from "clsx";

// 4등 이하 리뷰어 리스트 아이템 컴포넌트
export default function ReviewerRankingListItem({ reviewer, rank }: ReviewerRankingItemProps) {
  return (
    <li className={cn("w-full", "md:w-[47%] lg:w-full")}>
      <Link
        href={`/user/${reviewer.id}`}
        className={cn("flex cursor-pointer items-center justify-between gap-8 rounded-8 px-8 py-8")}
      >
        <div className="flex items-center gap-8">
          <span
            className={cn(
              "w-32 flex-shrink-0 rounded-full bg-gray-200 px-4 py-2 text-center text-12-medium text-gray-700",
            )}
          >
            {rank}등
          </span>
          <p className={cn("truncate text-14-regular text-gray-900", "md:text-16-regular")}>{reviewer.nickname}</p>
        </div>
        <div className={cn("flex items-center gap-8 text-12-regular text-gray-500")}>
          <span>팔로워 {formatNumber(reviewer.followersCount)}</span>
          <span>리뷰 {formatNumber(reviewer.reviewCount)}</span>
        </div>
      </Link>
    </li>
  );
}
