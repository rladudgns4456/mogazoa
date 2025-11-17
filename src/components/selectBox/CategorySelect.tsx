import ComboBox from "./ComboBox";
import { useCategories } from "@/hooks/useCategories";
import { SelectProps } from "./type";

interface BoxProps extends SelectProps {
  onClick: (id: number) => void;
}

export default function CategorySelect({ placeHolder, onClick }: BoxProps) {
  const { combinedCategory } = useCategories(); //카테고리 목록을 불러옴
  const onGetId = (id: number) => {
    onClick(id); //선택된 id를 부모로 전달
  };

  const style = {
    size: "",
    selectBox: "",
    optionBox: "",
    optionItem: "",
    button: "text-gray-900",
    selected: "text-primary-600 text-primary-600 bg-primary-200",
  };

  return <ComboBox placeHolder={placeHolder} items={combinedCategory} styleClass={style} onReadId={onGetId} />;
}
