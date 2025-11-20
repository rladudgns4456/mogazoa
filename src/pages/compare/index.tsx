"use client";

import React, { useEffect, useState, useCallback } from "react";
import Button from "@/components/Button/index";
import { compareProducts, ProductSummary, MetricKey, CompareResult, MetricResult } from "@/utils/compareUtils";
import ReplaceModal from "@/components/compare/ReplaceModal";

type CompareSide = "left" | "right";

const STORAGE_KEY = "mogazoa:compare-products";

// 환경 변수 설정
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? "18-2";

// 이미지 경로 정의
const ASSET_PATHS = {
  DEFAULT_A: "/assets/images/compare/compare_default_A.png",
  DEFAULT_B: "/assets/images/compare/compare_default_B.png",
  BADGE_A: "/assets/images/compare/compare_a.png",
  BADGE_B: "/assets/images/compare/compare_b.png",
  WIN_BADGE: "/assets/images/compare/win.png",
};

// 메트릭 레이블 및 아이콘 (조회수 -> 리뷰 개수로 변경)
const METRIC_LIST: { key: MetricKey; label: string; icon: string }[] = [
  { key: "rating", label: "별점", icon: "⭐" },
  { key: "viewCount", label: "리뷰 개수", icon: "📝" },
  { key: "favoriteCount", label: "찜 개수", icon: "🫶🏻" },
];

// API 응답 타입 정의
interface ProductApiResponse {
  id: number;
  name: string;
  thumbnailUrl?: string | null;
  rating: number;
  favoriteCount: number;
  viewCount: number;
}

interface SearchApiResponse {
  list?: ProductApiResponse[];
}

// 공통: 상품 1개 조회 (최신 데이터)
async function fetchProductById(id: number): Promise<ProductSummary> {
  if (!API_BASE) throw new Error("API_BASE 환경 변수가 설정되지 않았습니다.");

  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) {
    throw new Error("상품 조회 실패");
  }
  const data: ProductApiResponse = await res.json();

  return {
    id: data.id,
    name: data.name,
    thumbnailUrl: data.thumbnailUrl ?? null,
    rating: data.rating,
    favoriteCount: data.favoriteCount,
    viewCount: data.viewCount,
  };
}

// 공통: 상품 리스트 검색
async function searchProductsApi(keyword: string): Promise<ProductSummary[]> {
  if (!keyword.trim() || !API_BASE) return [];

  const res = await fetch(`${API_BASE}/products?query=${encodeURIComponent(keyword)}&size=5`);
  if (!res.ok) {
    return [];
  }
  const json: SearchApiResponse = await res.json();

  const items: ProductApiResponse[] = (json.list ?? []) as ProductApiResponse[];

  return items.map((p: ProductApiResponse) => ({
    id: p.id,
    name: p.name,
    thumbnailUrl: p.thumbnailUrl ?? null,
    rating: p.rating,
    favoriteCount: p.favoriteCount,
    viewCount: p.viewCount,
  }));
}

// ------------------------------------------------------------------
// ComparePage 컴포넌트 정의
// ------------------------------------------------------------------
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

  // ----------------- 초기 로드 -----------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        leftId: number | null;
        rightId: number | null;
      };

      (async () => {
        const [left, right]: [ProductSummary | null, ProductSummary | null] = await Promise.all([
          parsed.leftId ? fetchProductById(parsed.leftId) : Promise.resolve(null),
          parsed.rightId ? fetchProductById(parsed.rightId) : Promise.resolve(null),
        ]);

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

  // 선택 상품 id를 localStorage에 저장
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

  // 상품 선택/교체 로직
  const handleSelectProduct = (side: CompareSide, product: ProductSummary) => {
    if (selected.left && selected.right) {
      setModalState({
        isOpen: true,
        side,
        newProduct: product,
      });
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

  // 모달에서 교체 확정 시 실행되는 함수
  const handleConfirmReplace = useCallback(
    (sideToKeep: CompareSide, newProduct: ProductSummary) => {
      const sideToReplace = sideToKeep === "left" ? "right" : "left";

      setSelected(prev => {
        const next: typeof selected = { ...prev };
        next[sideToReplace] = newProduct;

        setKeyword(k => ({ ...k, [sideToReplace]: newProduct.name }));

        persistIds(next);
        return next;
      });

      setModalState({ isOpen: false, side: null, newProduct: null });
    },
    [persistIds],
  );

  // 선택 해제 (수정/제거)
  const handleClear = (side: CompareSide) => {
    setSelected(prev => {
      const next = { ...prev, [side]: null };
      persistIds(next);
      return next;
    });
    setKeyword(prev => ({ ...prev, [side]: "" }));
    setSearchResult(prev => ({ ...prev, [side]: [] }));
  };

  // 검색어 변경 + 검색
  const handleChangeKeyword = (side: CompareSide, value: string) => {
    setKeyword(prev => ({ ...prev, [side]: value }));
    searchProducts(side, value);
  };

  // 실제 검색 함수
  const searchProducts = useCallback(async (side: CompareSide, value: string) => {
    if (!value.trim()) {
      setSearchResult(prev => ({ ...prev, [side]: [] }));
      return;
    }
    const list = await searchProductsApi(value);
    setSearchResult(prev => ({ ...prev, [side]: list }));
  }, []);

  // 비교 버튼 클릭
  const handleCompare = async () => {
    if (!selected.left || !selected.right) return;

    setIsComparing(true);
    setCompareData(null);

    try {
      const [freshLeft, freshRight]: ProductSummary[] = await Promise.all([
        fetchProductById(selected.left.id),
        fetchProductById(selected.right.id),
      ]);

      setSelected({ left: freshLeft, right: freshRight });

      const result = compareProducts(freshLeft, freshRight);
      setCompareData(result);
    } catch (e) {
      console.error("비교 중 에러 발생:", e);
      alert("상품 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsComparing(false);
    }
  };

  const isReady = !!(selected.left && selected.right);

  return (
    <div className="px-4 py-10 md:px-10 lg:px-24">
      <h1 className="mb-10 text-center text-32-bold">둘 중 뭐가 더 나을까?</h1>

      {/* 상단 비교 영역 */}
      <div className="flex justify-center">
        {/* max-w-[1280px]은 피그마에서 확인된 PC 최대 너비를 참고했습니다. */}
        <div className="grid w-full max-w-[1280px] grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* A (LEFT) 슬롯 영역 */}
          <div className="flex justify-center md:justify-end lg:justify-start">
            {/* 좌측 메트릭 리스트 (PC에서만 표시) */}
            <div className="hidden w-[120px] pr-6 pt-24 lg:block">
              <ul className="space-y-4 text-right">
                {METRIC_LIST.map(m => (
                  <li key={m.key} className="text-16-medium text-gray-700">
                    {m.icon} {m.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* A 상품 슬롯 */}
            <ProductSlot
              side="left"
              product={selected.left}
              keyword={keyword.left}
              onKeywordChange={(v: string) => handleChangeKeyword("left", v)}
              results={searchResult.left}
              onSelectProduct={(p: ProductSummary) => handleSelectProduct("left", p)}
              onClear={() => handleClear("left")}
            />
          </div>

          {/* 중앙 VS 텍스트 (MD 이상에서만 표시) */}
          {/* 상품 카드의 중앙 높이에 맞추기 위해 pt 클래스 조정 */}
          <div className="hidden items-center justify-center pt-32 md:flex lg:pt-36">
            <span className="text-40-bold text-gray-500">VS</span>
          </div>

          {/* B (RIGHT) 슬롯 영역 */}
          <div className="flex justify-center md:justify-start lg:justify-end">
            <ProductSlot
              side="right"
              product={selected.right}
              keyword={keyword.right}
              onKeywordChange={(v: string) => handleChangeKeyword("right", v)}
              results={searchResult.right}
              onSelectProduct={(p: ProductSummary) => handleSelectProduct("right", p)}
              onClear={() => handleClear("right")}
            />
          </div>
        </div>
      </div>

      {/* 모바일에서만 보이는 VS 텍스트 (A와 B 사이에 배치) */}
      <div className="mt-6 flex items-center justify-center md:hidden">
        <span className="text-40-bold text-gray-500">VS</span>
      </div>

      {/* 비교 버튼 / 안내 메시지 */}
      <div className="mt-10 flex flex-col items-center gap-3">
        {isComparing && <p className="text-14-regular text-gray-500">최신 데이터를 불러오는 중...</p>}
        {!isReady && !isComparing && (
          <p className="text-14-regular text-gray-500">비교할 상품을 두 개 모두 선택해주세요.</p>
        )}

        <Button
          type="button"
          variant="primary"
          // w-full max-w-md 는 그대로 유지하되, 높이를 h-56으로 명시
          styleClass="w-full max-w-md !h-[56px]"
          onClick={handleCompare}
          disabled={!isReady || isComparing}
        >
          {isComparing ? "비교 중..." : "비교하기"}
        </Button>
      </div>

      {/* 비교 결과 */}
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

// ------------------------------------------------------------------
// ProductSlot 컴포넌트 정의 (이미지 크기 수정 및 정렬 유지)
// ------------------------------------------------------------------

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
  const defaultImage = isLeft ? ASSET_PATHS.DEFAULT_A : ASSET_PATHS.DEFAULT_B;
  const badgeImage = isLeft ? ASSET_PATHS.BADGE_A : ASSET_PATHS.BADGE_B;
  const thumbnailSizeClass = "h-64 w-64";

  return (
    <div className={`relative mx-auto flex w-full max-w-[400px] flex-col items-center gap-4`}>
      {/* 1. 상단 배지 이미지 & 이름 */}
      <div className="flex flex-col items-center">
        <img src={badgeImage} alt={`${isLeft ? "A" : "B"} 배지`} className="h-12 w-12" />
        <p className="mt-1 text-20-bold text-gray-900">{isLeft ? "A" : "B"}</p>
      </div>

      {/* 2. 입력 박스 (점선 적용) */}
      <div className="relative w-full">
        <div
          className={`flex items-center gap-2 rounded-full border-2 border-dashed bg-white px-4 py-3 text-16-regular shadow-sm ${product ? "border-primary-500" : "border-gray-400"}`}
        >
          <input
            value={keyword}
            onChange={e => onKeywordChange(e.target.value)}
            placeholder={product ? product.name : "상품명을 입력해주세요"}
            className={`flex-1 truncate bg-transparent text-16-medium outline-none ${product ? "text-gray-900" : "text-gray-500"}`}
            readOnly={!!product}
          />
          {product && (
            <button type="button" onClick={onClear} className="text-14-medium text-primary-500 hover:text-red-500">
              삭제
            </button>
          )}
        </div>

        {/* 자동완성 리스트 */}
        {results.length > 0 && keyword.trim() && !product && (
          <ul
            className={`absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg`}
          >
            {results.map((item: ProductSummary) => (
              <li
                key={item.id}
                className="cursor-pointer px-4 py-2 text-14-regular first:rounded-t-xl last:rounded-b-xl hover:bg-gray-50"
                onClick={() => onSelectProduct(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. 디폴트 썸네일 카드 - 크기 수정 및 p-1 제거 */}
      <div
        // p-1 제거로 인해 border 안쪽 전체 공간을 이미지에 할당
        className={`mt-4 ${thumbnailSizeClass} rounded-2xl border-2 shadow-lg ${isLeft ? "border-primary-400" : "border-error"} ${product ? "bg-white" : "bg-gray-100"} overflow-hidden`}
      >
        {product ? (
          <img
            src={product.thumbnailUrl ?? defaultImage}
            alt={product.name}
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <img
            src={defaultImage}
            alt={`${isLeft ? "A" : "B"} 디폴트`}
            className="h-full w-full rounded-2xl object-cover"
          />
        )}
      </div>
    </div>
  );
}

// -------------------- 비교 결과 섹션 --------------------

type CompareResultSectionProps = {
  left: ProductSummary;
  right: ProductSummary;
  data: CompareResult;
};

function metricLabel(metric: MetricKey): string {
  if (metric === "rating") return "별점";
  if (metric === "favoriteCount") return "찜 개수";
  return "리뷰 개수"; // 조회수 대신 리뷰 개수 텍스트 사용
}

function CompareResultSection({ left, right, data }: CompareResultSectionProps) {
  const { results, overall } = data;

  const overallText =
    overall === "draw"
      ? "우열을 가릴 수 없는 흥미진진한 대결이었어요!"
      : `${overall === "left" ? `'${left.name}'` : `'${right.name}'`} 이(가) 승리하여 더 나은 선택이에요!`;

  const leftWin = overall === "left";
  const rightWin = overall === "right";

  return (
    <section className="mt-12">
      <p className="mb-6 text-center text-18-bold text-primary-600">{overallText}</p>

      {/* 조아 뱃지 표시 */}
      <div className="mx-auto mb-8 flex max-w-3xl justify-center">
        {overall !== "draw" && <img src={ASSET_PATHS.WIN_BADGE} alt="조아 뱃지" className="h-auto w-24" />}
      </div>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
        <table className="w-full text-center text-14-regular">
          <thead className="bg-gray-50">
            <tr>
              <th className={`py-3 text-16-bold ${leftWin ? "text-primary-500" : "text-gray-900"}`}>{left.name}</th>
              <th className="py-3 text-16-bold">항목</th>
              <th className={`py-3 text-16-bold ${rightWin ? "text-primary-500" : "text-gray-900"}`}>{right.name}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: MetricResult) => {
              const leftStrong = r.winner === "left";
              const rightStrong = r.winner === "right";

              // diffText는 차이 값을 보여주기 위해 사용
              const diffText =
                r.winner === "draw"
                  ? "0"
                  : r.winner === "left"
                    ? `+${r.diff.toLocaleString()}`
                    : `+${r.diff.toLocaleString()}`; // 절대값이므로 양수로 표시

              return (
                <tr key={r.metric} className="border-t border-gray-100">
                  <td className="py-3">
                    <span className={leftStrong ? "text-18-medium font-bold text-primary-500" : "text-16-regular"}>
                      {r.leftValue.toLocaleString()} {r.metric === "rating" ? "점" : "개"}
                    </span>
                    {/* 개별 지표의 승자 텍스트를 값 아래에 표시 */}
                    {leftStrong && (
                      <span className="mt-1 block text-12-regular text-primary-400">WIN! ({diffText})</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-14-medium">{metricLabel(r.metric)}</span>
                      {r.winner === "draw" && <span className="text-12-regular text-gray-400">동점</span>}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={rightStrong ? "text-18-medium font-bold text-primary-500" : "text-16-regular"}>
                      {r.rightValue.toLocaleString()} {r.metric === "rating" ? "점" : "개"}
                    </span>
                    {/* 개별 지표의 승자 텍스트를 값 아래에 표시 */}
                    {rightStrong && (
                      <span className="mt-1 block text-12-regular text-primary-400">WIN! ({diffText})</span>
                    )}
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
