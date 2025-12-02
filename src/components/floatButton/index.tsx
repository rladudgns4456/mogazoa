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
        styleClass="fixed z-20 left-auto right-17 bottom-33 sm:right-30 sm:bottom-98 lg:left-[87.5%] lg:bottom-[9.44%] lg:right-auto"
        onClick={onOpen}
      >
        <Ic_Plus />
      </Button>
    </>
  );
}
