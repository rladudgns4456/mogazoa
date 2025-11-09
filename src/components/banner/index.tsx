import Link from "next/link";

type BannerProps = {
  message?: string;
  href?: string;
};

export default function Banner({
  message = "모가조아에서 지금 핫한 상품을 비교해보세요! 🚀",
  href = "/",
}: BannerProps) {
  return (
    <Link
      href={href}
      aria-label="상품 비교 페이지로 이동 배너"
      className="block w-full bg-primary-600 bg-[url('/assets/bg_Banner.png')] bg-cover bg-center text-white transition-opacity hover:opacity-90"
    >
      <div className="flex h-[63px] items-center justify-center px-4">
        <p className="ff-cafe md:header3-bold header4-bold text-center">{message}</p>
      </div>
    </Link>
  );
}
