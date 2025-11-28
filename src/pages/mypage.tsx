import { useAuth } from "@/components/login/AuthContext";
import ProfileCard from "@/components/Profile";
import ItemTab, { TabType } from "@/components/ItemTab";
import ItemCard from "@/components/ItemCard";
import FollowerModal from "@/components/modal/follower";
import { useModal } from "@/components/modal/modalBase";
import { ProfileSkeleton } from "@/components/skeleton";
import { getMyProfile, getUserReviewedProducts, getUserCreatedProducts, getUserFavoriteProducts } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * 내 프로필 페이지
 * - 로그인한 사용자만 접근 가능
 * - 내 프로필 정보 표시
 */
export default function MyProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<TabType>("reviews");

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // 내 프로필 조회
  const { data: user, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    enabled: isAuthenticated,
  });

  // 리뷰 남긴 상품 조회
  const { data: reviewedProducts } = useQuery({
    queryKey: ["reviewedProducts", user?.id],
    queryFn: () => getUserReviewedProducts(user!.id),
    enabled: !!user && activeTab === "reviews",
  });

  // 등록한 상품 조회
  const { data: createdProducts } = useQuery({
    queryKey: ["createdProducts", user?.id],
    queryFn: () => getUserCreatedProducts(user!.id),
    enabled: !!user && activeTab === "created",
  });

  // 찜한 상품 조회
  const { data: favoriteProducts } = useQuery({
    queryKey: ["favoriteProducts", user?.id],
    queryFn: () => getUserFavoriteProducts(user!.id),
    enabled: !!user && activeTab === "favorite",
  });

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // 프로필 편집 (추후 구현)
  const handleEdit = () => {
    console.log("프로필 편집");
  };

  // 팔로워 목록
  const handleFollowers = () => {
    if (user) {
      openModal(<FollowerModal userId={user.id} type="followers" />);
    }
  };

  // 팔로잉 목록
  const handleFollowees = () => {
    if (user) {
      openModal(<FollowerModal userId={user.id} type="followees" />);
    }
  };

  if (!isAuthenticated || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-60">
        <ProfileCard
          user={user}
          isMyProfile={true}
          onLogoutClick={handleLogout}
          onEditClick={handleEdit}
          onFollowersClick={handleFollowers}
          onFolloweesClick={handleFollowees}
        />

        {/* 탭 영역 */}
        <div className="mx-auto mt-40 max-w-940 px-18 md:px-62 lg:px-0">
          <ItemTab activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 상품 목록 */}
          <div className="mt-40">
            {activeTab === "reviews" && (
              <div className="grid grid-cols-2 gap-20 md:grid-cols-3 md:gap-24">
                {reviewedProducts?.list.length ? (
                  reviewedProducts.list.map(product => <ItemCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full py-60 text-center text-gray-500">리뷰 남긴 상품이 없습니다</div>
                )}
              </div>
            )}

            {activeTab === "created" && (
              <div className="grid grid-cols-2 gap-20 md:grid-cols-3 md:gap-24">
                {createdProducts?.list.length ? (
                  createdProducts.list.map(product => <ItemCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full py-60 text-center text-gray-500">등록한 상품이 없습니다</div>
                )}
              </div>
            )}

            {activeTab === "favorite" && (
              <div className="grid grid-cols-2 gap-20 md:grid-cols-3 md:gap-24">
                {favoriteProducts?.list.length ? (
                  favoriteProducts.list.map(product => <ItemCard key={product.id} product={product} />)
                ) : (
                  <div className="col-span-full py-60 text-center text-gray-500">찜한 상품이 없습니다</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
