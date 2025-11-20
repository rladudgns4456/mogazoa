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
