import Button from "@/components/Button";
import { ModalContainer } from "../modalBase";
import { useRouter } from "next/router";
import { useModal } from "../modalBase";

interface ModalProps {
  label: string;
  onConfig: (e: string) => void;
}

export default function ConfigModal({ label, onConfig }: ModalProps) {
  const router = useRouter();
  const { closeModal } = useModal();

  return (
    <ModalContainer styleClass="px-40 pt-40 pb-50 w-[80%] max-w-400">
      <p className="py-50 text-center text-18-medium">{label}</p>
      <div className="flex gap-x-10">
        <Button
          variant="primary"
          type="button"
          onClick={e => {
            onConfig("true");
            closeModal();
          }}
        >
          확인
        </Button>
        <Button variant="secondary" type="button" onClick={() => closeModal()}>
          취소
        </Button>
      </div>
    </ModalContainer>
  );
}
