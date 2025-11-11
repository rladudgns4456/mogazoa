import logoFull from "@/assets/logo_full.png";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width: number;
  height: number;
}

export default function Logo({ width, height }: LogoProps) {
  return (
    <Link href={"/"}>
      <Image width={width} height={height} src={logoFull} alt="모가조아" />
    </Link>
  );
}
