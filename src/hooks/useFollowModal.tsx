import FollowerModal from "@/components/modal/follower";
import { useModal } from "@/components/modal/modalBase";

/**
 * 팔로워/팔로잉 모달 핸들러 커스텀 훅
 */
export function useFollowModal(userId: number | undefined) {
  const { openModal } = useModal();

  const handleFollowers = () => {
    if (userId) {
      openModal(<FollowerModal userId={userId} type="followers" />);
    }
  };

  const handleFollowees = () => {
    if (userId) {
      openModal(<FollowerModal userId={userId} type="followees" />);
    }
  };

  return {
    handleFollowers,
    handleFollowees,
  };
}
