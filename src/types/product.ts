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
  categoryMetric?: CategoryMetric;
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

/**
 * DetailCard 컴포넌트의 props 타입
 * (컴포넌트 이름과 겹치지 않도록 Props 붙여줌)
 */
export interface DetailCardProps {
  currentPath?: string | string[]; // 필요하면 넘기고, 아니면 생략 가능하게
  userId: number | null;
  writerId: number;
  id: number;
  image: string;
  name: string;
  category?: {
    id: number;
    name: string;
  };
  description: string;
  isLoading: boolean;
  isError: boolean;
  isFavorite: boolean;
  onSave: (id: number) => void;
  onShare: () => void;
  onUrlCopy: () => void;
  onDelete: (config: string) => void;
  onCompare: (id: number) => void;
}

export interface NotSuccessful {
  userId: number | null;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Products {
  updatedAt: string;
  createdAt: string;
  writerId: number;
  categoryId: number;
  favoriteCount: number;
  reviewCount: number;
  rating: number;
  image: string;
  name: string;
  id: number;
  isFavorite: boolean;
}

//가져오기
export interface ProductDetail extends NotSuccessful, Products {
  description: string;
  category?: {
    id: number;
    name: string;
  };
  categoryMetric?: {
    rating: number;
    favoriteCount: number;
    reviewCount: number;
  };
}

//수정
export interface ProductPatchProps {
  message: string;
  details: {
    name: {
      message: string;
      value: string;
    };
  };
}

//해당 카테고리
export interface ProductCategory {
  category: {
    id: number;
    name: string;
  };
}

export interface Reviews {
  nextCursor: number;
  list: {
    user: {
      image: string;
      nickname: string;
      id: number;
    };
    reviewImages: {
      source: string;
      id: number;
    }[];
    productId: number;
    userId: number;
    updatedAt: string;
    createdAt: string;
    isLiked: boolean;
    likeCount: number;
    content: string;
    rating: number;
    id: number;
  }[];
}
