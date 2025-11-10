import IcEmail from "@/assets/ic_email.svg";
import IcPassword from "@/assets/ic_password.svg";
import IcProfile from "@/assets/ic_profile.svg";
import IcSearch from "@/assets/ic_search.svg";
import IcVisibleOff from "@/assets/ic_visible=off.svg";
import IcVisibleOn from "@/assets/ic_visible=on.svg";
import { cn } from "@/utils/cn";
import { Activity, useState } from "react";

const basicInput = `relative flex items-center justify-between border`;

const variantStyles = {
  rounded: cn("rounded-[1000px] h-[52px] py-[16px] px-[20px] md:h-[64px] md:px-[24px] md:py-[20px]", basicInput),
  normal: cn("rounded-8 h-[42px] px-[12px] py-[12px] md:h-[60px] md:px-[20px] md:py-[20px]", basicInput),
  search: cn(
    "border-none rounded-28 px-[15px] py-[12px] h-[48px] lg:h-[56px] md:h-[50px] md:py-[13px] md:px-[20px] bg-gray-100",
    basicInput,
  ),
};

interface InputProps {
  placeholder?: string;
  subText?: string;
  leftIcon?: "email" | "nickname" | "password" | "search";
  type?: "text" | "email" | "password";
  value: string;
  label?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  showPasswordToggle?: boolean;
  error?: boolean;
  errorText?: string;
  variant: keyof typeof variantStyles;
}

export default function Input({
  placeholder,
  value,
  leftIcon,
  variant,
  subText,
  showPasswordToggle,
  type = "text",
  error,
  onChange,
  onBlur,
  errorText,
  label,
}: InputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputType = showPasswordToggle && showPassword ? "text" : type;

  const getBorderColor = () => {
    if (error) return "border-error";
    if (isFocused) return "border-primary-500";
    return "border-gray-400";
  };

  const getFontColor = () => {
    if (error) return "text-error";
    if (isFocused) return "text-primary-500";
    return "text-gray-400";
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const isFloating = isFocused || value.length > 0;

  const leftChangeIcon =
    leftIcon === "email" ? (
      <IcEmail className={`${getFontColor()}`} />
    ) : leftIcon === "nickname" ? (
      <IcProfile className={`${getFontColor()}`} />
    ) : leftIcon === "password" ? (
      <IcPassword className={`${getFontColor()}`} />
    ) : leftIcon === "search" ? (
      <IcSearch className="text-gray-600" />
    ) : null;

  return (
    <div>
      <div className={cn(variantStyles[variant], getBorderColor())}>
        <Activity mode={leftIcon ? "visible" : "hidden"}>
          <span className="h-[24px] w-[24px]">{leftChangeIcon}</span>
        </Activity>
        <label
          className={`pointer-events-none absolute left-50 z-10 bg-white px-2 text-16-medium transition-all duration-200 ${getFontColor()} ${
            isFloating ? "opacity-1 -top-12" : "-top-12 opacity-0"
          }`}
        >
          {label}
        </label>
        <input
          value={value}
          type={inputType}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent px-8 outline-none"
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
        <Activity mode={showPasswordToggle ? "visible" : "hidden"}>
          <button onClick={togglePassword}>
            {showPassword ? <IcVisibleOn className="text-gray-500" /> : <IcVisibleOff className="text-gray-500" />}
          </button>
        </Activity>
      </div>
      <Activity mode={error ? "visible" : "hidden"}>
        <p className="pt-10 text-14-regular text-error">{errorText}</p>
      </Activity>
      <Activity mode={!error ? "visible" : "hidden"}>
        <p className="pt-10 text-14-regular text-gray-500">{subText}</p>
      </Activity>
    </div>
  );
}
