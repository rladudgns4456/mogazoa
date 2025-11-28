import axiosInstance from "./AxiosInstance";
import { User } from "@/types/user";
import { Product, ProductListResponse } from "@/types/product";

// 사용자 프로필 조회
export const getUserProfile = async (userId: number): Promise<User> => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

// 내 프로필 조회
export const getMyProfile = async (): Promise<User> => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

// 팔로우하기
export const followUser = async (userId: number): Promise<void> => {
  await axiosInstance.post(`/follow`, { userId });
};

// 언팔로우하기
export const unfollowUser = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/follow`, { data: { userId } });
};

// 사용자가 리뷰 남긴 상품 목록 조회
export const getUserReviewedProducts = async (userId: number, cursor?: number): Promise<ProductListResponse> => {
  const response = await axiosInstance.get(`/users/${userId}/reviewed-products`, {
    params: cursor ? { cursor } : {},
  });
  return response.data;
};

// 사용자가 등록한 상품 목록 조회
export const getUserCreatedProducts = async (userId: number, cursor?: number): Promise<ProductListResponse> => {
  const response = await axiosInstance.get(`/users/${userId}/created-products`, {
    params: cursor ? { cursor } : {},
  });
  return response.data;
};

// 사용자가 찜한 상품 목록 조회
export const getUserFavoriteProducts = async (userId: number, cursor?: number): Promise<ProductListResponse> => {
  const response = await axiosInstance.get(`/users/${userId}/favorite-products`, {
    params: cursor ? { cursor } : {},
  });
  return response.data;
};
