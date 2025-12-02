"use client";

import CompareTable, { CompareRow, Pill, ValueCell } from "@/components/table/CompareTable";
import React, { useEffect, useState, useCallback } from "react";
import Button from "@/components/Button";
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
  image?: string | null; // swagger의 image
  thumbnailUrl?: string | null; // 혹시 이미 이렇게 내려오는 경우 대비
  rating: number;
  reviewCount: number;
  favoriteCount: number;
}

interface SearchApiResponse {
  list?: ProductApiResponse[];
}

// ==========================================================
// API 베이스 URL (환경 변수)
// ==========================================================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE 환경 변수가 설정되어 있지 않습니다.");
}

console.log("✅ API_BASE:", API_BASE);

// 공통 썸네일 추출
function getThumb(src: ProductApiResponse): string | null {
  return src.thumbnailUrl ?? src.image ?? null;
}

// ==========================================================
// API 호출 유틸
// ==========================================================

// 상품 단건 조회 (항상 최신 데이터 기준)
// 404가 나면 null을 반환해서 슬롯만 비우도록 처리
async function fetchProductById(id: number): Promise<ProductSummary | null> {
  const url = `${API_BASE}/products/${id}`;
  const res = await fetch(url);

  if (res.status === 404) {
    console.warn("상품을 찾을 수 없습니다. id:", id);
    return null;
  }

  if (!res.ok) {
    console.error("상품 조회 실패", res.status, res.statusText);
    throw new Error("상품 조회 실패");
  }

  const data: ProductApiResponse = await res.json();

  return {
    id: data.id,
    name: data.name,
    thumbnailUrl: getThumb(data),
    rating: data.rating,
    reviewCount: data.reviewCount,
    favoriteCount: data.favoriteCount,
  };
}

// 상품 검색
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
      thumbnailUrl: getThumb(p),
      rating: p.rating,
      reviewCount: p.reviewCount,
      favoriteCount: p.favoriteCount,
    }));
  } catch (error) {
    console.error("searchProductsApi error:", error);
    return [];
  }
}

// ==========================================================
// ComparePage 컴포넌트
// ==========================================================
export default function ComparePage() {
  const [selected, setSelected] = useState<{ left: ProductSummary | null; right: ProductSummary | null }>({
    left: null,
    right: null,
  });

  const [keyword, setKeyword] = useState<{ left: string; right: string }>({
    left: "",
    right: "",
  });

  const [searchResult, setSearchResult] = useState<{ left: ProductSummary[]; right: ProductSummary[] }>({
    left: [],
    right: [],
  });

  const [isComparing, setIsComparing] = useState(false);
  const [compareData, setCompareData] = useState<CompareResult | null>(null);

  // ----------------------------------------------------------
  // 초기 로딩: 저장된 상품 복원
  // ----------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    (async () => {
      try {
        const parsed = JSON.parse(raw) as { leftId: number | null; rightId: number | null };

        const [left, right] = await Promise.all([
          parsed.leftId ? fetchProductById(parsed.leftId) : Promise.resolve(null),
          parsed.rightId ? fetchProductById(parsed.rightId) : Promise.resolve(null),
        ]);

        setSelected({ left, right });
        setKeyword({
          left: "",
          right: "",
        });
      } catch (e) {
        console.error("저장된 비교 상품 복원 실패:", e);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    })();
  }, []);

  // ----------------------------------------------------------
  // 선택된 상품 ID 로컬스토리지 저장 + 비교 결과 초기화
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // 상품 선택 & 교체 (모달 없이 해당 칸만 교체)
  // ----------------------------------------------------------
  const handleSelectProduct = (side: CompareSide, product: ProductSummary) => {
    setSelected(prev => {
      const next = { ...prev, [side]: product };
      persistIds(next);
      return next;
    });

    setKeyword(prev => ({ ...prev, [side]: "" }));
    setSearchResult(prev => ({ ...prev, [side]: [] }));
  };

  // ----------------------------------------------------------
  // 선택 해제
  // ----------------------------------------------------------
  const handleClear = (side: CompareSide) => {
    setSelected(prev => {
      const next = { ...prev, [side]: null };
      persistIds(next);
      return next;
    });

    setKeyword(prev => ({ ...prev, [side]: "" }));
    setSearchResult(prev => ({ ...prev, [side]: [] }));
  };

  // ----------------------------------------------------------
  // 검색 실행
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // 비교 실행
  // ----------------------------------------------------------
  const handleCompare = async () => {
    if (!selected.left || !selected.right) return;

    setIsComparing(true);
    setCompareData(null);

    try {
      const [freshLeft, freshRight] = await Promise.all([
        fetchProductById(selected.left.id),
        fetchProductById(selected.right.id),
      ]);

      // 둘 중 하나라도 없어졌으면 안내 후 선택 상태만 갱신
      if (!freshLeft || !freshRight) {
        alert("일부 상품 정보를 찾을 수 없습니다. 다시 선택해 주세요.");
        setSelected({ left: freshLeft, right: freshRight });
        return;
      }

      setSelected({ left: freshLeft, right: freshRight });

      const result = compareProducts(freshLeft, freshRight);
      setCompareData(result);
    } catch (e) {
      console.error(e);
      alert("상품 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsComparing(false);
    }
  };

  const isReady = !!(selected.left && selected.right);
  const selectedCount = (selected.left ? 1 : 0) + (selected.right ? 1 : 0);

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
              onKeywordChange={v => handleChangeKeyword("left", v)}
              results={searchResult.left}
              onSelectProduct={p => handleSelectProduct("left", p)}
              onClear={() => handleClear("left")}
              overallWinner={compareData?.overall ?? null}
              metricResults={compareData?.results ?? null}
            />
          </div>

          {/* VS (데스크톱) */}
          <div className="hidden items-center justify-center pt-24 md:flex lg:pt-28">
            <span className="text-40-bold text-gray-500">VS</span>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center md:justify-start lg:justify-end">
            <ProductSlot
              side="right"
              product={selected.right}
              keyword={keyword.right}
              onKeywordChange={v => handleChangeKeyword("right", v)}
              results={searchResult.right}
              onSelectProduct={p => handleSelectProduct("right", p)}
              onClear={() => handleClear("right")}
              overallWinner={compareData?.overall ?? null}
              metricResults={compareData?.results ?? null}
            />
          </div>
        </div>
      </div>

      {/* 모바일 VS */}
      <div className="mt-6 flex items-center justify-center md:hidden">
        <span className="text-40-bold text-gray-500">VS</span>
      </div>

      {/* 비교하기 버튼 + 안내 메시지 */}
      <div className="mt-10 flex flex-col items-center gap-3">
        {isComparing && <p className="text-14-regular text-gray-500">최신 데이터를 불러오는 중...</p>}
        {!isReady && !isComparing && (
          <p className="text-14-regular text-gray-500">비교할 상품 2개를 입력해 주세요 ({selectedCount}/2)</p>
        )}
        <Button
          type="button"
          variant={isReady ? "primary" : "secondary"}
          styleClass="w-full max-w-[420px] !h-[56px]"
          onClick={handleCompare}
          disabled={!isReady || isComparing}
        >
          {isReady ? "상품 비교하기" : `비교할 상품 2개를 입력해 주세요 (${selectedCount}/2)`}
        </Button>
      </div>
    </div>
  );
}

// ==========================================================
// ProductSlot: A/B 한쪽 영역
// ==========================================================
type ProductSlotProps = {
  side: CompareSide;
  product: ProductSummary | null;
  keyword: string;
  onKeywordChange: (value: string) => void;
  results: ProductSummary[];
  onSelectProduct: (product: ProductSummary) => void;
  onClear: () => void;
  overallWinner?: "left" | "right" | "draw" | null;
  metricResults?: MetricResult[] | null;
};

function ProductSlot({
  side,
  product,
  keyword,
  onKeywordChange,
  results,
  onSelectProduct,
  onClear,
  overallWinner,
  metricResults,
}: ProductSlotProps) {
  const isLeft = side === "left";
  const defaultCardImage = isLeft ? ASSET_PATHS.DEFAULT_A : ASSET_PATHS.DEFAULT_B;
  const badgeImage = isLeft ? ASSET_PATHS.BADGE_A : ASSET_PATHS.BADGE_B;

  const badgeSizeClass = "h-[180px] w-[180px] rounded-[20px]";
  const tableHeightClass = "h-[260px]";
  const tableSizeClass = `${tableHeightClass} w-[480px] rounded-[24px]`;

  // 이게조아 승리 여부
  const isWinner =
    overallWinner &&
    overallWinner !== "draw" &&
    ((overallWinner === "left" && isLeft) || (overallWinner === "right" && !isLeft));

  return (
    <div className="w full relative mx-auto flex max-w-[500px] flex-col items-center gap-8">
      {/* 1. 상단 A/B 배지 + 실제 상품 이미지 + 이게조아 뱃지 */}
      <div className="relative flex flex-col items-center">
        <div className={`${badgeSizeClass} overflow-hidden bg-gray-200`}>
          <img
            src={product?.thumbnailUrl ?? badgeImage}
            alt={product?.name ?? (isLeft ? "A 배지" : "B 배지")}
            className="h-full w-full object-cover"
          />

          {isWinner && (
            <img
              src={ASSET_PATHS.WIN_BADGE}
              alt="이게 조아! 뱃지"
              className="pointer-events-none absolute -top-4 left-1/2 h-30 w-auto -translate-x-1/2"
            />
          )}
        </div>
      </div>

      {/* 2. 검색 / 선택 pill */}
      <div className="relative flex w-full justify-center">
        {product ? (
          <div className="flex h-50 w-full max-w-300 items-center rounded-full bg-[#2F323A] px-20 text-14-medium text-white shadow-sm">
            <button type="button" className="flex flex-1 items-center justify-start">
              <span className="mr-3 truncate leading-[20px]">{product.name}</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="hover:bg-black/40 ml-2 flex h-5 w-5 items-center justify-center rounded-full text-16-bold"
              aria-label="선택한 상품 삭제"
            >
              ✕
            </button>
          </div>
        ) : (
          // 미선택 상태: 주황 점선 인풋
          <div className="flex h-[56px] w-full max-w-300 items-center gap-3 rounded-full border-[2px] border-dashed border-[#FD7E35] bg-white px-5 shadow-sm">
            <input
              value={keyword}
              onChange={e => onKeywordChange(e.target.value)}
              placeholder="상품명을 입력해주세요"
              className="flex-1 truncate bg-transparent text-16-medium text-gray-900 outline-none placeholder:text-gray-500"
            />
          </div>
        )}

        {/* 자동완성 드롭다운 (상품 없고 타이핑 중일 때만) */}
        {!product && results.length > 0 && keyword.trim() && (
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

      {/* 3. 아이콘 컬럼 + 메트릭 / 플레이스홀더 카드 */}
      <div className="mt-8 flex w-full justify-center">
        <div className="relative flex">
          {/* 왼쪽 아이콘 컬럼 (A 쪽만) */}
          {isLeft && (
            <ul
              className={`${tableHeightClass} absolute -left-20 top-1/2 hidden -translate-y-1/2 flex-col text-14-medium text-gray-500 md:flex xl:-left-24`}
            >
              {METRIC_LIST.map(m => (
                <li key={m.key} className="flex flex-1 items-center gap-2">
                  <span className="text-[18px]" aria-hidden>
                    {m.icon}
                  </span>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 메인 카드 */}
          <div className={`${tableSizeClass} overflow-hidden shadow-sm ${product ? "bg-white" : "bg-gray-150"}`}>
            {/* 상품 없을 때: DEFAULT 이미지 */}
            {!product && (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={defaultCardImage}
                  alt={isLeft ? "기본 A 카드" : "기본 B 카드"}
                  className="h-[250px] w-auto object-contain"
                />
              </div>
            )}

            {/* 상품 있을 때: 메트릭 3줄 */}
            {product && <MetricCardContent side={side} product={product} metricResults={metricResults} />}
          </div>
        </div>
      </div>
    </div>
  );
}

type MetricCardContentProps = {
  side: CompareSide;
  product: ProductSummary;
  metricResults?: MetricResult[] | null;
};

function MetricCardContent({ side, product, metricResults }: MetricCardContentProps) {
  const isLeft = side === "left";
  const mySide: "left" | "right" = isLeft ? "left" : "right";

  // MetricResult 배열을 metricKey → 결과 맵으로 변환
  const metricMap: Partial<Record<MetricKey, MetricResult>> = {};
  metricResults?.forEach(r => {
    metricMap[r.metric] = r;
  });

  const getStatus = (metric: MetricKey) => {
    const r = metricMap[metric];
    if (!r) return "none" as const;
    if (r.winner === "draw") return "draw" as const;
    return r.winner === mySide ? "win" : "lose";
  };

  const rows: {
    key: MetricKey;
    value: number;
    display: string;
    status: "win" | "lose" | "draw" | "none";
  }[] = [
    {
      key: "rating",
      value: product.rating,
      display: product.rating.toFixed(1),
      status: getStatus("rating"),
    },
    {
      key: "reviewCount",
      value: product.reviewCount,
      display: `${product.reviewCount.toLocaleString()}개`,
      status: getStatus("reviewCount"),
    },
    {
      key: "favoriteCount",
      value: product.favoriteCount,
      display: `${product.favoriteCount.toLocaleString()}개`,
      status: getStatus("favoriteCount"),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-center px-7 text-20-bold text-gray-900">
      {rows.map((row, index) => {
        const isFirst = index === 0;
        const isWin = row.status === "win";

        return (
          <ValueCell key={row.key} active={isWin} iconRight={8} className={`flex-1 ${isFirst ? "border-t-0" : ""}`}>
            <Pill active={isWin}>{row.display}</Pill>
          </ValueCell>
        );
      })}
    </div>
  );
}
