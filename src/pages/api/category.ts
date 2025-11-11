import axiosInstance from "@/api/AxiosInstance";

// 카테고리 데이터 가져오기
export async function getCategories() {
  const response = await axiosInstance.get(`/categories`);
  return response.data; 
}
