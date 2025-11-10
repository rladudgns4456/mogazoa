import { MouseEventHandler, ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "@/utils/cn";

type htmlProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const disabledStyle =
  "disabled:bg-gray-200 disabled:text-gray-500 disabled:border-color-200 disabled:pointer-events-none";
const basic = `flex items-center justify-center gap-x-5 w-full h-50 md:h-55 xl:h-60 max-w-355 md:max-w-460 lg:max-w-640 rounded-60 text-16-medium md:text-18-medium ${disabledStyle}`;

const variantStyles = {
  primary: cn(
    "bg-primary-600 hover:bg-white text-white hover:text-primary-600 hover:border hover:border-primary-600",
    basic,
  ),
  secondary: cn("bg-white text-primary-500 border border-primary-500 hover:border-gray-300 hover:text-gray-500", basic),
  tertiary: cn("bg-white text-gray-700 border border-gray-700 hover:text-gray-500 hover:border-gray-400", basic),
  onlyIcon: cn(`flex items-center justify-center ${disabledStyle}`),
};

const iconStyles = {
  line: cn("bg-white border border-gray-400 text-gray-900 rounded-60 w-60 h-60 p-6"),
  more: cn("bg-primary-500 text-white rounded-100 w-60 h-60 p-6"),
  delete: cn("bg-gray-400 text-white rounded-50 w-36 h-36 p-6 md:w-32 md:h-32"),
  close: cn("bg-white w-24 h-24 md:w-32 md:h-32 text-gray-400"),
  sns: cn("bg-white border border-gray-300 rounded-60 md:w-56 md:h-56 p-6"),
  etc: cn("w-24 h-24 p-2"),
};

interface ButtonProps extends htmlProps {
  variant: keyof typeof variantStyles;
  children?: React.ReactNode;
  iconType?: keyof typeof iconStyles;
  styleClass?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  variant,
  iconType,
  styleClass,
  disabled = false,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(variantStyles[variant], iconType && iconStyles[iconType], styleClass)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
