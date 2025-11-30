import axiosInstance from "./AxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {ReviewListCard} from "../types/review" 
// import { Like, ReviewListCard } from "../types/product";

// 리뷰 정렬 함수
export async function getReviews(productId: number, order: string): Promise<ReviewListCard> {
  const response = await axiosInstance.get(`/products/${productId}/reviews?order=${order}`);
  return response.data;
}

export function useGetReview(productId: number, order: string) {
  return useQuery({
    queryKey: ["reviews", productId, order],
    queryFn: () => getReviews(Number(productId), order),
    staleTime: 1000 * 10 * 5,
  });
}

//리뷰 생성
export const createReview = async (newReview: ReviewListCard): Promise<ReviewListCard> => {
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
export const updateReview = async (reviewId: number, updatedReview: ReviewListCard): Promise<ReviewListCard> => {
  const response = await axiosInstance.patch(`/reviews/${reviewId}`, updatedReview);
  return response.data;
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

  return { mutate: useImageUrl.mutate };
};

// 리뷰 삭제
export const deleteReview = async (reviewId: number): Promise<ReviewListCard> => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};

// 삭제 뮤테이션 설정
// export const deleteMutation = useMutation({
//   mutationFn: deleteReview, // 삭제 요청 함수
//   onSuccess: () => { 
//     const queryClient = useQueryClient();
//     // 삭제 성공 시 리뷰 목록 다시 불러오기
//     queryClient.refetchQueries({ queryKey: ["reviews"] });
//     // 성공 메시지 토스트 띄우기
//     // openToast(<Toast label="리뷰가 성공적으로 삭제되었습니다." />);
//   },
//   onError: error => {
//     console.error("삭제 실패:", error);
//     // 실패 시 에러 메시지 토스트 띄우기 (필요시 활성화)
//     // openToast(<Toast message="리뷰 삭제에 실패했습니다." type="error" />);
//   },
// });

//리뷰 좋아요
export const LikeReview = async (reviewId: number): Promise<Like> => {
  const response = await axiosInstance.post(`/reviews/${reviewId}/like`, reviewId);
  return response.data;
};

//리뷰 리스트 좋아요 삭제
// export const deleteLikeReview = async (reviewId: number): Promise<Like> => {
//   const response = await axiosInstance.delete(`/reviews/${reviewId}/like`, reviewId);
//   return response.data;
// };
