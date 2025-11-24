import { createPortal } from "react-dom";
import { useToast } from "@/components/toast";

export default function ToastWrap() {
  const { toastState } = useToast();

  return (
    <>
      {toastState.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] min-h-full overflow-y-auto overscroll-none p-17">
            {toastState.content}
          </div>,
          document.body,
        )}
    </>
  );
}
