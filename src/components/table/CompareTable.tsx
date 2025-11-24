"use client";

import React, { useEffect, useState, useCallback } from "react";
import Button from "@/components/Button";
import ReplaceModal from "@/components/compare/ReplaceModal";
import { compareProducts, ProductSummary, MetricKey, CompareResult, MetricResult } from "@/utils/compareUtils";

type CompareSide = "left" | "right";

const STORAGE_KEY = "mogazoa:compare-products";

// ==========================================================
// 이미지 경로 정의
// ==========================================================
const ASSET_PATHS = {
  DEFAULT_A: "/assets/images/compare/compare_default_A.png",
  DEFAULT_B: "/assets/images/compare/compare_default_B.png",
  BADGE_A: "/assets/images/compare/compare_a.png",
  BADGE_B: "/assets/images/compare/compare_b.png",
  WIN_BADGE: "/assets/images/compare/win.png",
};

// ==========================================================
// 메트릭 레이블
// ==========================================================
const METRIC_LIST: { key: MetricKey; label: string; icon: string }[] = [
  { key: "rating", label: "별점", icon: "⭐" },
  { key: "reviewCount", label: "리뷰 개수", icon: "📝" },
  { key: "favoriteCount", label: "찜 개수", icon: "🫶🏻" },
];

// ==========================================================
// API 응답 타입 정의
// ==========================================================
interface ProductApiResponse {
  id: number;
  name: string;
  image?: string | null;
  rating: number;
  favoriteCount: number;
  reviewCount: number;
}

interface SearchApiResponse {
  list?: ProductApiResponse[];
}

// ==========================================================
// API 베이스 URL
// ==========================================================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE 환경 변수가 설정되어 있지 않습니다.");
}

// ----------------------------------------------------------
// 상품 단건 조회
// ----------------------------------------------------------
async function fetchProductById(id: number): Promise<ProductSummary> {
  const url = `${API_BASE}/products/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("상품 조회 실패");
  }

  const data: ProductApiResponse = await res.json();

  return {
    id: data.id,
    name: data.name,
    thumbnailUrl: data.image ?? null,
    rating: data.rating,
    favoriteCount: data.favoriteCount,
    reviewCount: data.reviewCount,
  };
}

// ----------------------------------------------------------
// 상품 검색
// ----------------------------------------------------------
async function searchProductsApi(keyword: string): Promise<ProductSummary[]> {
  if (!keyword.trim()) return [];

  try {
    const url = `${API_BASE}/products?query=${encodeURIComponent(keyword)}&size=5`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error("searchProductsApi not ok:", res.status, res.statusText);
      return [];
    }

    const json: SearchApiResponse = await res.json();
    const items: ProductApiResponse[] = json.list ?? [];

    return items.map(p => ({
      id: p.id,
      name: p.name,
      thumbnailUrl: p.image ?? null,
      rating: p.rating,
      favoriteCount: p.favoriteCount,
      reviewCount: p.reviewCount,
    }));
  } catch (error) {
    console.error("searchProductsApi error:", error);
    return [];
  }
}

// ==========================================================
// ComparePage
// ==========================================================
export default function ComparePage() {
  const [selected, setSelected] = useState<{
    left: ProductSummary | null;
    right: ProductSummary | null;
  }>({
    left: null,
    right: null,
  });

  const [keyword, setKeyword] = useState<{ left: string; right: string }>({
    left: "",
    right: "",
  });

  const [searchResult, setSearchResult] = useState<{
    left: ProductSummary[];
    right: ProductSummary[];
  }>({
    left: [],
    right: [],
  });

  const [isComparing, setIsComparing] = useState(false);
  const [compareData, setCompareData] = useState<CompareResult | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    side: CompareSide | null;
    newProduct: ProductSummary | null;
  }>({
    isOpen: false,
    side: null,
    newProduct: null,
  });

  // --------------------------------------------------------
  // 초기 로딩: 저장된 상품 복원
  // --------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { leftId: number | null; rightId: number | null };

      (async () => {
        const left = parsed.leftId ? await fetchProductById(parsed.leftId) : null;
        const right = parsed.rightId ? await fetchProductById(parsed.rightId) : null;

        setSelected({ left, right });
        setKeyword({
          left: left?.name ?? "",
          right: right?.name ?? "",
        });
      })();
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // --------------------------------------------------------
  // 선택된 상품 ID 로컬스토리지 저장 + 비교 결과 초기화
  // --------------------------------------------------------
  const persistIds = useCallback((next: { left: ProductSummary | null; right: ProductSummary | null }) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        leftId: next.left?.id ?? null,
        rightId: next.right?.id ?? null,
      }),
    );
    setCompareData(null);
  }, []);

  // --------------------------------------------------------
  // 상품 선택 & 교체
  // --------------------------------------------------------
  const handleSelectProduct = (side: CompareSide, product: ProductSummary) => {
    if (selected.left && selected.right) {
      // 이미 두 개 다 찼으면 교체 모달
      setModalState({ isOpen: true, side, newProduct: product });
      setSearchResult(prev => ({ ...prev, [side]: [] }));
      return;
    }

    setSelected(prev => {
      const next = { ...prev, [side]: product };
      persistIds(next);
      return next;
    });

    setKeyword(prev => ({ ...prev, [side]: product.name }));
    setSearchResult(prev => ({ ...prev, [side]: [] }));
  };

  const handleConfirmReplace = (sideToKeep: CompareSide, newProduct: ProductSummary) => {
    const sideToReplace: CompareSide = sideToKeep === "left" ? "right" : "left";

    setSelected(prev => {
      const next = { ...prev, [sideToReplace]: newProduct };
      persistIds(next);
      return next;
    });

    setKeyword(prev => ({ ...prev, [sideToReplace]: newProduct.name }));
    setModalState({ isOpen: false, side: null, newProduct: null });
  };

  // --------------------------------------------------------
  // 선택 해제
  // --------------------------------------------------------
  const handleClear = (side: CompareSide) => {
    setSelected(prev => {
      const next = { ...prev, [side]: null };
      persistIds(next);
      return next;
    });

    setKeyword(prev => ({ ...prev, [side]: "" }));
    setSearchResult(prev => ({ ...prev, [side]: [] }));
  };

  // --------------------------------------------------------
  // 검색
  // --------------------------------------------------------
  const searchProducts = useCallback(async (side: CompareSide, value: string) => {
    if (!value.trim()) {
      setSearchResult(prev => ({ ...prev, [side]: [] }));
      return;
    }
    const list = await searchProductsApi(value);
    setSearchResult(prev => ({ ...prev, [side]: list }));
  }, []);

  const handleChangeKeyword = (side: CompareSide, value: string) => {
    setKeyword(prev => ({ ...prev, [side]: value }));
    searchProducts(side, value);
  };

  // --------------------------------------------------------
  // 비교 실행
  // --------------------------------------------------------
  const handleCompare = async () => {
    if (!selected.left || !selected.right) return;

    setIsComparing(true);
    setCompareData(null);

    try {
      const [freshLeft, freshRight] = await Promise.all([
        fetchProductById(selected.left.id),
        fetchProductById(selected.right.id),
      ]);

      setSelected({ left: freshLeft, right: freshRight });

      const result = compareProducts(freshLeft, freshRight);
      setCompareData(result);
    } catch {
      alert("상품 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsComparing(false);
    }
  };

  const isReady = !!(selected.left && selected.right);
  const selectedCount = (selected.left ? 1 : 0) + (selected.right ? 1 : 0);

  const buttonLabel = isComparing
    ? "비교 중..."
    : isReady
      ? "상품 비교하기"
      : `비교할 상품 2개를 입력해 주세요 (${selectedCount}/2)`;

  return (
    <div className="px-4 py-10 md:px-10 lg:px-24">
      <h1 className="mb-10 text-center text-32-bold">둘 중 뭐가 더 나을까?</h1>

      {/* 상단 비교 영역 */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-[1280px] grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* LEFT */}
          <div className="flex justify-center md:justify-end lg:justify-start">
            <ProductSlot
              side="left"
              product={selected.left}
              keyword={keyword.left}
              onKeywordChange={value => handleChangeKeyword("left", value)}
              results={searchResult.left}
              onSelectProduct={product => handleSelectProduct("left", product)}
              onClear={() => handleClear("left")}
            />
          </div>

          {/* VS (데스크톱) */}
          <div className="hidden items-center justify-center pt-32 md:flex lg:pt-36">
            <span className="text-40-bold text-gray-500">VS</span>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center md:justify-start lg:justify-end">
            <ProductSlot
              side="right"
              product={selected.right}
              keyword={keyword.right}
              onKeywordChange={value => handleChangeKeyword("right", value)}
              results={searchResult.right}
              onSelectProduct={product => handleSelectProduct("right", product)}
              onClear={() => handleClear("right")}
            />
          </div>
        </div>
      </div>

      {/* 모바일 VS */}
      <div className="mt-6 flex items-center justify-center md:hidden">
        <span className="text-40-bold text-gray-500">VS</span>
      </div>

      {/* 비교하기 버튼 */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <Button
          type="button"
          variant="primary"
          styleClass="w-full max-w-md !h-[56px]"
          onClick={handleCompare}
          disabled={!isReady || isComparing}
        >
          {buttonLabel}
        </Button>
      </div>

      {/* 결과 섹션 */}
      {compareData && selected.left && selected.right && (
        <CompareResultSection left={selected.left} right={selected.right} data={compareData} />
      )}

      {/* 교체 모달 */}
      <ReplaceModal
        state={modalState}
        selected={selected}
        onClose={() => setModalState({ isOpen: false, side: null, newProduct: null })}
        onConfirmReplace={handleConfirmReplace}
      />
    </div>
  );
}

// ==========================================================
// ProductSlot (A / B 한쪽 카드)
// ==========================================================
type ProductSlotProps = {
  side: CompareSide;
  product: ProductSummary | null;
  keyword: string;
  onKeywordChange: (value: string) => void;
  results: ProductSummary[];
  onSelectProduct: (product: ProductSummary) => void;
  onClear: () => void;
};

function ProductSlot({ side, product, keyword, onKeywordChange, results, onSelectProduct, onClear }: ProductSlotProps) {
  const isLeft = side === "left";

  // 위쪽 정사각형: 상품 이미지 / 없으면 A,B 배지
  const badgeFallback = isLeft ? ASSET_PATHS.BADGE_A : ASSET_PATHS.BADGE_B;
  const badgeSizeClass = "h-[180px] w-[180px] rounded-[20px]";

  // 아래 큰 카드: 기본 이미지는 DEFAULT_A/B, 선택 시 숫자 테이블
  const defaultCardImage = isLeft ? ASSET_PATHS.DEFAULT_A : ASSET_PATHS.DEFAULT_B;
  const cardSizeClass = "h-[282px] w-[405px] rounded-[20px]";

  const getMetricValue = (p: ProductSummary, key: MetricKey) => {
    if (key === "rating") return p.rating;
    if (key === "favoriteCount") return p.favoriteCount;
    return p.reviewCount;
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[500px] flex-col items-center gap-10">
      {/* 1. 상단 A/B + 상품 이미지 */}
      <div className="flex flex-col items-center">
        <img
          src={product?.thumbnailUrl ?? badgeFallback}
          alt={product?.name ?? (isLeft ? "A 배지" : "B 배지")}
          className={`${badgeSizeClass} overflow-hidden bg-gray-200 object-cover`}
        />
      </div>

      {/* 2. 인풋 박스 + 자동완성 */}
      <div className="relative flex w-full justify-center">
        <div className="flex w-full max-w-[350px] items-center gap-3 rounded-full border-[2px] border-dashed border-[#FD7E35] bg-white px-5 py-[18px] shadow-sm">
          <input
            value={keyword}
            onChange={e => onKeywordChange(e.target.value)}
            placeholder={product ? product.name : "상품명을 입력해주세요"}
            className="flex-1 truncate bg-transparent text-16-medium text-gray-900 outline-none placeholder:text-gray-500"
            readOnly={!!product}
          />

          {product && (
            <button type="button" onClick={onClear} className="text-14-medium text-[#FD7E35] hover:text-red-500">
              삭제
            </button>
          )}
        </div>

        {/* 자동완성 목록 */}
        {results.length > 0 && keyword.trim() && !product && (
          <ul className="absolute left-1/2 top-full z-10 mt-1 max-h-60 w-full max-w-[350px] -translate-x-1/2 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {results.map(item => (
              <li
                key={item.id}
                className="cursor-pointer px-4 py-2 text-14-regular hover:bg-gray-50"
                onClick={() => onSelectProduct(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. 큰 카드 + (A 쪽) 메트릭 라벨 리스트 */}
      <div className="mt-4 flex items-center justify-center gap-8">
        {/* 왼쪽: 아이콘 + 텍스트 (A만 표시) */}
        {isLeft && (
          <ul className="flex flex-col gap-6 text-14-medium text-gray-500">
            {METRIC_LIST.map(m => (
              <li key={m.key} className="flex items-center gap-2">
                <span className="text-[18px]" aria-hidden>
                  {m.icon}
                </span>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 오른쪽: 큰 카드 */}
        {!product ? (
          // 상품 없을 때: DEFAULT_A/B 이미지 그대로
          <div className={`${cardSizeClass} overflow-hidden shadow-lg`}>
            <img
              src={defaultCardImage}
              alt={isLeft ? "비교할 상품 A를 입력해 주세요" : "비교할 상품 B를 입력해 주세요"}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          // 상품 있을 때: 카드 안에 숫자 테이블
          <div className={`${cardSizeClass} overflow-hidden bg-white shadow-lg`}>
            <div className="flex h-full flex-col justify-center px-12">
              <ul className="flex flex-col gap-6 text-16-medium text-gray-900">
                {METRIC_LIST.map(m => (
                  <li key={m.key} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="text-[18px]" aria-hidden>
                        {m.icon}
                      </span>
                      <span>{m.label}</span>
                    </span>
                    <span className="text-16-bold">
                      {getMetricValue(product, m.key).toLocaleString()}
                      {m.key === "rating" ? "" : "개"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================
// 결과 섹션 (승리 / 무승부 상태)
// ==========================================================
type CompareResultSectionProps = {
  left: ProductSummary;
  right: ProductSummary;
  data: CompareResult;
};

function metricLabel(metric: MetricKey): string {
  if (metric === "rating") return "별점";
  if (metric === "favoriteCount") return "찜 개수";
  return "리뷰 개수";
}

function CompareResultSection({ left, right, data }: CompareResultSectionProps) {
  const { results, overall } = data;

  const overallText =
    overall === "draw"
      ? "둘 다 좋은 선택이에요!"
      : `${overall === "left" ? `'${left.name}'` : `'${right.name}'`} 이(가) 승리했어요!`;

  const getWinnerName = (winner: "left" | "right" | "draw") => {
    if (winner === "draw") return "무승부";
    return winner === "left" ? left.name : right.name;
  };

  return (
    <section className="mt-16">
      <p className="mb-3 text-center text-24-bold text-primary-600">{overallText}</p>
      <p className="mb-8 text-center text-14-regular text-gray-500">상품을 선택하는 데 참고해 보세요!</p>

      {overall !== "draw" && (
        <div className="mx-auto mb-8 flex max-w-3xl justify-center">
          <img src={ASSET_PATHS.WIN_BADGE} alt="WIN" className="w-24" />
        </div>
      )}

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
        <table className="w-full text-center text-14-regular">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 text-16-bold">{left.name}</th>
              <th className="py-3 text-16-bold">항목</th>
              <th className="py-3 text-16-bold">{right.name}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: MetricResult) => {
              const isLeftWin = r.winner === "left";
              const isRightWin = r.winner === "right";
              const isDraw = r.winner === "draw";

              return (
                <tr key={r.metric} className="border-t border-gray-100">
                  <td className={`py-3 ${isLeftWin ? "font-semibold text-primary-600" : ""}`}>
                    {r.leftValue.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="text-14-medium">{metricLabel(r.metric)}</div>
                    <div className="mt-1 text-12-regular text-gray-500">
                      {isDraw ? (
                        <>무승부</>
                      ) : (
                        <>
                          {getWinnerName(r.winner)}이(가) {r.diff.toLocaleString()} 만큼 더 우세해요.
                        </>
                      )}
                    </div>
                  </td>
                  <td className={`py-3 ${isRightWin ? "font-semibold text-primary-600" : ""}`}>
                    {r.rightValue.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
