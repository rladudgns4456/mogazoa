import { cn } from "@/utils/cn";
import { profile } from "console";
import Image from "next/image";

const baseImg = {
  product: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Mogazoa/user/1064/1762716894098/bubble_mini.png",
  profile: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Mogazoa/user/1064/1762756460648/person.png",
};
const base = "relative overflow-hidden text-0 leading-0 bg-gray-200";
const imageType = {
  products: "w-165 h-165 md:w-300 md:h-300 border border-gray-300 border round-sm",
  profile: "w-68 h-68 md:w-160 md:h-160 bg-gray-200 rounded-200",
  review: "w-64 h-64 md:w-100 md:h-100 round-sm",
};

const circleSize = {
  sm: "max-w-42 max-h-42",
  md: "w-56 h-56 md:w-84 md:h-84",
  lg: "w-64 h-64 md:w-100 md:h-100",
};

interface ImageProps {
  url: string;
  name: string;
  variant: keyof typeof imageType;
  size?: keyof typeof circleSize;
  styleClass?: string;
}

export default function ImageBox({ url = "", name, variant, size, styleClass }: ImageProps) {
  return (
    <div className={cn(imageType[variant], size && circleSize[size], base, styleClass)}>
      <Image
        width={100}
        height={100}
        layout="response"
        src={url === "" ? (variant === "profile" ? baseImg.profile : baseImg.product) : url}
        alt={name}
        className={"absolute inset-0 h-full w-full"}
      />
    </div>
  );
}
