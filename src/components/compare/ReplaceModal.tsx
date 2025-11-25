"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductSummary, MetricKey } from "@/utils/compareUtils";

type CompareSide = "left" | "right";

type ModalState = {
  isOpen: boolean;
  side: CompareSide | null; // 사용자가 처음 선택을 시도한 쪽
  newProduct: ProductSummary | null; // 새로 선택한 상품
};

type SelectedProducts = {
  left: ProductSummary | null;
  right: ProductSummary | null;
};

type ReplaceModalProps = {
  state: ModalState;
  selected: SelectedProducts;
  onClose: () => void; // 모달 완전히 닫기
  onConfirmReplace: (sideToKeep: CompareSide, newProduct: ProductSummary) => void;
};

type Step = "select" | "done";

export default function ReplaceModal({ state, selected, onClose, onConfirmReplace }: ReplaceModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [keepSide, setKeepSide] = useState<CompareSide>("left");

  const open = state.isOpen && !!state.newProduct;
  const { newProduct } = state;
  const { left, right } = selected;

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (!open) return;

    setStep("select");

    // 기본값: 사용자가 바꾸려고 했던 쪽의 반대편을 유지
    if (state.side === "left") setKeepSide("right");
    else if (state.side === "right") setKeepSide("left");
    else setKeepSide("left");
  }, [open, state.side]);

  // 기본적으로 두 상품이 모두 없는 상태에서는 모달을 띄우지 않음
  if (!open || !newProduct || !left || !right) return null;

  const handleBackdropClick = () => {
    // 교체 확정 전에는 닫으면 아무 변화 없음
    if (step === "select") {
      onClose();
      return;
    }
    // step === "done" 인 경우에는 이미 교체된 뒤이므로 그냥 닫기만
    onClose();
  };

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleSelectKeepSide = (side: CompareSide) => {
    setKeepSide(side);
  };

  const handleReplaceClick = () => {
    if (!newProduct) return;
    onConfirmReplace(keepSide, newProduct);
    setStep("done");
  };

  const handleGoCompare = () => {
    router.push("/compare");
    onClose();
  };

  // 현재 유지하기로 선택된 상품
  const keepProduct = keepSide === "left" ? left : right;
  const replaceProduct = keepSide === "left" ? right : left;

  return (
    <div className="bg-black/40 fixed inset-0 z-[1000] flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="relative w-full max-w-[480px] rounded-[24px] bg-white p-8 shadow-xl" onClick={handleCardClick}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={handleCloseClick}
          aria-label="닫기"
          className="absolute right-4 top-4 text-xl leading-none text-gray-400"
        >
          ×
        </button>

        {step === "select" ? (
          <>
            {/* 새 상품 이름 */}
            <p className="mb-1 text-center text-base font-semibold text-gray-800">{`'${newProduct.name}'`}</p>
            <p className="mb-6 text-center text-sm text-gray-500">어떤 상품과 비교할까요?</p>

            {/* 기존 2개 상품 선택 영역 */}
            <div className="mb-8 space-y-3">
              <button
                type="button"
                onClick={() => handleSelectKeepSide("left")}
                className={[
                  "flex w-full items-center justify-center rounded-full border px-4 py-3 text-sm transition-colors",
                  keepSide === "left"
                    ? "border-orange-400 bg-orange-50 text-orange-500"
                    : "border-gray-200 bg-gray-50 text-gray-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="truncate">{left.name}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectKeepSide("right")}
                className={[
                  "flex w-full items-center justify-center rounded-full border px-4 py-3 text-sm transition-colors",
                  keepSide === "right"
                    ? "border-orange-400 bg-orange-50 text-orange-500"
                    : "border-gray-200 bg-gray-50 text-gray-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="truncate">{right.name}</span>
              </button>
            </div>

            {/* 교체하기 버튼 */}
            <button
              type="button"
              onClick={handleReplaceClick}
              className="flex w-full items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white"
            >
              교체하기
            </button>
          </>
        ) : (
          <>
            {/* 교체 완료 메시지 */}
            <p className="mb-2 text-center text-base font-semibold text-gray-800">비교 상품이 교체되었습니다.</p>
            <p className="mb-8 text-center text-sm text-gray-500">바로 확인해 보시겠어요?</p>

            {/* 바로가기 버튼 */}
            <button
              type="button"
              onClick={handleGoCompare}
              className="flex w-full items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white"
            >
              바로가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
