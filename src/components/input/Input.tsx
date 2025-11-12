import IcEmail from "@/assets/icons/ic_email.svg";
import IcPassword from "@/assets/icons/ic_password.svg";
import IcProfile from "@/assets/icons/ic_profile.svg";
import IcSearch from "@/assets/icons/ic_search.svg";
import IcVisibleOff from "@/assets/icons/ic_visible=off.svg";
import IcVisibleOn from "@/assets/icons/ic_visible=on.svg";
import { cn } from "@/utils/cn";
import { Activity, useState } from "react";

const basicInput = `relative flex items-center justify-between border`;

const variantStyles = {
  rounded: cn("rounded-100 h-52 py-16 px-20 md:h-64 md:px-24 md:py-20", basicInput),
  normal: cn("rounded-8 h-42 px-12 py-12 md:h-60 md:px-20 md:py-20", basicInput),
  search: cn("border-none rounded-28 px-15 py-12 h-48 lg:h-56 md:h-50 md:py-13 md:px-20 bg-gray-200", basicInput),
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
          <span className="h-24 w-24">{leftChangeIcon}</span>
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
      <Activity mode={subText ? "visible" : "hidden"}>
        <Activity mode={!error ? "visible" : "hidden"}>
          <p className="pt-10 text-14-regular text-gray-500">{subText}</p>
        </Activity>
      </Activity>
    </div>
  );
}
