import cn from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Follower } from "@/types/user";

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
  const { id, nickname, image } = follower;

  return (
    <Link
      href={`/user/${id}`}
      onClick={onClick}
      className={cn("flex items-center gap-12 border-b py-12 transition-colors", "hover:bg-gray-50 active:bg-gray-100")}
    >
      <div className={cn("relative size-48 flex-shrink-0 overflow-hidden rounded-full", "md:size-52")}>
        <Image src={image} alt={`${nickname} 프로필`} fill className={cn("object-cover")} />
      </div>

      <span className={cn("text-14-regular text-gray-900", "md:text-16-medium")}>{nickname}</span>
    </Link>
  );
}
