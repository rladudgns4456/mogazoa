import { useQuery } from "@tanstack/react-query";
import { getUserReviewedProducts, getUserCreatedProducts, getUserFavoriteProducts } from "@/api/users";
import { TabType } from "@/components/profile/ItemTab";

export function useProfileProducts(userId: number | undefined, activeTab: TabType) {
  // 리뷰 남긴 상품 조회
  const { data: reviewedProducts } = useQuery({
    queryKey: ["reviewedProducts", userId],
    queryFn: () => getUserReviewedProducts(userId!),
    enabled: !!userId && activeTab === "reviews",
  });

  // 등록한 상품 조회
  const { data: createdProducts } = useQuery({
    queryKey: ["createdProducts", userId],
    queryFn: () => getUserCreatedProducts(userId!),
    enabled: !!userId && activeTab === "created",
  });

  // 찜한 상품 조회
  const { data: favoriteProducts } = useQuery({
    queryKey: ["favoriteProducts", userId],
    queryFn: () => getUserFavoriteProducts(userId!),
    enabled: !!userId && activeTab === "favorite",
  });

  return {
    reviewedProducts,
    createdProducts,
    favoriteProducts,
  };
}
