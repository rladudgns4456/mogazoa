import { createPortal } from "react-dom";
import { useModal } from "@/components/modal/modalBase/modalProvider";

const ModalWrap = () => {
  const { modalState, closeModal } = useModal();

  return (
    <>
      {modalState.isOpen &&
        createPortal(
          <div
            className="black-op30 fixed inset-0 z-[100] min-h-full p-17"
            onClick={() => {
              closeModal();
            }}
          >
            {modalState.content}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ModalWrap;
