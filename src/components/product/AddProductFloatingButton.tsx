// src/components/product/addProductFloatingButton.tsx
"use client";

import FloatingButton from "@/components/floatButton";
import { ModalContainer } from "@/components/modal/modalBase";
import { useModal } from "@/components/modal/modalBase/modalProvider";
import AddProductModal from "@/components/product/AddProductmodal";
import { useAuth } from "@/components/login/AuthContext";

export default function AddProductFloatingButton() {
  const { user } = useAuth();
  const { openModal } = useModal();

  // 로그인 안 했으면 플로팅 버튼 숨김
  if (!user) return null;

  const handleOpen = () => {
    openModal(
      <ModalContainer styleClass="w-[644px] rounded-20">
        <AddProductModal />
      </ModalContainer>,
    );
  };

  return <FloatingButton onOpen={handleOpen} />;
}
