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
 */
export interface DetailCardProps {
  // 상세 페이지 경로(리뷰 모달에서 사용)
  currentPath?: string;

  // 필수 식별자들
  productId: number;
  userId: number | null;
  writerId: number | null;
  id: number;

  // 상품 정보
  image: string;
  name: string;
  category?: { id?: number; name: string } | string;
  categoryId?: number;
  description: string;

  // 상태
  isLoading: boolean;
  isError: boolean;
  isFavorite: boolean;

  // 액션 콜백들
  onShare?: () => void;
  onUrlCopy?: () => void;
  onSave?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onCompare?: (id: number) => void;
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

// 가져오기
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

// 수정
export interface ProductPatchProps {
  message: string;
  details: {
    name: {
      message: string;
      value: string;
    };
  };
}

// 해당 카테고리
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
