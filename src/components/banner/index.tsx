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
    <section
      role="region"
      aria-label="배너"
      className="w-full bg-primary-600 bg-[url('/assets/bg_Banner.png')] bg-cover bg-center text-white"
    >
      <Link href={href} aria-label="상품 비교 페이지로 이동" className="block w-full">
        <div className="flex h-[63px] items-center justify-center">
          <p className="ff-cafe md:header3-bold header4-bold text-center">{message}</p>
        </div>
      </Link>
    </section>
  );
}
