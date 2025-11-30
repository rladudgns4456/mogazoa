"use client";

import { createPortal } from "react-dom";
import { useModal } from "@/components/modal/modalBase/modalProvider";
import { useRef, useState } from "react";

const ModalWrap = () => {
  const { modalState, closeModal } = useModal();
  const warpRef = useRef(null);

  //드래그 마우스 포인터 위치
  const startCoords = useRef({ x: 0, y: 0 });
  let dragX: number = 0;
  let dragY: number = 0;

  //외부 영역 클릭 닫기 - 드래그 될때 제외
  const [isDrag, setIsDrag] = useState(false);

  const onHandleDown = (e: React.MouseEvent) => {
    startCoords.current = { x: e.clientX, y: e.clientY };
    setIsDrag(false);
  };
  const onHandleMove = (e: React.MouseEvent) => {
    dragX = e.clientX - startCoords.current.x;
    dragY = e.clientY - startCoords.current.y;
    setIsDrag(true);
  };
  const onHandleUp = (e: React.MouseEvent) => {
    //30px 이상 드래그 되면 닫히지 않음
    if ((!isDrag && Math.abs(dragX) < 30) || Math.abs(dragY) < 30) {
      setIsDrag(true);
      closeModal();
    }
  };

  const onHandleClick = () => {
    if (!isDrag) {
      setIsDrag(false);
      closeModal();
    }
  };

  return (
    <>
      {modalState.isOpen &&
        createPortal(
          <div
            ref={warpRef}
            className="black-op30 scrollbar-hide fixed inset-0 z-[100] min-h-full overflow-y-auto overscroll-none p-17"
            onMouseDown={onHandleDown}
            onMouseMove={onHandleMove}
            onMouseUp={onHandleUp}
            onClick={onHandleClick}
          >
            {modalState.content}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ModalWrap;
