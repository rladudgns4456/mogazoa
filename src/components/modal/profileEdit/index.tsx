import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ModalContainer from "@/components/modal/modalBase/ModalContainer";
import { useModal } from "@/components/modal/modalBase";
import { useToast, Toast } from "@/components/toast";
import Button from "@/components/Button";
import { User } from "@/types/user";
import { updateMyProfile } from "@/api/users";
import { uploadImage } from "@/api/images";
import { compressImage, sanitizeFileName, fileToDataURL } from "@/utils/imageUtils";
import cn from "clsx";
import Image from "next/image";
import DefaultProfileImage from "@/assets/images/not_card.svg";
import IcAddImgW from "@/assets/icons/ic_add_img_w.svg";

interface ProfileEditModalProps {
  user: User;
}

/**
 * 프로필 편집 모달
 * - 닉네임, 자기소개 수정
 * - 프로필 이미지 업로드
 */
export default function ProfileEditModal({ user }: ProfileEditModalProps) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const { openToast } = useToast();

  const [nickname, setNickname] = useState(user.nickname);
  const [description, setDescription] = useState(user.description || "");
  const [previewImage, setPreviewImage] = useState<string | null>(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 이미지 선택 및 압축
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. 파일명 안전하게 변경
      const safeFileName = sanitizeFileName(file.name);
      const safeFile = new File([file], safeFileName, { type: file.type });

      // 2. 이미지 압축
      const compressedFile = await compressImage(safeFile, 0.1, 400);
      setImageFile(compressedFile);

      // 3. 미리보기 생성
      const dataURL = await fileToDataURL(compressedFile);
      setPreviewImage(dataURL);
    } catch (error) {
      alert("이미지 처리 중 오류가 발생했습니다.");
    }
  };

  // 프로필 수정 mutation
  const editMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      openToast(<Toast label="프로필이 수정되었습니다." />);
      closeModal();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "프로필 수정에 실패했습니다.");
    },
    onSettled: () => {
      setIsUploadingImage(false);
    },
  });

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const updateData: { nickname: string; description?: string; image?: string } = {
        nickname,
      };

      if (description.trim()) {
        updateData.description = description;
      }

      // 이미지 업로드
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        updateData.image = imageUrl;
      }

      editMutation.mutate(updateData);
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      setIsUploadingImage(false);
    }
  };

  return (
    <ModalContainer styleClass="w-[90vw] max-w-580 rounded-20 px-27 py-32 md:p-40">
      <div>
        {/* 헤더 */}
        <h2 className="mb-24 pr-32 text-18-bold text-gray-900 md:text-24-bold">프로필 편집</h2>

        {/* 프로필 이미지 */}
        <div className="mb-24 flex flex-col items-center">
          <div className="relative mb-16 h-130 w-130 overflow-hidden rounded-full">
            {previewImage ? (
              <Image src={previewImage} alt="프로필 이미지" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <DefaultProfileImage className="h-full w-full opacity-60" />
              </div>
            )}
            {/* 이미지 편집 오버레이 */}
            <label
              htmlFor="profile-image"
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-gray-900 opacity-0 transition-opacity hover:opacity-60"
            >
              <IcAddImgW width={40} height={40} />
            </label>
            <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-20">
          <label className="mb-12 block text-12-bold text-gray-900 md:text-14-bold">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className={cn(
              "w-full rounded-8 border border-gray-200 px-16 py-12",
              "text-14-regular text-gray-900 placeholder:text-gray-400",
              "focus:border-primary-500 focus:outline-none",
            )}
            maxLength={20}
          />
        </div>

        {/* 자기소개 입력 */}
        <div className="mb-32">
          <label className="mb-12 block text-12-bold text-gray-900 md:text-14-bold">자기소개</label>
          <div className="relative">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="자기소개를 작성해주세요"
              className={cn(
                "h-120 w-full resize-none rounded-8 border border-gray-200 px-16 py-12 pb-32",
                "text-14-regular text-gray-900 placeholder:text-gray-400",
                "focus:border-primary-500 focus:outline-none",
                "scrollbar-custom",
              )}
              maxLength={300}
            />
            <div className="absolute bottom-12 right-12 text-12-regular text-gray-400 md:bottom-20 md:right-20">
              {description.length}/300
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <Button
          variant="primary"
          type="button"
          onClick={handleSubmit}
          disabled={editMutation.isPending || isUploadingImage}
          styleClass="!w-full"
        >
          {isUploadingImage ? "이미지 업로드 중..." : editMutation.isPending ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </ModalContainer>
  );
}
