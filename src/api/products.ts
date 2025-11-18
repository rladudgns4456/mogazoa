// src/api/products.ts
import axiosInstance from "./AxiosInstance"; // AxiosInstance.ts를 사용한다고 가정
import { Product, Category, ProductListResponse, ProductSortType, ReviewerRanking } from "@/types/product";

const TEAM_ID = "yourTeamId"; // 실제 팀 ID로 대체해야 함

// GET /categories
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get(`/${TEAM_ID}/categories`);
  return data; // 응답 구조에 따라 data.list일 수 있습니다.
};

interface GetProductsParams {
  page: number;
  size: number;
  categoryId?: number | null;
  keyword?: string;
  sort?: ProductSortType;
}

// GET /products - 상품 목록, 검색, 필터링, 정렬 (핵심 API)
export const getProducts = async ({
  page,
  size,
  categoryId,
  keyword,
  sort = "latest",
}: GetProductsParams): Promise<ProductListResponse> => {
  const params = {
    page,
    size,
    categoryId: categoryId || undefined,
    keyword: keyword || undefined,
    sort,
  };

  // URLSearchParams를 사용하여 undefined 파라미터는 제외
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null) as [string, string][],
  ).toString();

  const { data } = await axiosInstance.get(`/${TEAM_ID}/products?${query}`);

  // API 응답 형태를 ProductListResponse에 맞게 변환 (가정)
  return {
    list: data.products || data.list, // 실제 응답 필드명 확인 필요
    totalCount: data.totalCount,
    page: page,
    size: size,
    isLastPage: data.isLastPage || (data.products && data.products.length < size), // isLastPage 필드가 없다면 수동 계산
  };
};

// GET /users/ranking - 리뷰어 랭킹 (limit 5개만 가져온다고 가정)
export const getReviewerRanking = async (limit: number = 5): Promise<ReviewerRanking[]> => {
  const { data } = await axiosInstance.get(`/${TEAM_ID}/users/ranking`, { params: { limit } });
  // 응답 구조에 따라 데이터를 ReviewerRanking[] 배열 형태로 변환
  return data.rankingList || data.list || data;
};
