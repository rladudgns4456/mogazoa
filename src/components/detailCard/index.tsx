"use client";
//제픔 상세 카드

import { useState } from "react";
import { cn } from "@/utils/cn";
import { ModalContainer, useModal } from "../modal/modalBase";

// api
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
import { ConfigModal } from "../../components/modal";
import EditProductModal from "../product/EditProductmodal";

interface ReviewItem {
  id: number;
  isLiked: boolean;
}

export default function DetailCard({
  productId,
  userId,
  writerId,
  id,
  image,
  name,
  category,
  categoryId,
  description,
  isLoading = false,
  isError = false,
  isFavorite,
  onShare,
  onUrlCopy,
  // onSave,
  onDelete,
  onCompare,
}: DetailCardProps) {
  const { openModal } = useModal();
  const { openToast } = useToast();

  // 찜 상태
  const [isSave, setIsSave] = useState<boolean>(isFavorite);

  // 카테고리 이름 처리 (string | { name } 대응)
  const categoryName = typeof category === "string" ? category : (category?.name ?? "");

  //찜하기
  const onFavorite = async (productId: number) => {
    if (!userId) {
      openModal(<LoginAlert />);
      return;
    }
    if (userId === writerId) {
      openToast(<Toast errorMessage="내가 올린 상품은 찜할 수 없어요." error={true} />);
      return;
    }

    try {
      if (!isSave) {
        setIsSave(prev => !prev);
        openToast(<Toast label="찜 성공" closedTime={1500} />);
      } else {
        setIsSave(prev => !prev);
        openToast(<Toast label="찜 삭제" closedTime={1500} />);
      }
    } catch (error) {
      openToast(<Toast errorMessage="찜하기 중 문제가 발생했어요." error={true} />);
    }
  };

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
      openModal(<CreateReview productId={productId} id={id} image={image} name={name} category={category} />);
    } else {
      openModal(<LoginAlert />);
    }
  };

  // // 등록 제품 삭제
  const onHandleDelete = () => {
    openModal(<ConfigModal label="정말 삭제 하시겠습니까?" onConfig={onDelete} />);
  };

  //편집 모달
  const onHandleEdit = () => {
    openModal(
      <ModalContainer styleClass="w-320 sm:w-420  md:w-644 rounded-20 px-20 md:px-40 pb-32 pt-32">
        <EditProductModal
          productId={id}
          productName={name}
          initImage={image}
          initCategoryId={categoryId}
          initDescription={description}
        />
      </ModalContainer>,
    );
  };

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
            onClick={e => {
              if (!userId) {
                openModal(<LoginAlert />);
                return;
              }
              onCompare(id);
            }}
          >
            다른 상품과 비교하기
          </Button>

          {userId !== null && writerId !== null && userId === writerId ? (
            <Button
              variant="secondary"
              styleClass="w-full md:w-[38%] sm:max-w-248  md:max-w-none lg:max-w-200"
              type="button"
              onClick={onHandleDelete}
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
          aria-label="상품편집 모달 열기"
        >
          <Ic_Edit />
        </Button>
      )}
    </article>
  );
}
