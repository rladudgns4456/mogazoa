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

export interface Like {
  user: {
    image: string;
    nickname: string;
    id: number;
  };
  reviewImages: ReviewImage[];
  productId: number;
  userId: number;
  updatedAt: string;
  createdAt: string;
  isLiked: true;
  likeCount: number;
  content: string;
  rating: number;
  id: number;
}

// 다음 리뷰
export interface ReviewListCard {
  list: Review[];
  nextCursor: number;
}

//리뷰 가져오기
export interface ReviewEdit {
  images?: string[];
  content: string;
  rating: number;
}


