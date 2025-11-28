import { useQuery } from "@tanstack/react-query";
import ModalContainer from "@/components/modal/modalBase/ModalContainer";
import FollowerItem from "@/components/follower";
import { useModal } from "@/components/modal/modalBase";
import { useAuth } from "@/components/login/AuthContext";
import { getFollowers, getFollowees } from "@/api/users";
import { useRouter } from "next/router";
import { Follower } from "@/types/user";

interface FollowerModalProps {
  userId: number;
  type: "followers" | "followees";
}

/**
 * 팔로워/팔로잉 목록 모달
 * - 팔로워 또는 팔로잉 사용자 목록 표시
 * - 프로필 클릭 시 해당 사용자 페이지로 이동
 */
export default function FollowerModal({ userId, type }: FollowerModalProps) {
  const { closeModal } = useModal();
  const { user: authUser } = useAuth();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: [type, userId],
    queryFn: () => (type === "followers" ? getFollowers(userId) : getFollowees(userId)),
  });

  // API 응답에서 실제 사용자 객체만 추출
  // followers: item.follower, followees: item.followee
  const followers =
    data?.list
      .map(item => {
        // type에 따라 follower 또는 followee 사용
        return type === "followers" ? item.follower : item.followee;
      })
      .filter((f): f is Follower => f !== undefined && f.id !== undefined) || []; // undefined 제거

  const title = type === "followers" ? "팔로워" : "팔로잉";

  // 팔로워 클릭 핸들러
  const handleFollowerClick = (followerId: number) => {
    closeModal();

    // 자신의 프로필이면 mypage로, 아니면 user/[id]로
    if (authUser && followerId === authUser.id) {
      router.push("/mypage");
    } else {
      router.push(`/user/${followerId}`);
    }
  };

  return (
    <ModalContainer styleClass="w-[90vw] max-w-500 rounded-20 px-27 py-32 md:p-40">
      <div>
        {/* 헤더 */}
        <h2 className="mb-24 pr-32 text-18-bold text-gray-900 md:text-24-bold">
          {title} <span className="text-primary-600">{followers.length}</span>
        </h2>

        {/* 팔로워/팔로잉 목록 */}
        <div className="max-h-650 overflow-y-auto">
          {followers.length > 0 ? (
            <ul>
              {followers.map(follower => (
                <li key={follower.id}>
                  <FollowerItem follower={follower} onClick={() => handleFollowerClick(follower.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-40 text-center text-14-regular text-gray-500">
              {type === "followers" ? "팔로워가 없습니다" : "팔로잉이 없습니다"}
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
