"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Banner from "@/components/banner";
import cn from "clsx";
import { CategoryList, CategoryItem } from "@/components/Category";
import ReviewerRanking from "@/components/review/ReviewerRanking";
import ItemCard from "@/components/ItemCard";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/product";

type ProductListItemFromApi = {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  categoryId: number;
  writerId: number;
  createdAt: string;
  updatedAt: string;
};

type ProductListResponse = {
  nextCursor: number | null;
  list: ProductListItemFromApi[];
};

// 리스트 응답 -> Product 타입으로 보정
const toProduct = (raw: ProductListItemFromApi): Product => ({
  id: raw.id,
  name: raw.name,
  description: "",
  image: raw.image,
  rating: raw.rating,
  reviewCount: raw.reviewCount,
  favoriteCount: raw.favoriteCount,
  categoryId: raw.categoryId,
  userId: raw.writerId,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
  isFavorite: false,
  category: {
    id: raw.categoryId,
    name: "",
  },
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const CATEGORY_ICON_MAP: Record<string, string> = {
  음악: "ic_music",
  "영화/드라마": "ic_movie",
  "가구/인테리어": "ic_furniture",
  "강의/책": "ic_book",
  호텔: "ic_hotel",
  식당: "ic_noodle",
  전자기기: "ic_computer",
  화장품: "ic_brush",
  // 나머지 카테고리 이름들 있으면 여기 계속 추가
  앱: "ic_box",
  "의류/잡화": "ic_box", // 아이콘 따로 있으면 나중에 바꿔주면 됨
};

type OrderType = "recent" | "rating" | "reviewCount";

export default function MainPage() {
  const router = useRouter();
  const [ratingPage, setRatingPage] = useState(0);

  // =========================
  // 1) 카테고리
  // =========================
  const { combinedCategory, isLoading, isError } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const categoryItems: CategoryItem[] = useMemo(() => {
    if (!combinedCategory) return [];

    return combinedCategory.map((cat: any) => {
      const label = cat.label ?? cat.name; // API 쪽에서 name으로 올 수도 있으니
      const iconKey = CATEGORY_ICON_MAP[label] ?? "ic_box"; // 매핑 없으면 기본 아이콘

      return {
        id: String(cat.id),
        label,
        icon: iconKey,
      };
    }) as CategoryItem[];
  }, [combinedCategory]);

  const handleSelectCategory = useCallback((id: string) => {
    setSelectedCategoryId(prev => {
      const numericId = Number(id);
      return prev === numericId ? null : numericId; // 다시 누르면 해제
    });

    // 카테고리 바뀔 때 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectedCategoryName = useMemo(() => {
    if (!combinedCategory || selectedCategoryId == null) return "";

    const found = combinedCategory.find((c: any) => Number(c.id) === Number(selectedCategoryId));

    return typeof found?.label === "string" ? found.label : "";
  }, [combinedCategory, selectedCategoryId]);

  // =========================
  // 2) 검색어 (URL 쿼리 기반)
  // =========================
  const keyword = typeof router.query.keyword === "string" ? router.query.keyword.trim() : "";

  // =========================
  // 3) 정렬 (최신 / 별점 / 리뷰수)
  // =========================
  const [order, setOrder] = useState<OrderType>("recent");

  const handleChangeOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as OrderType;
    setOrder(value);
  };

  // 카테고리나 검색어가 하나라도 있으면 "필터가 적용된 상태"
  const hasFilter = selectedCategoryId !== null || keyword.length > 0;

  // =========================
  // 4) 리뷰어 랭킹 (우측 사이드)
  // =========================
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(false);
  const [reviewerError, setReviewerError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE) return;

    const fetchReviewers = async () => {
      try {
        setIsLoadingReviewers(true);
        setReviewerError(null);

        const res = await fetch(`${API_BASE}/users/ranking`);
        if (!res.ok) {
          throw new Error("리뷰어 랭킹 조회 실패");
        }

        const data = await res.json();
        setReviewers(data);
      } catch (error) {
        console.error(error);
        setReviewerError("리뷰어 랭킹을 불러오는 중 오류가 발생했어요.");
      } finally {
        setIsLoadingReviewers(false);
      }
    };

    fetchReviewers();
  }, []);

  // =========================
  // 5) Top 6 상품 (필터 없을 때만)
  // =========================
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [isLoadingTopProducts, setIsLoadingTopProducts] = useState(false);
  const [topProductsError, setTopProductsError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE) return;

    const fetchTopProducts = async () => {
      try {
        setIsLoadingTopProducts(true);
        setTopProductsError(null);

        // 1) 리뷰수 순 Top 6
        const hotRes = await fetch(`${API_BASE}/products?order=reviewCount`);
        if (!hotRes.ok) throw new Error("지금 핫한 상품 조회 실패");
        const hotData: ProductListResponse = await hotRes.json();

        const hot = (hotData.list ?? []).slice(0, 6).map(toProduct); // <- Product 타입으로 변환
        setHotProducts(hot);

        // 2) 별점 순 Top 6
        const ratingRes = await fetch(`${API_BASE}/products?order=rating`);
        if (!ratingRes.ok) throw new Error("별점이 높은 상품 조회 실패");
        const ratingData: ProductListResponse = await ratingRes.json();

        const topRated = (ratingData.list ?? []).slice(0, 6).map(toProduct);
        setTopRatedProducts(topRated);
      } catch (error) {
        console.error(error);
        setTopProductsError("Top 상품 정보를 불러오는 중 오류가 발생했어요.");
      } finally {
        setIsLoadingTopProducts(false);
      }
    };

    // 필터가 없을 때만 Top 6 요청
    if (!hasFilter) {
      void fetchTopProducts();
    } else {
      // 필터가 생기면 Top 섹션 비워두기
      setHotProducts([]);
      setTopRatedProducts([]);
    }
  }, [API_BASE, hasFilter]);

  // =========================
  // 6) 필터된 상품 목록 + 무한 스크롤
  // =========================
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // 필터(카테고리/검색어/정렬)가 바뀌면 리스트 초기화 후 첫 페이지 다시 로딩
  useEffect(() => {
    if (!API_BASE || !hasFilter) {
      setProducts([]);
      setCursor(null);
      setHasMore(true);
      setIsLoadingList(false);
      setListError(null);
      return;
    }

    let cancelled = false;

    const fetchFirstPage = async () => {
      try {
        setIsLoadingList(true);
        setListError(null);

        const params = new URLSearchParams();
        params.set("order", order);
        if (selectedCategoryId != null) params.set("category", String(selectedCategoryId));
        if (keyword) params.set("keyword", keyword);

        const res = await fetch(`${API_BASE}/products?${params.toString()}`);
        if (!res.ok) throw new Error("상품 목록 조회 실패");

        const data: ProductListResponse = await res.json();
        if (cancelled) return;

        setProducts((data.list ?? []).map(toProduct));
        const next = data.nextCursor ?? null;
        setCursor(next);
        setHasMore(Boolean(next));
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setListError("상품 목록을 불러오는 중 오류가 발생했어요.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingList(false);
        }
      }
    };

    fetchFirstPage();

    return () => {
      cancelled = true;
    };
  }, [API_BASE, hasFilter, order, selectedCategoryId, keyword]);

  // 추가 페이지 로딩
  const loadMore = useCallback(async () => {
    if (!API_BASE || !hasFilter || !hasMore || isLoadingList || cursor == null) return;

    try {
      setIsLoadingList(true);

      const params = new URLSearchParams();
      params.set("order", order);
      if (selectedCategoryId != null) params.set("category", String(selectedCategoryId));
      if (keyword) params.set("keyword", keyword);
      params.set("cursor", String(cursor));

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error("상품 목록 조회 실패");

      const data: ProductListResponse = await res.json();

      setProducts(prev => [...prev, ...(data.list ?? []).map(toProduct)]);

      const next = data.nextCursor ?? null;
      setCursor(next);
      setHasMore(Boolean(next));
    } catch (error) {
      console.error(error);
      setListError("상품 목록을 더 불러오는 중 오류가 발생했어요.");
    } finally {
      setIsLoadingList(false);
    }
  }, [API_BASE, hasFilter, hasMore, isLoadingList, cursor, order, selectedCategoryId, keyword]);

  // 무한 스크롤용 sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasFilter) return;
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasFilter, loadMore, products.length]);

  // 필터 상태에 따른 제목 텍스트
  const filterTitle = useMemo(() => {
    if (!hasFilter) return "";

    if (selectedCategoryId == null && keyword) {
      return `‘${keyword}’를 검색한 상품`;
    }

    if (selectedCategoryId != null && !keyword) {
      return `${selectedCategoryName}의 모든 상품`;
    }

    if (selectedCategoryId != null && keyword) {
      return `${selectedCategoryName}에서 ‘${keyword}’를 검색한 상품`;
    }

    return "";
  }, [hasFilter, keyword, selectedCategoryId, selectedCategoryName]);

  const RATING_PER_PAGE = 3;
  const totalRatingPages = topRatedProducts.length === 0 ? 1 : Math.ceil(topRatedProducts.length / RATING_PER_PAGE);

  const currentRatingSlice = topRatedProducts.slice(
    ratingPage * RATING_PER_PAGE,
    ratingPage * RATING_PER_PAGE + RATING_PER_PAGE,
  );

  const canPrevRating = ratingPage > 0;
  const canNextRating = ratingPage < totalRatingPages - 1;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 바로 아래 전체 폭 배너 */}
      <Banner />

      <div className="mx-auto w-full max-w-6xl px-16 py-24">
        {/* 1. 카테고리 섹션 */}
        <section className="mb-24 flex justify-center">
          <div className="flex w-full max-w-[972px] flex-col gap-3">
            <h2 className="text-14-bold text-gray-900">카테고리</h2>

            <div className="rounded-20 bg-gray-100 px-16 py-12">
              {isLoading && <p className="text-12-regular text-gray-500">카테고리를 불러오는 중입니다…</p>}

              {isError && <p className="text-12-regular text-error">카테고리를 불러오지 못했어요.</p>}

              {!isLoading && !isError && categoryItems.length > 0 && (
                <CategoryList
                  items={categoryItems}
                  layout="grid"
                  columns={10}
                  withDividers={false}
                  size="lg"
                  iconPlacement="left"
                  selectable
                  selectedId={selectedCategoryId !== null ? String(selectedCategoryId) : null}
                  onSelect={handleSelectCategory}
                  variant="pill"
                />
              )}
            </div>
          </div>
        </section>

        {/* 2. 리뷰어 랭킹 섹션 (카테고리 바로 아래, 가운데 943px) */}
        <section className="mb-32 flex justify-center">
          <div className="w-full max-w-[943px]">
            {isLoadingReviewers && (
              <p className="mb-16 text-12-regular text-gray-500">리뷰어 랭킹을 불러오는 중입니다…</p>
            )}

            {reviewerError && <p className="mb-16 text-12-regular text-error">{reviewerError}</p>}

            {!isLoadingReviewers && !reviewerError && <ReviewerRanking reviewers={reviewers} />}
          </div>
        </section>

        {/* 3. 상품 섹션 (이제 단일 컬럼) */}
        <main className="min-w-0">
          {hasFilter ? (
            /* 필터 적용된 경우 */
            <section className="mb-32">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-16-bold text-gray-900">{filterTitle}</h2>
                <div className="flex items-center gap-8">
                  <span className="text-12-medium text-gray-600">정렬</span>
                  <select
                    value={order}
                    onChange={handleChangeOrder}
                    className="rounded-12 border border-gray-200 px-12 py-8 text-12-regular text-gray-800"
                  >
                    <option value="recent">최신순</option>
                    <option value="rating">별점순</option>
                    <option value="reviewCount">리뷰수순</option>
                  </select>
                </div>
              </div>

              {listError && <p className="py-24 text-12-regular text-error">{listError}</p>}

              <div className="grid gap-24 md:grid-cols-3">
                {products.map(product => (
                  <ItemCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-16 flex flex-col items-center justify-center gap-8">
                {isLoadingList && <p className="text-12-regular text-gray-500">상품을 불러오는 중입니다…</p>}
                {!hasMore && products.length > 0 && (
                  <p className="text-12-regular text-gray-500">더 이상 불러올 상품이 없어요.</p>
                )}
                <div ref={sentinelRef} className="h-4 w-full" />
              </div>
            </section>
          ) : (
            <>
              {/* 지금 핫한 상품 Best */}
              <section className="mb-40 flex justify-center">
                {/* 피그마 전체 프레임: width 940px, vertical, gap 20px */}
                <div className="flex w-full max-w-[940px] flex-col gap-5">
                  {/* 타이틀 */}
                  <div className="flex items-baseline justify-between">
                    <h2 className="flex items-baseline gap-2">
                      <span className="text-16-bold text-gray-900">지금 핫한 상품</span>
                      <span className="text-16-bold text-primary-500">Best</span>
                    </h2>
                  </div>

                  {/* 로딩 / 에러 */}
                  {isLoadingTopProducts && (
                    <p className="py-24 text-12-regular text-gray-500">상품을 불러오는 중입니다…</p>
                  )}

                  {topProductsError && <p className="py-24 text-12-regular text-error">{topProductsError}</p>}

                  {/* 카드 그리드: 3열, gap 20px */}
                  {!isLoadingTopProducts && !topProductsError && hotProducts.length > 0 && (
                    <div className="grid justify-between gap-5 md:grid-cols-3">
                      {hotProducts.map((product, index) => (
                        <ItemCard key={product.id} product={product} showRank rank={index + 1} />
                      ))}
                    </div>
                  )}

                  {!isLoadingTopProducts && !topProductsError && hotProducts.length === 0 && (
                    <p className="py-24 text-12-regular text-gray-500">아직 핫한 상품이 없어요.</p>
                  )}
                </div>
              </section>

              {/* 별점이 높은 상품 */}
              <section className="mb-40 flex justify-center">
                {/* 전체 프레임: width 940px, vertical, gap 20px */}
                <div className="flex w-full max-w-[940px] flex-col gap-5">
                  {/* 타이틀 */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-16-bold text-gray-900">별점이 높은 상품</h2>
                    {/* 필요하면 페이지 인디케이터 등 추가 가능 */}
                  </div>

                  {/* 내용 영역 */}
                  {!isLoadingTopProducts && !topProductsError && topRatedProducts.length > 0 && (
                    <div className="flex items-center justify-between gap-5">
                      {/* LEFT 버튼 */}
                      <button
                        type="button"
                        onClick={() => canPrevRating && setRatingPage(p => p - 1)}
                        disabled={!canPrevRating}
                        className={cn(
                          "flex h-40 w-40 items-center justify-center rounded-full border bg-white text-gray-500",
                          "border-gray-300",
                          "disabled:cursor-default disabled:opacity-40",
                        )}
                      >
                        <span className="text-[20px] font-extrabold leading-none tracking-[-2px]">&lt;</span>
                      </button>

                      {/* 카드 영역 */}
                      <div className="grid flex-1 grid-cols-3 justify-between gap-5">
                        {currentRatingSlice.map(product => (
                          <ItemCard key={product.id} product={product} />
                        ))}
                      </div>

                      {/* RIGHT 버튼 */}
                      <button
                        type="button"
                        onClick={() => canNextRating && setRatingPage(p => p + 1)}
                        disabled={!canNextRating}
                        className={cn(
                          "flex h-40 w-40 items-center justify-center rounded-full border bg-white text-gray-500",
                          "border-gray-300",
                          "disabled:cursor-default disabled:opacity-40",
                        )}
                      >
                        <span className="text-[20px] font-extrabold leading-none tracking-[-2px]">&gt;</span>
                      </button>
                    </div>
                  )}

                  {/* 로딩 / 에러 / 빈 상태 */}
                  {isLoadingTopProducts && (
                    <p className="py-24 text-12-regular text-gray-500">상품을 불러오는 중입니다…</p>
                  )}

                  {topProductsError && <p className="py-24 text-12-regular text-error">{topProductsError}</p>}

                  {!isLoadingTopProducts && !topProductsError && topRatedProducts.length === 0 && (
                    <p className="py-24 text-12-regular text-gray-500">아직 별점이 높은 상품이 없어요.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
