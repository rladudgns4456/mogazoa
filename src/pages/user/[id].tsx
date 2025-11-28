import { useAuth } from "@/components/login/AuthContext";
import ProfileCard from "@/components/profile";
import ProfileProductTabs from "@/components/profile/ProfileProductTabs";
import { ProfileSkeleton } from "@/components/skeleton";
import { getUserProfile, followUser, unfollowUser } from "@/api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { User } from "@/types/user";
import { TabType } from "@/components/profile/ItemTab";
import { useProfileProducts } from "@/hooks/useProfileProducts";
import { useFollowModal } from "@/hooks/useFollowModal";

/**
 * 다른 사용자 프로필 페이지
 * - 동적 라우팅으로 사용자 ID를 받아서 프로필 표시
 * - 로그인 여부와 관계없이 접근 가능
 * - 비로그인 상태에서 팔로우 버튼 클릭시 로그인 페이지로 이동
 */
export default function UserProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("reviews");

  const userId = typeof id === "string" ? parseInt(id, 10) : null;

  // 사용자 프로필 조회
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  // 상품 데이터 조회
  const { reviewedProducts, createdProducts, favoriteProducts } = useProfileProducts(userId || undefined, activeTab);

  // 팔로우 모달 핸들러
  const { handleFollowers, handleFollowees } = useFollowModal(userId || undefined);

  // 팔로우 mutation
  const followMutation = useMutation({
    mutationFn: followUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });
      const previousData = queryClient.getQueryData<User>(["userProfile", userId]);

      queryClient.setQueryData(["userProfile", userId], (old: User | undefined) => ({
        ...old,
        isFollowing: true,
        followersCount: (old?.followersCount || 0) + 1,
      }));

      return { previousData };
    },
    onError: (err, variables, context: { previousData: User | undefined } | undefined) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile", userId], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // 언팔로우 mutation
  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });
      const previousData = queryClient.getQueryData<User>(["userProfile", userId]);

      queryClient.setQueryData(["userProfile", userId], (old: User | undefined) => ({
        ...old,
        isFollowing: false,
        followersCount: Math.max((old?.followersCount || 0) - 1, 0),
      }));

      return { previousData };
    },
    onError: (err, variables, context: { previousData: User | undefined } | undefined) => {
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile", userId], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // 팔로우/언팔로우 토글
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!userId) return;

    if (user?.isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
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
          isMyProfile={false}
          onFollowClick={handleFollowToggle}
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
