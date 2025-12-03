// 상품 아이디
export interface ProductId {
  productId: number;
}

// 리뷰 이미지 타입
export interface ReviewImage {
  id: number;
  source: string;
}

// 리뷰 작성자 정보 (간략)
export interface ReviewUser {
  id: number;
  nickname: string;
}

// 리뷰 객체
export interface Review {
  id: number;
  content: string;
  rating: number;
  likeCount: number;
  isLiked: boolean;
  productId: number;
  userId: number;
  user: ReviewUser;
  reviewImages: ReviewImage[];
  createdAt: string;
  updatedAt: string;
}

// 리뷰어 랭킹 관련 타입 정의
export interface Reviewer {
  id: number;
  nickname: string;
  image: string;
  description: string;
  teamId: string;
  reviewCount: number;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewerRankingItemProps {
  reviewer: Reviewer;
  rank: number;
}

export interface ReviewerRankingProps {
  reviewers: Reviewer[];
}

//리뷰 포스트
export interface PostReviewData extends ProductId {
  images: string[];
  content: string;
  rating: number;
}

//이미지
export interface ImageUrl {
  url: string;
}

//좋아요
export interface Like {
  id: number;
  rating: number;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  user: {
    id: number;
    nickname: string;
    image: string;
  };
  reviewImages: [
    {
      id: number;
      source: string;
    },
  ];
  isLiked: boolean;
}

// 다음 리뷰
export interface ReviewListCard {
  list: Review[];
  nextCursor: number;
}

//리뷰 생성
export interface ReviewForm {
  productId: number;
  images?: File[];
  content: string;
  rating: number;
}

//리뷰 모달
export interface ModalProps {
  productId: number;
  id: number;
  image: string;
  name: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface AlertState {
  alert: boolean;
  content: string;
}

export interface PrevImageId {
  id: number;
}
export interface PrevImageUrl {
  source: string;
}

export interface ReviewEdit {
  images: [
    {
      id: number;
    },
    {
      source: string;
    },
  ];
  content: string;
  rating: number;
}

export interface Modypage {
  item: {
    reviewImages: [
      {
        source: string;
        id: number;
      },
    ];
    content: string;
    rating: number;
  };
  productId: number;
  id: number;
  image: string;
  name: string;
  rating: number;
}

export interface ReviewDelete {
  id: number;
  rating: number;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  user: {
    id: number;
    nickname: string;
    image: string;
  };
  reviewImages: [
    {
      id: number;
      source: string;
    },
  ];
  isLiked: false;
}
