// src/hooks/useHomeProducts.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts, ProductSortType, ProductListResponse } from "@/api/products";

interface UseHomeProductsProps {
  categoryId: number | null;
  keyword: string;
  sort: ProductSortType;
}

const PAGE_SIZE = 12; // 한 번에 로드할 상품 수 (Figma 시안 기준 4열 * 3줄)

export const useHomeProducts = ({ categoryId, keyword, sort }: UseHomeProductsProps) => {
  // 필터나 검색어가 적용된 상태인지 확인
  const hasFilterOrSearch = categoryId !== null || keyword !== "";

  const queryKey = ["products", { categoryId, keyword, sort, hasFilterOrSearch }];

  return useInfiniteQuery<ProductListResponse>({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getProducts({
        page: pageParam,
        size: PAGE_SIZE,
        categoryId,
        keyword,
        sort,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 다음 페이지가 있다면 현재 페이지 + 1
      return lastPage.isLastPage ? undefined : allPages.length + 1;
    },
    // 필터/검색어가 적용된 경우에만 무한 스크롤/쿼리 실행
    enabled: hasFilterOrSearch,
    // 필터나 정렬 기준이 변경되면 새로운 데이터로 교체 (refetchOnMount, refetchOnWindowFocus 등 기본값 활용)
  });
};
