// 상품 기본 정보 타입
export type ProductSummary = {
  id: number;
  name: string;
  thumbnailUrl: string | null;
  rating: number; // 별점
  favoriteCount: number; // 찜 개수
  viewCount: number; // (현재 용도: 리뷰 개수)
};

// 비교에 사용되는 메트릭 키
export type MetricKey = "rating" | "favoriteCount" | "viewCount";

// 한 메트릭에 대한 승자 정보
export type MetricResult = {
  metric: MetricKey;
  leftValue: number;
  rightValue: number;
  winner: "left" | "right" | "draw";
  /** 두 값 차이의 절댓값 (항상 양수 또는 0) */
  diff: number;
};

// 전체 비교 결과
export type CompareResult = {
  results: MetricResult[];
  /** 전체 승자: left / right / draw */
  overall: "left" | "right" | "draw";
};

// 비교에 사용할 메트릭 목록 (순서 유지)
const METRICS: MetricKey[] = ["rating", "viewCount", "favoriteCount"];

/**
 * 개별 메트릭 비교 유틸
 */
function compareMetric(
  leftValue: number,
  rightValue: number,
): {
  winner: "left" | "right" | "draw";
  diff: number;
} {
  if (leftValue === rightValue) {
    return { winner: "draw", diff: 0 };
  }

  const winner = leftValue > rightValue ? "left" : "right";
  const diff = Math.abs(leftValue - rightValue);

  return { winner, diff };
}

/**
 * 두 상품을 메트릭별로 비교하고 전체 승자를 계산
 */
export function compareProducts(left: ProductSummary, right: ProductSummary): CompareResult {
  const results: MetricResult[] = METRICS.map(metric => {
    const leftValue = left[metric];
    const rightValue = right[metric];

    const { winner, diff } = compareMetric(leftValue, rightValue);

    return {
      metric,
      leftValue,
      rightValue,
      winner,
      diff,
    };
  });

  // 전체 승자 계산: 메트릭별 승 수를 기준으로 판단
  let leftWinCount = 0;
  let rightWinCount = 0;

  results.forEach(r => {
    if (r.winner === "left") leftWinCount += 1;
    else if (r.winner === "right") rightWinCount += 1;
  });

  let overall: "left" | "right" | "draw" = "draw";
  if (leftWinCount > rightWinCount) overall = "left";
  else if (rightWinCount > leftWinCount) overall = "right";
  // 같으면 그대로 draw 유지

  return {
    results,
    overall,
  };
}
