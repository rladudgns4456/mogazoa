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
  writerId: number;
  isFavorite: boolean;
  category: Category;
  categoryMetric?: CategoryMetric;
  createdAt: string;
  updatedAt: string;
}
