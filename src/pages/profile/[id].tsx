import { useAuth } from "@/components/login/AuthContext";
import ProfileCard from "@/components/Profile";
import ItemTab, { TabType } from "@/components/ItemTab";
import ItemCard from "@/components/ItemCard";
import FollowerModal from "@/components/modal/follower";
import { useModal } from "@/components/modal/modalBase";
import { ProfileSkeleton } from "@/components/skeleton";
import {
  getUserProfile,
  followUser,
  unfollowUser,
  getUserReviewedProducts,
  getUserCreatedProducts,
  getUserFavoriteProducts,
} from "@/api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { User } from "@/types/user";

/**
 * 다른 사용자 프로필 페이지
 * - 동적 라우팅으로 사용자 ID를 받아서 프로필 표시
 * - 로그인 여부와 관계없이 접근 가능
 * - 비로그인 상태에서 팔로우 버튼 클릭시 로그인 페이지로 이동
 */
export default function UserProfilePage() {
  const { isAuthenticated, user: authUser } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<TabType>("reviews");

  const userId = typeof id === "string" ? parseInt(id, 10) : null;

  // 사용자 프로필 조회
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

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

  // 팔로우 mutation
  const followMutation = useMutation({
    mutationFn: followUser,
    onMutate: async () => {
      // Optimistic update: 즉시 UI 반영
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
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile", userId], context.previousData);
      }
    },
    onSuccess: () => {
      // 프로필 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      // 내 프로필도 갱신 (팔로잉 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // 언팔로우 mutation
  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onMutate: async () => {
      // Optimistic update: 즉시 UI 반영
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
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(["userProfile", userId], context.previousData);
      }
    },
    onSuccess: () => {
      // 프로필 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      // 내 프로필도 갱신 (팔로잉 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // 팔로우/언팔로우 토글
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
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

  // 팔로워 목록
  const handleFollowers = () => {
    if (userId) {
      openModal(<FollowerModal userId={userId} type="followers" />);
    }
  };

  // 팔로잉 목록
  const handleFollowees = () => {
    if (userId) {
      openModal(<FollowerModal userId={userId} type="followees" />);
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
