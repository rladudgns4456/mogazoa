import { Reviewer, ReviewerRankingItemProps } from "@/types/review";
import { formatNumber } from "@/utils/formatNumber";
import RankBadge from "./RankBadge";
import cn from "clsx";
import Link from "next/link";
import Image from "next/image";

// 1~3등 리뷰어 컴포넌트
export default function ReviewerRankingTopItem({ reviewer, rank }: ReviewerRankingItemProps) {
  return (
    <Link href={`/user/${reviewer.id}`} className={cn("flex w-full flex-col items-center rounded-8")}>
      {/* 프로필 이미지 */}
      <div className={cn("relative mb-8", "md:mb-20")}>
        <div
          className={cn(
            "overflow-hidden rounded-full border-2 border-white shadow-md",
            rank === 1 ? "h-64 w-64 md:h-100 md:w-100" : "h-56 w-56 md:h-84 md:w-84",
          )}
        >
          <Image
            src={reviewer.image}
            alt={`${reviewer.nickname} 프로필`}
            width={rank === 1 ? 100 : 84}
            height={rank === 1 ? 100 : 84}
            className={cn("h-full w-full object-cover")}
          />
        </div>
        {/* 등수 뱃지 */}
        <RankBadge rank={rank as 1 | 2 | 3} />
      </div>

      {/* 유저 정보 */}
      <div className={cn("w-full text-center")}>
        <p
          className={cn(
            "mb-8 truncate text-gray-900",
            rank === 1 ? "text-14-medium md:text-18-bold" : "text-14-medium md:text-16-bold",
          )}
        >
          {reviewer.nickname}
        </p>
        <div
          className={cn(
            "text-11-regular flex items-center justify-center gap-6 text-gray-500",
            "md:gap-16 md:text-14-regular",
          )}
        >
          <span>팔로워 {formatNumber(reviewer.followersCount)}</span>
          <span>리뷰 {formatNumber(reviewer.reviewCount)}</span>
        </div>
      </div>
    </Link>
  );
}
