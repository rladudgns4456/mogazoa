import cn from "clsx";
import { formatNumber } from "@/utils/formatNumber";

export interface StatisticsProps {
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  categoryMetric?: {
    rating: number;
    favoriteCount: number;
    reviewCount: number;
  };
}

const Statistics = ({ rating, reviewCount, favoriteCount, categoryMetric }: StatisticsProps) => {
  // 차이값 계산
  const getDiff = (value: number, average?: number): number | null => {
    if (average === undefined) return null;
    return value - average;
  };

  // 차이값 포맷팅
  const formatDiff = (diff: number): string => {
    const absDiff = Math.abs(diff);
    const sign = diff > 0 ? "+" : "";

    if (absDiff >= 1000) {
      return `${sign}${Math.floor(absDiff / 1000)}K`;
    }
    return `${sign}${absDiff}`;
  };

  const stats = [
    {
      value: rating,
      label: "별점 평균",
      categoryAverage: categoryMetric?.rating,
      isRating: true,
    },
    {
      value: favoriteCount,
      label: "찜",
      categoryAverage: categoryMetric?.favoriteCount,
      isRating: false,
    },
    {
      value: reviewCount,
      label: "리뷰",
      categoryAverage: categoryMetric?.reviewCount,
      isRating: false,
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-20 text-center text-black", "md:flex-nowrap")}>
      {stats.map((stat, index) => {
        const diff = getDiff(stat.value, stat.categoryAverage);
        return (
          <div
            key={index}
            className={cn(
              "flex h-106 w-full flex-col flex-wrap justify-center rounded-20 border bg-white px-30 shadow",
              "md:h-190",
            )}
          >
            <div className={cn("border-r border-r-gray-300 text-left", "md:border-0 md:text-center")}>
              <p className={cn("text-28-bold")}>{stat.isRating ? stat.value.toFixed(1) : formatNumber(stat.value)}</p>
              <p className={cn("text-16-medium text-gray-600")}>{stat.label}</p>
            </div>

            {diff !== null && diff !== 0 && (
              <p className={cn("text-14-regular text-gray-600", "md:mt-16 md:border-t md:border-t-gray-300 md:pt-16")}>
                같은 카테고리의 제품들보다
                <br />
                <span className={cn(diff > 0 ? "text-primary-500" : "text-gray-900")}>
                  {stat.isRating ? formatDiff(parseFloat(diff.toFixed(1))) : formatDiff(diff)}
                  {stat.isRating ? "점" : "개"}
                </span>{" "}
                더 {stat.isRating ? (diff > 0 ? "높아요!" : "낮아요!") : diff > 0 ? "많아요!" : "적어요!"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
