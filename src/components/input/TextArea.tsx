import { ChangeEvent, useState } from "react";

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const MaxLength = 300;

export default function TextArea({ placeholder, onChange, value }: TextAreaProps) {
  const [focus, setFocus] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const getBorderColor = () => {
    if (focus) return "border-primary-500";
    return "border-gray-300";
  };

  return (
    <div className={`relative w-full h-full border rounded-8 ${getBorderColor()}`}>
      <textarea
        placeholder={placeholder}
        className="w-full h-full resize-none p-20 text-16-regular rounded-8 placeholder:text-gray-600 outline-none"
        maxLength={MaxLength}
        onChange={handleChange}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      ></textarea>
      <div className="absolute text-gray-600 text-14-regular bottom-20 right-20">
        {value.length}/{MaxLength}
      </div>
    </div>
  );
}
