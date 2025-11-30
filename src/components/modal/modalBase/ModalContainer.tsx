// 닫기 버튼은 내부 div 요소의 absolute right-0 top-0 고정입니다.
// relative 요소에 padding을 사용해 주세요.

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useModal } from "@/components/modal/modalBase/modalProvider";
import { useHeight } from "@/hooks/useHeight";
import Button from "../../Button";
import Ic_close from "@/assets/svgr/ic_close.svg";

interface ModalProps {
  children: React.ReactNode;
  styleClass: string;
}

const MODAL_POSITION = {
  up: "top-1/2 -translate-y-1/2",
  down: "top-80 -translate-y-40",
};

export default function ModalContainer({ children, styleClass }: ModalProps) {
  const { modalState, closeModal } = useModal();
  const { height } = useHeight();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [isModalHeight, setIsModalHeight] = useState({ height: 0 });
  const [isTopPosition, setTopPosition] = useState(MODAL_POSITION.up);

  useEffect(() => {
    if (modalRef.current) {
      const { clientHeight } = modalRef?.current;
      setIsModalHeight({ height: clientHeight });
    }
    setIsVisible(modalState.isOpen);
  }, [height]);

  // resize 이벤트 등록 및 해제
  useEffect(() => {
    const handleResize = () => {
      if (Number(height) < Number(isModalHeight.height)) {
        setTopPosition(MODAL_POSITION.down);
      } else {
        setTopPosition(MODAL_POSITION.up);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height, isModalHeight]);

  return (
    <div
      className={cn("absolute -top-1000 left-1/2 z-10 flex -translate-x-1/2 justify-center", isTopPosition)}
      onClick={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
      ref={modalRef}
    >
      <div
        className={cn(
          "round-lg mb-40 overflow-hidden border border-gray-200 bg-white transition-all duration-300 ease-in-out",
          styleClass,
          isVisible ? "mt-0 opacity-100" : "mt-100 opacity-0",
        )}
      >
        <div className="relative">
          {children}
          <Button
            variant="onlyIcon"
            iconType="close"
            type="button"
            aria-label="닫기"
            onClick={() => {
              if (modalState.isOpen) closeModal();
            }}
            styleClass="absolute right-0 top-0 z-10"
          >
            <Ic_close />
          </Button>
        </div>
      </div>
    </div>
  );
}
