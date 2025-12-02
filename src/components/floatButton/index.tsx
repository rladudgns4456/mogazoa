import Button from "../Button";
import Ic_Plus from "@/assets/svgr/ic_Plus.svg";

interface OpenProps {
  onOpen: () => void;
}

export default function FloatingButton({ onOpen }: OpenProps) {
  return (
    <>
      <Button
        variant="onlyIcon"
        iconType="more"
        type="button"
        styleClass="fixed z-20 bottom-33right-30 md:bottom-102 lg:right-[calc(50%-940px+390px)] lg:bottom-98"
        onClick={onOpen}
      >
        <Ic_Plus />
      </Button>
    </>
  );
}
