// src/pages/Home/index.tsx (수정된 버전)
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts, getReviewerRanking, ProductSortType } from "@/api/products";
import { useHomeProducts } from "@/hooks/useHomeProducts";
import CategoryList from "@/components/category/CategoryList"; // 👈 수정됨
import ProductSearchInput from "@/components/input/ProductSearchInput"; // 👈 수정됨
import SortingSelect from "@/components/selectBox/SortingSelect"; // 👈 수정됨
import ReviewRanking from "@/components/review/ReviewRanking"; // 👈 수정됨
import ProductCard from "@/components/product/ProductCard"; // 가정 (폴더 구조에 맞게 조정 필요)
import { Product } from "@/types/product";
import { useInView } from "@uidotdev/usehooks";
import { useRouter } from "next/router";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "rating", label: "별점순" },
  { value: "reviewCount", label: "리뷰수순" },
];

const HomePage = () => {
  const router = useRouter();

  // 1. 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortType, setSortType] = useState<ProductSortType>("latest");

  const hasFilterOrSearch = selectedCategory !== null || searchKeyword !== "";

  // 2. API 데이터 가져오기 (카테고리 및 랭킹)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ["reviewerRanking"],
    queryFn: () => getReviewerRanking(5),
  });

  // 3. 메인 상품 목록 및 무한 스크롤 훅
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useHomeProducts({
    categoryId: selectedCategory,
    keyword: searchKeyword,
    sort: sortType,
  });

  // 필터/검색이 적용된 경우의 상품 목록 (flat array)
  const filteredProducts = useMemo(() => infiniteData?.pages.flatMap(page => page.list) || [], [infiniteData]);

  // 4. 초기 홈 화면 상품 로딩 (필터/검색이 없을 때만 실행)
  const { data: homeBestsellers, isPending: isHomePending } = useQuery({
    queryKey: ["homeBestsellers"],
    queryFn: async () => {
      // Top 6 및 별점 높은 상품을 가져오는 로직 (이전 답변 참고)
      const hot = await getProducts({ page: 1, size: 6, sort: "reviewCount" });
      const rated = await getProducts({ page: 1, size: 6, sort: "rating" });
      return { hotProducts: hot.list, highRatedProducts: rated.list };
    },
    enabled: !hasFilterOrSearch,
    staleTime: 5 * 60 * 1000,
  });

  // 5. 무한 스크롤 트리거
  const [inViewRef, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && hasFilterOrSearch) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, hasFilterOrSearch, fetchNextPage]);

  // 6. 이벤트 핸들러
  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategory(prevId => (prevId === categoryId ? null : categoryId));
    setSearchKeyword("");
  }, []);

  const handleSearchSubmit = useCallback((keyword: string) => {
    setSearchKeyword(keyword.trim());
    setSelectedCategory(null);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortType(value as ProductSortType);
  }, []);

  const handleProductClick = useCallback(
    (productId: number) => {
      router.push(`/product/${productId}`);
    },
    [router],
  );

  const renderContent = () => {
    if (hasFilterOrSearch) {
      // 카테고리 선택 O 또는 검색 결과 O
      if (isPending) return <p className="text-16-regular text-gray-600">상품 목록을 불러오는 중입니다...</p>;

      const categoryName = categories.find(c => c.id === selectedCategory)?.name;

      return (
        <div className="flex flex-col gap-8">
          {/* 현재 적용된 필터/검색 표시 */}
          <h2 className="mt-8 text-24-bold text-black">
            {categoryName ? `${categoryName} 카테고리의 ` : ""}
            {searchKeyword ? `'${searchKeyword}'을 검색한 ` : "모든 "} 상품
          </h2>

          {/* 정렬 셀렉트 박스 */}
          <div className="flex justify-end">
            <SortingSelect // 👈 수정됨
              options={SORT_OPTIONS}
              value={sortType}
              onChange={handleSortChange}
              placeholder="정렬 기준"
            />
          </div>

          {/* 상품 목록 Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product.id)} />
            ))}
          </div>

          {/* 무한 스크롤 로딩 인디케이터 */}
          <div ref={inViewRef} className="h-10 text-center">
            {(isFetchingNextPage || isPending) && (
              <p className="text-14-regular text-gray-500">다음 상품을 불러오는 중...</p>
            )}
            {!hasNextPage && filteredProducts.length > 0 && (
              <p className="text-14-regular text-gray-500">모든 상품을 불러왔습니다.</p>
            )}
            {!isPending && filteredProducts.length === 0 && (
              <p className="text-16-regular text-gray-600">조건에 맞는 상품이 없습니다.</p>
            )}
          </div>
        </div>
      );
    }

    // 카테고리 선택 X & 검색 결과 X (초기 화면)
    if (isHomePending) return <p className="text-16-regular text-gray-600">인기 상품을 불러오는 중입니다...</p>;

    return (
      <div className="flex flex-col gap-12">
        {/* 지금 핫한 상품 Top 6 */}
        <section>
          <h2 className="mb-6 text-24-bold text-black">지금 핫한 상품 Best</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {homeBestsellers?.hotProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                rank={index + 1}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </section>

        {/* --- */}

        {/* 별점이 높은 상품 */}
        <section>
          <h2 className="mb-6 text-24-bold text-black">별점이 높은 상품</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {homeBestsellers?.highRatedProducts.map(product => (
              <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product.id)} />
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="mx-auto flex max-w-screen-xl p-4">
      <main className="min-w-0 flex-1">
        {/* 상단 배너 및 검색창 (공통 컴포넌트 가정) */}

        {/* 카테고리 탭 */}
        <CategoryList // 👈 수정됨
          categories={categories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />

        <ProductSearchInput // 👈 수정됨
          onSubmit={handleSearchSubmit}
          initialValue={searchKeyword}
        />

        {/* 메인 콘텐츠 영역 */}
        <div className="mt-8">{renderContent()}</div>
      </main>

      {/* 우측 사이드바: 리뷰어 랭킹 */}
      <aside className="ml-8 hidden w-72 flex-shrink-0 lg:block">
        <ReviewRanking // 👈 수정됨
          ranking={ranking}
        />
      </aside>
    </div>
  );
};

export default HomePage;
