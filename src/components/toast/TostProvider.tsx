import { createContext, useState, useContext, ReactNode } from "react";

interface ToastContextType {
  toastState: {
    isOpen: boolean;
    content: React.ReactNode | null;
  };
  openToast: (content: React.ReactNode) => void;
  closeToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastState, setToastState] = useState<{
    isOpen: boolean;
    content: React.ReactNode | null;
  }>({
    isOpen: false,
    content: null,
  });

  const openToast = (content: React.ReactNode) => {
    setToastState({ isOpen: true, content });
  };

  const closeToast = () => {
    setToastState({ isOpen: false, content: null });
  };

  return <ToastContext.Provider value={{ toastState, openToast, closeToast }}>{children}</ToastContext.Provider>;
};

// 커스텀 훅
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("Toast를 Provider 안에서 사용해 주세요.");
  }
  return context;
};
