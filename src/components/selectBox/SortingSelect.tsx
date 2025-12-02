import ComboBox from "./ComboBox";
import { SelectProps } from "./type";

const SORTING = [
  { id: 1, label: "최신순", value: "createdAt" },
  { id: 2, label: "별점높은순", value: "ranking" },
  { id: 3, label: "별점낮은순", value: "rankingDown" },
  { id: 4, label: "좋아요순", value: "favoriteCount" },
];

interface BoxProps extends SelectProps {
  onClick: (e: string) => void;
}

const style = {
  size: "w-140",
  selectBox: "h-42 px-16 md:h-52 px-16 border-gray-200",
  optionBox: "border-gray-300 px-6 py-8 md:p-8",
  optionItem: "hover:bg-gray-200 px-12",
  button: "text-gray-500",
  selected: "bg-gray-900 text-white hover:text-gray-600",
};

export default function SortingSelect({ placeHolder, onClick }: BoxProps) {
  const onHandleSorting = (itemId: number) => {
    const index = SORTING.findIndex(item => item.id === itemId);
    const sorting = SORTING[index].value;
    onClick(sorting); // 정렬 기준을 부모로 전달
  };
  return (
    <ComboBox
      placeHolder={placeHolder}
      items={SORTING}
      styleClass={style}
      onReadId={e => onHandleSorting(e)}
      initialValue={1}
    />
  );
}
