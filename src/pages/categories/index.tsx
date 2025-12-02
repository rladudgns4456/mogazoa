import { useRef, useState } from "react";
import FloatingButton from "@/components/floatButton";
import ModalContainer from "@/components/modal/modalBase/ModalContainer";
import { CategorySelect } from "@/components/selectBox";
import { useModal } from "@/components/modal/modalBase/modalProvider";
import DetailCard from "@/components/detailCard";
import { useQuery } from "@tanstack/react-query";
import { getProductItem } from "@/api/productsApi";
import { useRouter } from "next/router";

export default function Home() {
  const { openModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [isChildren, setIsChildren] = useState<React.ReactNode>(null);

  const onHandleOutSideClick = (e: React.MouseEvent) => {
    if (isModalOpen && !wrapRef.current?.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const onHandleSelectOpen = () => {
    setIsSelectOpen(prev => !prev);
  };

  const router = useRouter();
  const productId = 1871;

  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["products", productId], queryFn: () => getProductItem(Number(productId)) });
  const items = productData;
  const onHandleModalOpen = () => {
    openModal(
      <ModalContainer styleClass="p-40 max-w-500 overflow-hidden">
        <DetailCard
          image={items?.image}
          name={items?.name}
          category={items?.category}
          description={items?.description}
        />
      </ModalContainer>,
    );
  };
  return (
    <div>
      <FloatingButton onOpen={onHandleModalOpen} />
    </div>
  );
}
