import { ChangeEvent, useState } from "react";
import { cn } from "@/utils/cn";

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  styleClass?: string;
  onBlur?: (e:React.FocusEvent) => void;
}

const MaxLength = 300;

export default function TextArea({ placeholder, onChange, onBlur, value, styleClass }: TextAreaProps) {
  const [focus, setFocus] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const getBorderColor = () => {
    if (focus) return "border-primary-500";
    return "border-gray-300";
  };

  return (
    <div className={`relative h-full w-full rounded-8 border ${getBorderColor()}`}>
      <textarea
        placeholder={placeholder}

        className={cn(
          "h-full w-full resize-none rounded-8 p-20 text-16-regular outline-none placeholder:text-gray-600",
          styleClass,
        )}
        className="h-full w-full resize-none rounded-8 p-20 text-16-regular outline-none placeholder:text-gray-600"
        maxLength={MaxLength}
        onChange={handleChange}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          setFocus(false);
          if (onBlur) {
            onBlur(e); 
          }
        }}
      ></textarea>
      <div className="absolute bottom-20 right-20 text-14-regular text-gray-600">
        {value.length}/{MaxLength}
      </div>
    </div>
  );
}
