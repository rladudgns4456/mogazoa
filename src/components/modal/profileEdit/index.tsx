import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ModalContainer from "@/components/modal/modalBase/ModalContainer";
import { useModal } from "@/components/modal/modalBase";
import Button from "@/components/Button";
import { User } from "@/types/user";
import { updateMyProfile } from "@/api/users";
import { uploadImage } from "@/api/images";
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

  const [nickname, setNickname] = useState(user.nickname);
  const [description, setDescription] = useState(user.description || "");
  const [previewImage, setPreviewImage] = useState<string | null>(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 이미지 압축 및 리사이즈 함수
  const compressImage = async (file: File, maxSizeMB: number = 0.1, maxWidth: number = 400): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // 비율 유지하면서 리사이즈
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // 원본 파일 타입 유지 (PNG 투명도 지원)
          const mimeType = file.type || "image/jpeg";
          const isJPEG = mimeType === "image/jpeg" || mimeType === "image/jpg";

          // 품질을 조절하면서 용량 체크
          let quality = 0.7;
          const compress = () => {
            canvas.toBlob(
              blob => {
                if (!blob) {
                  reject(new Error("이미지 압축 실패"));
                  return;
                }

                const sizeInMB = blob.size / 1024 / 1024;

                // 용량이 목표보다 크고 품질을 더 낮출 수 있으면 재압축
                if (sizeInMB > maxSizeMB && quality > 0.1) {
                  quality -= 0.1;
                  compress();
                  return;
                }

                // File 객체로 변환
                const compressedFile = new File([blob], file.name, {
                  type: mimeType,
                  lastModified: Date.now(),
                });

                resolve(compressedFile);
              },
              mimeType,
              isJPEG ? quality : undefined, // PNG는 quality 없음
            );
          };

          compress();
        };
        img.onerror = () => reject(new Error("이미지 로드 실패"));
      };
      reader.onerror = () => reject(new Error("파일 읽기 실패"));
    });
  };

  // 이미지 업로드 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 파일명에서 특수문자 제거 (안전한 파일명으로 변경)
        const safeFileName = file.name
          .replace(/[^a-zA-Z0-9.\-_]/g, "_") // 영문, 숫자, ., -, _ 외 모두 _로 치환
          .replace(/_{2,}/g, "_"); // 연속된 _는 하나로

        // 안전한 파일명으로 새 File 객체 생성
        const safeFile = new File([file], safeFileName, { type: file.type });

        // 이미지 압축 (100KB, 400px로 더 강하게 압축)
        const compressedFile = await compressImage(safeFile, 0.1, 400);
        setImageFile(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("이미지 처리 오류:", error);
        alert("이미지 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // 프로필 수정 mutation
  const editMutation = useMutation({
    mutationFn: async (data: { nickname: string; description?: string; image?: string }) => {
      return updateMyProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setIsUploadingImage(false);
      closeModal();
    },
    onError: (error: any) => {
      setIsUploadingImage(false);
      alert(error.response?.data?.message || "프로필 수정에 실패했습니다.");
    },
  });

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsUploadingImage(true);

    try {
      // 기본 데이터
      const updateData: { nickname: string; description?: string; image?: string } = {
        nickname,
      };

      // description이 있을 때만 추가
      if (description.trim()) {
        updateData.description = description;
      }

      // 이미지가 변경된 경우 업로드
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          console.log("업로드된 이미지 URL:", imageUrl);
          updateData.image = imageUrl;
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드에 실패했습니다.");
          setIsUploadingImage(false);
          return;
        }
      }

      editMutation.mutate(updateData);
    } catch (error) {
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
          <label className="mb-8 block text-14-medium text-gray-900">닉네임</label>
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
          <label className="mb-8 block text-14-medium text-gray-900">자기소개</label>
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
