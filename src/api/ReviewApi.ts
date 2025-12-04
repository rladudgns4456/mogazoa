//=== 리뷰 관련 API

import axiosInstance from "./AxiosInstance";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ReviewListCard, ReviewForm, ReviewEdit, Like, ReviewDelete } from "../types/review";
import axios from "axios";

//=== 리뷰 리스트
export async function getReviews(productId: number): Promise<ReviewListCard> {
  const response = await axiosInstance.get(`/products/${productId}/reviews`);
  return response.data;
}

export function useGetReviewList(productId: number, order: string) {
  return useQuery({
    queryKey: ["reviews", productId, order],
    queryFn: () => getReviewsOrder(productId, order),
    staleTime: 1000 * 10 * 5,
  });
}

//=== 리뷰 페이지
export async function getReviewScroll(productId: number, page: number): Promise<ReviewListCard> {
  const response = await axiosInstance.get(`/products/${productId}/reviews?cursor=${page}`);
  return response.data;
}

// fetchPosts 함수
export async function fetchPosts(
  productId: number,
  pageParam: number = 0,
): Promise<{ reviews: ReviewListCard[]; nextCursor?: number }> {
  const response = await axiosInstance.get(`/products/${productId}/reviews?cursor=${pageParam}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return response.data;
}

// usePosts 훅 수정
export function usePosts(productId: number) {
  return useInfiniteQuery<{ reviews: ReviewListCard[]; nextCursor?: number }, Error, [string, number]>({
    queryKey: ["reviews", productId],
    queryFn: ({ pageParam = 0 }) => fetchPosts(productId, (pageParam = 0)),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
  });
}
//=== 리뷰 리스트 & 정렬
export async function getReviewsOrder(productId: number, order: string): Promise<ReviewListCard> {
  const response = await axiosInstance.get(`/products/${productId}/reviews?order=${order}`);
  return response.data;
}

export function useGetReview(productId: number, order: string) {
  return useQuery({
    queryKey: ["reviews", productId, order],
    queryFn: () => getReviews(productId, order),
    // staleTime: 1000 * 10 * 5,
  });
}

//=== 리뷰 생성
export const createReview = async (newReview: ReviewForm): Promise<ReviewForm> => {
  const response = await axiosInstance.post(`/reviews`, newReview);
  return response.data;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const uploadPostMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      console.log("리뷰 생성 성공!");
    },

    onError: error => {
      console.error("리뷰 생성 중 오류 발생:", error);
    },
  });
  return {
    mutate: uploadPostMutation.mutate,
    isPending: uploadPostMutation.isPending,
  };
};

// 리뷰 수정 API 함수
export const updateReview = async (reviewId: number, updatedReview: ReviewEdit): Promise<ReviewEdit> => {
  const response = await axiosInstance.patch(`/reviews/${reviewId}`, updatedReview);
  return response.data;
};
export const useEditReview = () => {
  const queryClient = useQueryClient();

  const editReviewMutation = useMutation({
    mutationFn: ({ reviewId, updatedReview }: { reviewId: number; updatedReview: ReviewEdit }) =>
      updateReview(reviewId, updatedReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      console.log("리뷰 수정 성공!");
    },
    onError: error => {
      console.error("리뷰 수정 중 오류 발생:", error);
    },
  });

  return {
    mutate: editReviewMutation.mutate,
    isPending: editReviewMutation.isPending,
  };
};

//이미지 주소 얻기
export const uploadImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axiosInstance.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.url;
};

export const useImageUrlGet = () => {
  const useImageUrl = useMutation<string[], Error, File[]>({
    mutationFn: async filesToUpload => {
      const uploadedFileInfos: string[] = [];
      for (const file of filesToUpload) {
        const fileUrlOrInfo = await uploadImage(file); // uploadImage가 URL 또는 정보 반환
        uploadedFileInfos.push(fileUrlOrInfo);
      }
      return uploadedFileInfos; // 업로드된 파일들의 URL 또는 정보 배열 반환
    },
    onError: error => {
      console.error("업로드 중 오류 발생:", error);
    },
  });

  return { mutate: useImageUrl.mutate, isPending: useImageUrl.isPending };
};

// 리뷰 삭제
export const deleteReview = async (reviewId: number): Promise<ReviewListCard> => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => axiosInstance.delete(`/reviews/${reviewId}`),
    onSuccess: (_, reviewId) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      console.log("리뷰 삭제 성공!");
    },
    onError: error => {
      console.error("리뷰 삭제 중 오류 발생:", error);
    },
  });

  return {
    deleteReview: deleteReviewMutation.mutate,
  };
};

//리뷰 좋아요
export const postLikeReview = async (reviewId: number): Promise<Like> => {
  const response = await axiosInstance.post(`/reviews/${reviewId}/like`, { reviewId });
  return response.data;
};

//리뷰 리스트 좋아요 삭제
export const deleteLikeReview = async (reviewId: number): Promise<ReviewDelete> => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}/like`);
  return response.data;
};
