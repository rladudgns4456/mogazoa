// src/types/product.ts

// 상품 카드에 표시될 기본 정보
export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  avgRating: number; // 평균 별점
  reviewCount: number; // 후기 개수
  favoriteCount: number; // 찜 개수
  price: number; // 가격 정보 (시안에는 없으나 필요할 수 있음)
  categoryName: string;
}

// 상품 목록 API 응답 구조
export interface ProductListResponse {
  list: Product[];
  totalCount: number;
  // 무한 스크롤을 위해 다음 페이지 존재 여부 또는 페이지네이션 정보가 필요함
  // Swagger에 명시되지 않았으므로 'page'와 'size'를 클라이언트에서 추적합니다.
  page: number;
  size: number;
  isLastPage: boolean;
}

// 카테고리 정보
export interface Category {
  id: number;
  name: string;
  // 카테고리 아이콘 URL 또는 이름 (iconMap.ts와 연결)
  iconName: string;
}

// 리뷰어 랭킹 정보
export interface ReviewerRanking {
  userId: number;
  nickname: string;
  followerCount: number;
  reviewCount: number;
}

// 상품 목록 정렬 기준
export type ProductSortType = "latest" | "rating" | "reviewCount";
