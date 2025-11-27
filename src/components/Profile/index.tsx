"use client";

import cn from "clsx";
import Image from "next/image";
import { User } from "@/types/user";
import { formatNumber } from "@/utils/formatNumber";
import { CategoryChip } from "@/components/Category";
import Button from "@/components/Button";

// 카테고리 이름별 아이콘 매핑
const CATEGORY_ICON_MAP: Record<string, string> = {
  음악: "ic_music",
  "영화/드라마": "ic_movie",
  "가구/인테리어": "ic_furniture",
  "강의/책": "ic_book",
  호텔: "ic_hotel",
  식당: "ic_noodle",
  전자기기: "ic_computer",
  화장품: "ic_brush",
  "의류/악세서리": "ic_clothes",
  앱: "ic_box",
};

interface ProfileCardProps {
  user: User;
  isMyProfile?: boolean;
  onFollowClick?: () => void;
  onEditClick?: () => void;
  onLogoutClick?: () => void;
  onFollowersClick?: () => void;
  onFolloweesClick?: () => void;
}

/**
 * 프로필 카드 컴포넌트
 * - 유저 프로필 정보 표시
 * - 내 프로필 / 다른 사람 프로필에 따라 다른 버튼 표시
 */
export default function ProfileCard({
  user,
  isMyProfile = false,
  onFollowClick,
  onEditClick,
  onLogoutClick,
  onFollowersClick,
  onFolloweesClick,
}: ProfileCardProps) {
  const {
    nickname,
    description,
    image,
    followersCount,
    followeesCount,
    averageRating,
    reviewCount,
    mostFavoriteCategory,
    isFollowing,
  } = user;

  return (
    <div className={cn("rounded-b-40 bg-white shadow")}>
      {/* 프로필 박스 */}
      <div className={cn("relative mx-auto max-w-680 px-22 py-27 md:px-62 md:py-58 lg:px-0 lg:py-42")}>
        {/* 프로필 */}
        <div className={cn("mb-40 grid grid-cols-[1fr_6fr] gap-x-20 md:grid-cols-[1fr_2fr]", "md:gap-x-60")}>
          <div
            className={cn(
              "col-start-1 col-end-2 row-start-1 row-end-3 justify-self-end",
              "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-4 md:place-self-center",
              "relative size-68 overflow-hidden rounded-full md:size-160",
            )}
          >
            <Image src={image} alt={`${nickname} 프로필`} fill className={cn("object-cover")} />
          </div>
          <h2
            className={cn(
              "col-start-2 col-end-3 row-start-1 row-end-2 self-center",
              "text-18-bold text-gray-900 md:text-24-bold",
            )}
          >
            {nickname}
          </h2>
          <p
            className={cn(
              "col-start-1 col-end-3 row-start-3 row-end-4 mt-24",
              "md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 md:mt-0",
              "text-16-regular text-gray-700",
            )}
          >
            {description}
          </p>
          <div
            className={cn(
              "self-center",
              "md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4",
              "text-14-medium text-gray-700 md:text-16-regular md:text-gray-600",
            )}
          >
            <div className={cn("flex items-center justify-between")}>
              <div>
                <button onClick={onFollowersClick} className={cn("mr-15 md:hover:opacity-90")}>
                  팔로워 <span className={cn("text-gray-900 md:text-18-bold")}>{formatNumber(followersCount)}</span>
                </button>
                <button onClick={onFolloweesClick} className={cn("md:hover:opacity-90")}>
                  팔로잉 <span className={cn("text-gray-900 md:text-18-bold")}>{formatNumber(followeesCount)}</span>
                </button>
              </div>
              {isMyProfile && (
                <button
                  onClick={onEditClick}
                  className={cn(
                    "absolute right-22 top-27",
                    "rounded-8 bg-gray-200 px-10 py-8 text-12-medium text-gray-700 md:static md:px-12 md:py-6 md:text-16-medium lg:mr-60",
                    "transition-colors hover:bg-gray-300 active:bg-gray-400",
                  )}
                >
                  프로필 편집
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className={cn("flex items-center justify-evenly border-t pb-38 pt-28 text-center")}>
          <div>
            <div className={cn("text-18-bold text-gray-900 md:text-24-bold")}>{averageRating.toFixed(1)}</div>
            <div className={cn("text-14-regular text-gray-700 md:text-16-regular")}>남긴 별점 평균</div>
          </div>
          <div>
            <div className={cn("text-18-bold text-gray-900 md:text-24-bold")}>{formatNumber(reviewCount)}</div>
            <div className={cn("text-14-regular text-gray-700 md:text-16-regular")}>남긴 리뷰</div>
          </div>
          <div>
            <div className={cn("flex items-center justify-center")}>
              {mostFavoriteCategory ? (
                <CategoryChip
                  label={mostFavoriteCategory.name}
                  icon={CATEGORY_ICON_MAP[mostFavoriteCategory.name] || "ic_box"}
                  as="div"
                  size="md"
                  className={cn("w-fit border-none bg-transparent px-0 hover:bg-transparent")}
                />
              ) : (
                <span className={cn("text-16-semibold md:text-18-semibold text-gray-400")}>-</span>
              )}
            </div>
            <div className={cn("text-14-regular text-gray-700 md:text-16-regular")}>관심 카테고리</div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={cn("flex justify-center md:px-0 lg:px-20")}>
          {isMyProfile ? (
            // 내 프로필: 로그아웃만
            <Button
              variant="tertiary"
              styleClass="!w-full !px-0 transition-colors"
              type="button"
              onClick={onLogoutClick}
            >
              로그아웃
            </Button>
          ) : (
            // 다른 유저: 팔로우 버튼
            <Button
              variant={isFollowing ? "secondary" : "primary"}
              styleClass="!w-full !px-0 transition-colors"
              type="button"
              onClick={onFollowClick}
            >
              {isFollowing ? "팔로우 취소" : "팔로우"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
