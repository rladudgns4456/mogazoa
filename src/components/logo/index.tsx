import logoFull from "@/assets/logo_full.png";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Image width={160} height={40} src={logoFull} alt="모가조아" />
    </Link>
  );
}
