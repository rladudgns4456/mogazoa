import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useToast } from "@/components/toast";
import Ic_Close from "@/assets/svgr/ic_close.svg";

interface LabelProps {
  label: string;
  error?: boolean;
  errorMessage?: string;
  closedTime?: number;
  styleClass?: string;
  closed?: boolean;
}

const style = {
  default:
    "fixed z-50 transition-all inset-x-1/2 inset-y-2/4 -translate-y-2/4 -translate-x-2/4 min-h-fit min-w-fit whitespace-nowrap rounded-5 bg-primary-200 px-17 py-11 text-16-regular opacity-0 -translate-y-1/4",
  show: "opacity-1 -translate-y-2/4",
  closed: "flex gap-x-8 items-center curser",
  error: "bg-error text-white",
};

// 컨테이너 렌더링
export default function Toast({
  label,
  error = false,
  styleClass,
  closedTime = 2000,
  errorMessage = "다시 시도해 주세요",
  closed = false,
}: LabelProps) {
  const { toastState, closeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsVisible(prev => !prev);
    }, 100);
    let timer = setTimeout(Number);
    if (closed === false) {
      timer = setTimeout(() => {
        setIsVisible(prev => !prev);
      }, closedTime);
    }

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [closedTime]);

  useEffect(() => {
    if (closed === false) {
      const timer = setTimeout(() => {
        closeToast();
      }, closedTime + 1000); // 애니메이션 종료 후 제거

      return () => clearTimeout(timer);
    }
  }, [closedTime]);

  const props = [style.default, closed && style.closed, isVisible && style.show, error && style.error, styleClass];

  return (
    <>
      {toastState.isOpen &&
        (closed ? (
          <button
            className={cn(`duration-${closedTime / 10}`, props)}
            type="button"
            onClick={() => {
              closeToast();
            }}
          >
            {error ? errorMessage : label}
            <Ic_Close width={15} height={15} />
          </button>
        ) : (
          <div className={cn(`duration-${closedTime / 10}`, props)}>{error ? errorMessage : label}</div>
        ))}
    </>
  );
}
