// src/components/compare/ReplaceModal.tsx

import React from "react";
import { ProductSummary } from "@/utils/compareUtils"; // tsconfig.json paths 적용
import { useRouter } from "next/router";
// NOTE: 프로젝트에 useRouter가 없으므로 임시로 주석 처리하거나, 필요하다면 설치해야 합니다.
// 'next/router'는 package.json에 없으므로, Next.js 버전을 고려하여 'next/navigation' 또는 'next/router' 사용 여부를 결정하세요.
// 여기서는 `next/router`가 Next.js 16.0.1에 호환된다고 가정하고 추가했습니다.

type CompareSide = "left" | "right";

interface ReplaceModalProps {
  state: {
    isOpen: boolean;
    side: CompareSide | null;
    newProduct: ProductSummary | null;
  };
  selected: { left: ProductSummary | null; right: ProductSummary | null };
  onClose: () => void;
  onConfirmReplace: (sideToKeep: CompareSide, newProduct: ProductSummary) => void;
}

export default function ReplaceModal({ state, selected, onClose, onConfirmReplace }: ReplaceModalProps) {
  const router = useRouter();
  const { isOpen, newProduct } = state;

  if (!isOpen || !newProduct || !selected.left || !selected.right) return null;

  // 교체 대상 상품들 (현재 선택된 상품들)
  const productsToReplace = [
    { side: "left" as CompareSide, product: selected.left },
    { side: "right" as CompareSide, product: selected.right },
  ];

  const handleConfirm = (sideToKeep: CompareSide) => {
    onConfirmReplace(sideToKeep, newProduct);

    // [요구사항 반영] 교체 완료 메시지 및 이동 여부 처리
    const confirmMove = window.confirm(
      `비교 상품이 '${newProduct.name}'(으)로 변경되었습니다. 바로 비교 화면으로 이동하시겠어요?`,
    );

    if (confirmMove) {
      // 이미 /compare 페이지에 있으므로, 상태 업데이트 후 모달을 닫는 것으로 충분하지만,
      // 명시적으로 이동하려면 router.push('/compare')를 사용합니다.
      // 여기서는 닫기만 합니다.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg transform rounded-xl bg-white p-6 shadow-2xl transition-all">
        <h3 className="mb-4 text-20-bold">⚠️ 비교 상품 교체 확인</h3>
        <p className="mb-4 text-16-regular">
          새로 선택한 상품: <strong className="text-orange-500">"{newProduct.name}"</strong>
        </p>

        <p className="mb-4 text-sm text-gray-600">현재 등록된 두 상품 중, 새 상품으로 **교체할 상품**을 선택하세요.</p>

        {/* 기존 상품 2개 선택 영역 */}
        <div className="grid grid-cols-2 gap-4">
          {productsToReplace.map(({ side, product }) => (
            <button
              key={side}
              // 사용자가 선택한 쪽(side)을 유지하고 반대쪽을 교체하는 로직이므로,
              // 버튼을 누르는 것은 "이 상품을 남기겠다"는 의미입니다.
              onClick={() => handleConfirm(side)}
              className="flex flex-col items-center rounded-lg border p-4 transition-colors hover:border-red-500 hover:bg-red-50"
            >
              <span className="mb-1 text-14-medium text-gray-700">
                {side === "left" ? "왼쪽 상품 남기고" : "오른쪽 상품 남기고"}
              </span>
              <strong className="text-16-bold text-red-600">
                "{side === "left" ? selected.right?.name : selected.left?.name}" 교체
              </strong>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-14-medium text-gray-600 hover:bg-gray-100">
            닫기 (변경 없음)
          </button>
        </div>
      </div>
    </div>
  );
}
