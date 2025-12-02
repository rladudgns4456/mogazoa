import IcAddImage from "@/assets/ic_add_img.svg";
import IcClose from "@/assets/svgr/ic_close.svg";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface UploadImgProps {
  size?: string;
  onFilesChange?: (files: File[]) => void;
}

export default function UploadImg({ size = "140", onFilesChange }: UploadImgProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleClick = () => {
    fileRef?.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));

    setFiles(prev => {
      const updated = [...prev, ...selectedFiles];
      onFilesChange?.(updated);
      return updated;
    });

    setPreviews(prev => prev.concat(newPreviews));
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange?.(newFiles);
  };

  return (
    <form className="flex items-center gap-20">
      <div
        onClick={handleClick}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-16 rounded-12 border border-gray-300 bg-white`}
      >
        <input onChange={handleChange} ref={fileRef} className="hidden" type="file" multiple />
        <IcAddImage className="h-24 w-24 text-gray-800" />
        <p className="text-gray-800">대표 이미지</p>
      </div>
      {previews.map((url, i) => (
        <div
          key={url}
          style={{ width: `${size}px`, height: `${size}px` }}
          className={`relative rounded-12 border border-gray-300`}
        >
          <div
            className="absolute -right-17 -top-7 z-10 flex h-36 w-36 cursor-pointer items-center justify-center rounded-100 border-2 border-white bg-gray-400"
            onClick={() => handleRemove(i)}
          >
            <IcClose className="h-20 w-20 text-gray-100" />
          </div>
          <Image className="rounded-12" src={url} fill alt={`image${i}`} />
        </div>
      ))}
    </form>
  );
}
