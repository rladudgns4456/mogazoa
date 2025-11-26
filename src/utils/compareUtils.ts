// src/utils/compareUtils.ts

// 비교에 사용할 메트릭 키
export type MetricKey = "rating" | "reviewCount" | "favoriteCount";

// 화면에서 쓸 상품 요약 타입
export interface ProductSummary {
  id: number;
  name: string;
  thumbnailUrl: string | null;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
}

// 개별 메트릭 비교 결과
export interface MetricResult {
  metric: MetricKey;
  leftValue: number;
  rightValue: number;
  diff: number;
  winner: "left" | "right" | "draw";
}

// 전체 비교 결과
export interface CompareResult {
  results: MetricResult[];
  overall: "left" | "right" | "draw";
}

/**
 * 두 상품을 메트릭별로 비교해서 결과를 반환
 */
export function compareProducts(left: ProductSummary, right: ProductSummary): CompareResult {
  const metrics: MetricKey[] = ["rating", "reviewCount", "favoriteCount"];

  const results: MetricResult[] = metrics.map(metric => {
    const leftValue = left[metric] ?? 0;
    const rightValue = right[metric] ?? 0;

    let winner: "left" | "right" | "draw" = "draw";
    if (leftValue > rightValue) winner = "left";
    else if (rightValue > leftValue) winner = "right";

    return {
      metric,
      leftValue,
      rightValue,
      diff: Math.abs(leftValue - rightValue),
      winner,
    };
  });

  // 전체 승/패 계산
  let leftWins = 0;
  let rightWins = 0;

  results.forEach(r => {
    if (r.winner === "left") leftWins += 1;
    if (r.winner === "right") rightWins += 1;
  });

  let overall: "left" | "right" | "draw" = "draw";
  if (leftWins > rightWins) overall = "left";
  else if (rightWins > leftWins) overall = "right";

  return { results, overall };
}
