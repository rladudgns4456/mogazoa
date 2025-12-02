import { Reviewer, ReviewerRankingProps } from "@/types/review";
import ReviewerRankingTopItem from "./ReviewerRankingTopItem";
import ReviewerRankingListItem from "./ReviewerRankingListItem";
import cn from "clsx";

// 메인 랭킹 컴포넌트
export default function ReviewerRanking({ reviewers }: ReviewerRankingProps) {
  if (!reviewers || reviewers.length === 0) {
    return (
      <aside className={cn("w-full")}>
        <h2 className={cn("header4-bold mb-20 ml-18", "md:ml-62 lg:ml-0")}>리뷰어 랭킹</h2>
        <p className={cn("py-40 text-center text-14 text-gray-500")}>랭킹 정보가 없습니다.</p>
      </aside>
    );
  }

  // reviewCount 기준 내림차순 정렬
  const sortedReviewers = [...reviewers].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className={cn("w-full")}>
      <h2 className={cn("header4-bold mb-20 ml-18", "md:ml-62 lg:ml-0")}>리뷰어 랭킹</h2>
      <div
        className={cn(
          "mx-18 flex flex-col items-center justify-evenly gap-32",
          "md:mx-62 md:gap-52 lg:mx-0 lg:flex-row lg:gap-32",
        )}
      >
        {/* 상위 1~3등 */}
        <div className={cn("grid w-full grid-cols-3 items-center gap-10", "md:gap-40")}>
          {[1, 0, 2].map(reviewerIndex => {
            const reviewer = sortedReviewers[reviewerIndex];
            if (!reviewer) return null; // 안전 검사
            return (
              <div key={reviewer.id}>
                <ReviewerRankingTopItem reviewer={reviewer} rank={reviewerIndex + 1} />
              </div>
            );
          })}
        </div>

        {/* 4등 이하 */}
        {sortedReviewers.length > 3 && (
          <div className={cn("w-full px-8", "lg:w-3/5")}>
            <ul
              className={cn(
                "flex flex-wrap justify-between border-t pt-16",
                "md:pt-30 lg:border-l lg:border-t-0 lg:pl-32 lg:pt-0",
              )}
            >
              {sortedReviewers.slice(3, 7).map((reviewer, index) => (
                <ReviewerRankingListItem key={reviewer.id} reviewer={reviewer} rank={index + 4} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
