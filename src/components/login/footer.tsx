import LogoTitle from "@/assets/logo_name.png";
import Image from "next/image";

export default function LoginFooter() {
  return (
    <div className="hidden flex-col items-center justify-center gap-8 pb-50 pt-108 md:flex lg:hidden">
      <Image width={140} height={35} src={LogoTitle} alt="로고 이름" />
      <p className="ff-cafe text-14-bold">
        <span className="text-primary-500">쉽게</span> 비교하고 <span className="text-primary-500">똑똑하게</span>{" "}
        쇼핑하자
      </p>
    </div>
  );
}
