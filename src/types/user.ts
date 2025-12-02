// 사용자 타입 정의

export interface User {
  id: number;
  email: string;
  nickname: string;
  description: string;
  image: string;
  teamId: string;
  mostFavoriteCategory?: {
    id: number;
    name: string;
  };
  averageRating: number;
  reviewCount: number;
  followeesCount: number;
  followersCount: number;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 팔로워/팔로잉 사용자 타입

export interface Follower {
  id: number;
  nickname: string;
  image: string | null;
}
