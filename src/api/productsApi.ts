import axiosInstance from "@/api/AxiosInstance";
import { useQuery, QueryClient, dehydrate, useMutation } from "@tanstack/react-query";
import { Products } from "@/types/product";

interface ProductsProps extends Products {
  isError: boolean;
}

// Product 목록 데이터 가져오기
export async function getProducts(): Promise<ProductsProps> {
  const response = await axiosInstance.get(`/products`);
  return response.data;
}

// Product 상세 가져오기
export async function getProductItem(id: number) {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
}

export function useProductItem(productId:number) {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductItem(productId),
  });
}

//찜 하기
export async function postProductFavorite(productId: number): Promise<ProductsProps> {
  const response = await axiosInstance.post(`/products/${productId}/favorite`);
  return response.data;
}

//찜 삭제
export async function deleteProductFavorite(productId: number): Promise<ProductsProps> {
  const response = await axiosInstance.delete(`/products/${productId}/favorite`);
  return response.data;
}
//제품 삭제
export async function deleteProduct(productId: number): Promise<ProductsProps> {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return response.data;
}

