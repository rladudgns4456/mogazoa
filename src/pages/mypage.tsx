import { useAuth } from "@/components/login/AuthContext";
import ProfileCard from "@/components/profile";
import ProfileProductTabs from "@/components/profile/ProfileProductTabs";
import { ProfileSkeleton } from "@/components/skeleton";
import { getMyProfile } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TabType } from "@/components/profile/ItemTab";
import { useProfileProducts } from "@/hooks/useProfileProducts";
import { useFollowModal } from "@/hooks/useFollowModal";

/**
 * 내 프로필 페이지
 * - 로그인한 사용자만 접근 가능
 * - 내 프로필 정보 표시
 */
export default function MyProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
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

  // 상품 데이터 조회
  const { reviewedProducts, createdProducts, favoriteProducts } = useProfileProducts(user?.id, activeTab);

  // 팔로우 모달 핸들러
  const { handleFollowers, handleFollowees } = useFollowModal(user?.id);

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // 프로필 편집 (추후 구현)
  const handleEdit = () => {
    console.log("프로필 편집");
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

        <ProfileProductTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewedProducts={reviewedProducts}
          createdProducts={createdProducts}
          favoriteProducts={favoriteProducts}
        />
      </div>
    </div>
  );
}
