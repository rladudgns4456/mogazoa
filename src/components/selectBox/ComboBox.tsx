import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { CategoryType } from "@/hooks/useCategories";
import { Sorting, StyleProps } from "./type";
import Button from "../Button";
import Arrow from "@/assets/svgr/ic_chevron_down.svg?react";

interface BoxProps {
  placeHolder: string;
  items: Sorting[] | CategoryType[];
  styleClass: StyleProps;
  width?: string;
  initialValue?: number;
  onReadId: (id: number) => void;
}

export default function ComboBox({ placeHolder = "선택", items, styleClass, initialValue, onReadId }: BoxProps) {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOptionValue, setIsOptionValue] = useState<string>(placeHolder); //선택 옵션 텍스트
  const [isOptionId, setIsOptionId] = useState<number | undefined>(initialValue); //선택 옵션 스타일 상태

  const onHandleOutSideClick = (e: MouseEvent) => {
    if (isOpen && !selectRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onHandleOutSideClick);
    return () => {
      document.removeEventListener("mousedown", onHandleOutSideClick);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative z-10", styleClass.size)} ref={selectRef}>
      <Button
        variant={"tertiary"}
        onClick={() => setIsOpen(!isOpen)}
        type={"button"}
        styleClass={cn(
          "justify-between !round-sm border-gray-400 text-14-medium px-24 !w-full",
          " md:text-16-medium",
          styleClass.selectBox,
        )}
      >
        <span>{isOptionValue}</span>
        <Arrow className={cn(isOpen ? "rotate-180" : "rotate-0", styleClass.button)} />
      </Button>
      {isOpen && (
        <ul
          className={cn(
            "round-md scrollbar-custom absolute mt-8 flex max-h-228 w-full flex-col gap-y-5 border border-gray-400 p-10 md:max-h-258",
            "md:mt-12",
          )}
        >
          <>
            {items?.map((item, id: number) => {
              return (
                <li
                  key={item.id}
                  id={String(item.id)}
                  value={id}
                  className={cn(
                    "round-ss px-20 py-8 text-14-medium text-gray-600 transition duration-300 hover:bg-gray-100 md:py-10",
                    "md:text-16-medium",
                    styleClass.optionItem,
                    isOptionId === item.id ? styleClass.selected : "", //선택 옵션 스타일
                  )}
                  onClick={() => {
                    setIsOpen(prev => !prev);
                    setIsOptionValue(item.label);
                    setIsOptionId(item.id);
                    onReadId(item.id);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      setIsOpen(prev => !prev);
                      setIsOptionValue(item.label);
                      setIsOptionId(item.id);
                      onReadId(item.id);
                    }
                  }}
                  tabIndex={0}
                >
                  {item.label}
                </li>
              );
            })}
          </>
        </ul>
      )}
    </div>
  );
}
