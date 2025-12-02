"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useModal } from "../modal/modalBase";

// api
import { deleteProduct } from "@/api/productsApi";
import Button from "../Button";
import Image from "next/image";
import { Skeleton } from "../skeleton";
import { CreateReview } from "@/pages/product/_components/reviewModal";
import LoginAlert from "../modal/loginAlert";
import { useToast, Toast } from "@/components/toast";
import type { DetailCardProps } from "@/types/product";

import Ic_Share from "@/assets/icons/ic_share.svg";
import Ic_Save from "@/assets/icons/ic_save.svg";
import Ic_UnSave from "@/assets/icons/ic_unsave.svg";
import Ic_Comment from "@/assets/icons/ic_kakao.svg";
import Ic_Edit from "@/assets/icons/ic_edit.svg";

export default function DetailCard({
  currentPath = "",
  userId = null,
  writerId = null,
  id = 0,
  image = "",
  name = "",
  category,
  description = "",
  isLoading = false,
  isError = false,
  isFavorite = false,
  onShare,
  onUrlCopy,
  onSave,
  onDelete,
  onCompare,
}: DetailCardProps) {
  const { openModal } = useModal();
  const { openToast } = useToast();

  // 찜 상태
  const [isSave, setIsSave] = useState<boolean>(!!isFavorite);

  // 카테고리 이름 처리 (string | { name } 대응)
  const categoryName = typeof category === "string" ? category : (category?.name ?? "");

  // 찜하기
  const onFavorite = async (productId: number) => {
    if (!onSave) return; // 콜백이 없으면 아무 것도 하지 않음

    if (userId !== null && writerId !== null && userId === writerId) {
      openToast(<Toast errorMessage="내가 올린 상품은 찜할 수 없어요." error={true} />);
      return;
    }

    setIsSave(prev => !prev);
    try {
      await onSave(productId);
    } catch (error) {
      setIsSave(prev => !prev);
      openToast(<Toast errorMessage={isSave ? "찜 삭제 실패 " : "찜 성공"} error />);
    }
  };

  useEffect(() => {
    setIsSave(!!isFavorite);
  }, [isFavorite]);

  // 리뷰 모달 열기
  const onHandleReviewModalOpen = () => {
    if (!id) return;

    let modalCategory: { id: number; name: string } | undefined;

    if (typeof category === "string") {
      modalCategory = { id: 0, name: category };
    } else if (category && typeof category.name === "string") {
      modalCategory = { id: category.id ?? 0, name: category.name };
    } else {
      modalCategory = undefined;
    }

    if (userId) {
      openModal(<CreateReview currentPath={currentPath} id={id} image={image} name={name} category={modalCategory} />);
    } else {
      openModal(<LoginAlert />);
    }
  };

  // 등록 제품 삭제
  const onHandleDelete = async (productId: number) => {
    try {
      if (onDelete) {
        await onDelete(productId);
      } else {
        await deleteProduct(productId);
      }
    } catch (error) {
      // 필요하면 토스트 띄우기
    }
  };

  // 편집 모달 (아직 미구현)
  const onHandleEdit = () => {};

  if (isError) {
    return (
      <div className="relative flex h-300 w-full items-center justify-center">
        <p>상품을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <article
      className={cn("relative mx-auto flex w-full flex-col gap-x-46", "lg:max-w-980 lg:flex-row lg:pb-53 lg:pt-55")}
    >
      <div
        className={cn(
          "rounded-0 relative h-320 w-full overflow-hidden",
          "md:h-438 lg:h-386 lg:w-420 lg:min-w-420 lg:rounded-24",
        )}
      >
        {isLoading ? (
          <Skeleton styleClass="w-full h-full" />
        ) : (
          <Image
            width={100}
            height={100}
            src={image}
            alt={name || "상품 이미지"}
            className="h-full w-full"
            loading="eager"
          />
        )}
      </div>

      <div className="flex flex-col px-20 pt-39 sm:px-62 lg:px-0">
        <div className="mb-12 flex flex-col gap-y-12 md:mb-20">
          <h3 className="relative text-16-regular text-gray-700 after:absolute after:pl-5 after:content-['>']">
            {isLoading ? <Skeleton styleClass="block w-100 h-20" /> : categoryName}
          </h3>
          <h4 className="relative text-24-bold text-gray-900">
            {isLoading ? <Skeleton styleClass="block w-100 h-30" /> : name}
          </h4>
        </div>

        {isLoading ? (
          <Skeleton styleClass="block w-full h-min-100" />
        ) : (
          <p className="scrollbar-hide overflew-y-auto relative mb-20 max-h-110 leading-[1.6] text-gray-700">
            {description}
          </p>
        )}

        <div className="mb-32 mt-auto flex gap-x-12 md:mb-55">
          <Button
            variant="onlyIcon"
            iconType="etc"
            type="button"
            onClick={() => onFavorite(id)}
            styleClass="p-0"
            aria-label="좋아요"
          >
            {isSave ? <Ic_Save /> : <Ic_UnSave />}
          </Button>

          <Button
            variant="onlyIcon"
            iconType="etc"
            styleClass="p-0"
            type="button"
            aria-label="카카오톡"
            onClick={onShare}
          >
            <Ic_Comment />
          </Button>

          <Button
            variant="onlyIcon"
            iconType="etc"
            styleClass="p-0"
            type="button"
            aria-label="공유"
            onClick={onUrlCopy}
          >
            <Ic_Share />
          </Button>
        </div>

        <div className="flex flex-col gap-12 sm:flex-row">
          <Button
            variant="primary"
            styleClass="w-full md:w-[72%] sm:max-w-360 md:max-w-none lg:max-w-280"
            type="button"
            onClick={() => onCompare && onCompare(id)}
          >
            다른 상품과 비교하기
          </Button>

          {userId !== null && writerId !== null && userId === writerId ? (
            <Button
              variant="secondary"
              styleClass="w-full md:w-[38%] sm:max-w-248  md:max-w-none lg:max-w-200"
              type="button"
              onClick={() => onHandleDelete(id)}
            >
              삭제하기
            </Button>
          ) : (
            <Button
              variant="secondary"
              styleClass="w-full md:w-[38%] sm:max-w-248  md:max-w-none lg:max-w-200"
              type="button"
              onClick={onHandleReviewModalOpen}
            >
              리뷰 작성하기
            </Button>
          )}
        </div>
      </div>

      {userId !== null && writerId !== null && userId === writerId && (
        <Button
          variant="onlyIcon"
          iconType="line"
          type="button"
          styleClass="absolute top-292 md:top-406 right-54 lg:top-52 lg:-right-44"
          onClick={onHandleEdit}
        >
          <Ic_Edit />
        </Button>
      )}
    </article>
  );
}
