// src/app/compare/compare-utils.ts

/**
 * 비교에 사용할 지표 key
 */
export type MetricKey = "rating" | "favoriteCount" | "viewCount";

/**
 * 비교에 필요한 최소한의 상품 정보
 * 실제 API 응답 필드명에 맞게 매핑해서 채워주면 됩니다.
 */
export type ProductSummary = {
  id: number;
  name: string;
  thumbnailUrl: string | null;
  rating: number; // 별점
  favoriteCount: number; // 찜 개수
  viewCount: number; // 조회수
};

/**
 * 지표별 비교 결과
 */
export type MetricResult = {
  metric: MetricKey;
  leftValue: number;
  rightValue: number;
  diff: number; // 두 값 차이 (절대값)
  winner: "left" | "right" | "draw";
};

/**
 * 최종 비교 결과
 */
export type CompareResult = {
  results: MetricResult[]; // 지표별 비교 결과
  overall: "left" | "right" | "draw"; // 전체 승자
  leftWins: number; // 왼쪽이 이긴 지표 개수
  rightWins: number; // 오른쪽이 이긴 지표 개수
};

/**
 * 두 상품을 비교해서 지표별/전체 결과를 계산하는 함수
 */
export function compareProducts(left: ProductSummary, right: ProductSummary): CompareResult {
  const metrics: MetricKey[] = ["rating", "favoriteCount", "viewCount"];

  const results: MetricResult[] = metrics.map(metric => {
    const leftValue = left[metric];
    const rightValue = right[metric];

    if (leftValue > rightValue) {
      return {
        metric,
        leftValue,
        rightValue,
        diff: leftValue - rightValue,
        winner: "left",
      };
    }

    if (rightValue > leftValue) {
      return {
        metric,
        leftValue,
        rightValue,
        diff: rightValue - leftValue,
        winner: "right",
      };
    }

    // 무승부
    return {
      metric,
      leftValue,
      rightValue,
      diff: 0,
      winner: "draw",
    };
  });

  const leftWins = results.filter(r => r.winner === "left").length;
  const rightWins = results.filter(r => r.winner === "right").length;

  let overall: "left" | "right" | "draw" = "draw";
  if (leftWins > rightWins) overall = "left";
  else if (rightWins > leftWins) overall = "right";

  return { results, overall, leftWins, rightWins };
}
