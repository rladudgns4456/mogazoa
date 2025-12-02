import axiosInstance from "./AxiosInstance";

export type CategoryApiResponse = {
  id: number;
  name: string;
};

/** 카테고리 목록 조회 */
export async function fetchCategories() {
  const { data } = await axiosInstance.get<CategoryApiResponse[]>("/categories");
  return data;
}
