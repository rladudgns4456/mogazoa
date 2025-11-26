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
// 공통 레이아웃
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

  // 모달 열릴 때 기본 선택값 세팅
  useEffect(() => {
    setStep("select");
    setKeepSide(triggerSide === "left" ? "right" : "left");
  }, [triggerSide]);

  const handleReplaceClick = () => {
    onConfirmReplace(keepSide);
    setStep("done");
  };

  const handleGoCompare = () => {
    router.push("/compare");
    closeModal();
  };

  if (!left || !right) return null;

  const Inner: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex h-[453px] w-full flex-col items-center gap-20 px-10 pb-9 pt-8">{children}</div>
  );

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
        {/* 제목 */}
        <div className="mb-8 text-center">
          <p className="text-[20px] font-medium leading-[24px] text-[#000000]">{`'${newProduct.name}'`}</p>
          <p className="mt-2 text-[14px] leading-[20px] text-[#555A64]">어떤 상품과 비교할까요?</p>
        </div>

        {/* 상품 버튼 */}
        <div className="mb-10 flex w-full flex-col items-center gap-20">
          <SecondaryButton label={left.name} active={keepLeft} onClick={() => setKeepSide("left")} />
          <SecondaryButton label={right.name} active={!keepLeft} onClick={() => setKeepSide("right")} />
        </div>

        {/* 교체하기 */}
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

      <PrimaryButton label="바로가기" onClick={handleGoCompare} />
    </InnerDone>
  );
};

export default ReplaceModal;
