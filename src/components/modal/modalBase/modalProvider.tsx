import { createContext, useState, useContext, ReactNode } from "react";

interface ModalContextType {
  modalState: {
    isOpen: boolean;
    content: React.ReactNode | null;
  };
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    content: React.ReactNode | null;
  }>({
    isOpen: false,
    content: null,
  });

  const openModal = (content: React.ReactNode) => {
    setModalState({ isOpen: true, content });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, content: null });
  };

  return <ModalContext.Provider value={{ modalState, openModal, closeModal }}>{children}</ModalContext.Provider>;
};

// 커스텀 훅
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("모달을 Provider 안에서 사용해 주세요.");
  }
  return context;
};
