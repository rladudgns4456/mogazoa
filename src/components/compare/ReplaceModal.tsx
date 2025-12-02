"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/modal/modalBase/modalProvider";
import type { ProductSummary } from "@/utils/compareUtils";

type CompareSide = "left" | "right";
type Step = "select" | "done";

interface ReplaceModalProps {
  triggerSide: CompareSide;
  left: ProductSummary;
  right: ProductSummary;
  newProduct: ProductSummary;
  onConfirmReplace: (keepSide: CompareSide) => void;
}

const InnerSelect: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-[453px] w-full flex-col items-center px-10 pb-9 pt-8">{children}</div>
);

const InnerDone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-[263px] w-full flex-col items-center px-10 pb-9 pt-8">{children}</div>
);

const ReplaceModal: React.FC<ReplaceModalProps> = ({ triggerSide, left, right, newProduct, onConfirmReplace }) => {
  const router = useRouter();
  const { closeModal } = useModal();

  const [step, setStep] = useState<Step>("select");
  const [keepSide, setKeepSide] = useState<CompareSide>("left");

  useEffect(() => {
    // 새로 연 경우엔 “트리거한 쪽과 반대편 상품을 기본으로 유지”하도록
    setStep("select");
    setKeepSide(triggerSide === "left" ? "right" : "left");
  }, [triggerSide]);

  const handleReplaceClick = () => {
    onConfirmReplace(keepSide); // 실제 교체는 여기서만 발생
    setStep("done");
  };

  const handleGoCompare = () => {
    router.push("/compare");
    closeModal();
  };

  const handleCloseOnly = () => {
    // 비교 화면으로 이동하지 않고, 단순히 모달만 닫기
    closeModal();
  };

  if (!left || !right) return null;

  const SecondaryButton: React.FC<{
    active?: boolean;
    label: string;
    onClick: () => void;
  }> = ({ active, label, onClick }) => {
    const base =
      "flex w-full max-w-[420px] h-[60px] items-center justify-center rounded-[1000px] border text-[14px] transition-colors";
    const activeClass = "border-[#FF9A00] text-[#FF9A00] bg-white";
    const inactiveClass = "border-[#DBDCE1] text-gray-400 bg-white hover:border-[#FF9A00] hover:text-[#FF9A00]";

    return (
      <button type="button" onClick={onClick} className={`${base} ${active ? activeClass : inactiveClass}`}>
        <span className="truncate">{label}</span>
      </button>
    );
  };

  const PrimaryButton: React.FC<{
    label: string;
    onClick: () => void;
  }> = ({ label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex h-[67px] w-full max-w-[420px] items-center justify-center rounded-[1000px] bg-[#FD7E35] text-[15px] font-semibold text-white"
    >
      {label}
    </button>
  );

  // ===================== STEP 1: 어떤 상품과 비교할까요? =====================
  if (step === "select") {
    const keepLeft = keepSide === "left";

    return (
      <InnerSelect>
        <div className="mb-8 text-center">
          <p className="text-[20px] font-medium leading-[24px] text-[#000000]">{`'${newProduct.name}'`}</p>
          <p className="mt-2 text-[14px] leading-[20px] text-[#555A64]">어떤 상품과 비교할까요?</p>
        </div>

        <div className="mb-10 flex w-full flex-col items-center gap-20">
          <SecondaryButton label={left.name} active={keepLeft} onClick={() => setKeepSide("left")} />
          <SecondaryButton label={right.name} active={!keepLeft} onClick={() => setKeepSide("right")} />
        </div>

        <PrimaryButton label="교체하기" onClick={handleReplaceClick} />
      </InnerSelect>
    );
  }

  // ===================== STEP 2: 교체 완료 =====================
  return (
    <InnerDone>
      <div className="mb-6 mt-4 text-center">
        <p className="text-[20px] font-semibold text-gray-900">비교 상품이 교체되었습니다.</p>
        <p className="mt-1 text-[14px] text-gray-500">바로 확인해 보시겠어요?</p>
      </div>

      {/* 선택지 두 개: 나중에 / 바로가기 */}
      <div className="mt-4 flex w-full max-w-[420px] flex-col gap-3">
        <button
          type="button"
          onClick={handleCloseOnly}
          className="flex h-[56px] w-full items-center justify-center rounded-[1000px] border border-[#DBDCE1] text-[14px] text-gray-500"
        >
          나중에 볼게요
        </button>

        <PrimaryButton label="비교 화면 바로가기" onClick={handleGoCompare} />
      </div>
    </InnerDone>
  );
};

export default ReplaceModal;
