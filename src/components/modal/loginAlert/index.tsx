import Button from "@/components/Button";
import { ModalContainer } from "../modalBase";
import { useRouter } from "next/router";
import { useModal } from "../modalBase";

export default function LoginAlert() {
  const router = useRouter();
  const { closeModal } = useModal();

  const onLoginPageMove = () => {
    router.push("/login");
    closeModal();
  };

  return (
    <ModalContainer styleClass="px-40 pt-40 pb-50 w-[80%] max-w-400">
      <p className="py-50 text-center text-18-medium">로그인이 필요합니다.</p>
      <div className="flex gap-x-10">
        <Button variant="primary" type="button" onClick={onLoginPageMove}>
          로그인
        </Button>
        <Button variant="secondary" type="button" onClick={() => closeModal()}>
          닫기
        </Button>
      </div>
    </ModalContainer>
  );
}
