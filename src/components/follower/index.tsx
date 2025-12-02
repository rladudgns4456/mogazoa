"use client";

import cn from "clsx";
import Image from "next/image";
import { Follower } from "@/types/user";
import DefaultProfileImage from "@/assets/images/not_card.svg";
import { isValidImageUrl } from "@/utils/validateImageUrl";

interface FollowerItemProps {
  follower: Follower;
  onClick?: () => void;
}

/**
 * 팔로워 컴포넌트
 * - 팔로워/팔로잉 목록 모달에서 사용
 * - 프로필 사진과 닉네임 표시
 */
export default function FollowerItem({ follower, onClick }: FollowerItemProps) {
  const { nickname, image } = follower;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-12 border-b py-12 text-left transition-colors",
        "hover:bg-gray-50 active:bg-gray-100",
      )}
    >
      <div className={cn("relative size-48 flex-shrink-0 overflow-hidden rounded-full", "md:size-52")}>
        {isValidImageUrl(image) ? (
          <Image src={image!} alt={`${nickname} 프로필`} fill className="object-cover" />
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center bg-gray-100")}>
            <DefaultProfileImage className="h-full w-full opacity-60" />
          </div>
        )}
      </div>

      <span className={cn("text-14-regular text-gray-900", "md:text-16-medium")}>{nickname}</span>
    </button>
  );
}
