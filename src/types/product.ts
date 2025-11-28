// 상품 관련 타입 정의
export interface Category {
  id: number;
  name: string;
}

export interface CategoryMetric {
  rating: number;
  favoriteCount: number;
  reviewCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  isFavorite?: boolean;
}

// 상품 목록 응답
export interface ProductListResponse {
  list: Product[];
  nextCursor: number | null;
}
