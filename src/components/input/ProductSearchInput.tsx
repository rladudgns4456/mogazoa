import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import IconClose from "./IconClose";

interface ProductSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (selected: string) => void;
  productList: string[];
}

export default function ProductSearchInput({
  placeholder,
  value,
  onChange,
  onSelect,
  productList,
}: ProductSearchInputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const basic = `flex h-56 items-center justify-between rounded-100 border-2 px-20 py-18`;

  const getBorderStyle = () => {
    if (isSelected) return "border-solid border-gray-900 bg-gray-900";
    if (!isFocused) return "border-dashed border-primary-600";
    return "border-solid border-primary-600";
  };

  const getTextColor = () => {
    if (isSelected) return "text-white placeholder:text-gray-400";
    return "text-gray-900 placeholder:text-gray-600";
  };

  const filteredList = productList.filter(item => item.toLowerCase().includes((value || "").toLowerCase()));

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setIsSelected(false);
    setShowList(newValue.length > 0);
  };

  const handleItemClick = (item: string) => {
    onChange?.(item);
    onSelect?.(item);
    setIsSelected(true);
    setShowList(false);
    setIsFocused(false);
  };

  const handleResetClick = () => {
    onChange?.("");
    setIsSelected(false);
    setShowList(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowList(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className={cn(getBorderStyle(), basic)}>
        <input
          type="text"
          placeholder={placeholder}
          onFocus={handleFocus}
          className={cn(
            "flex-1 border-none bg-transparent text-16-bold outline-none placeholder:text-16-medium",
            getTextColor(),
          )}
          onChange={handleInputChange}
          value={value}
        />
        {isSelected && (
          <button onClick={handleResetClick} type="button">
            <IconClose />
          </button>
        )}
      </div>

      {showList && filteredList.length > 0 && (
        <ul className="absolute z-10 mt-8 w-full rounded-12 border border-gray-400 bg-white px-10 py-10 shadow-lg">
          {filteredList.map((item, i) => (
            <li
              className="cursor-pointer rounded-8 px-20 py-10 text-16-medium text-gray-600 hover:bg-gray-100"
              key={i}
              onMouseDown={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
