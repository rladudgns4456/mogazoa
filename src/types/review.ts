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
