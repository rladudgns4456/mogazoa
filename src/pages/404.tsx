import ErrorImage from "@/assets/images/error_page.png";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>404</title>
        <meta property="og:title" content="404페이지" key="title" />
      </Head>
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
        <div className="h-200 w-200 md:h-280 md:w-280">
          <Image src={ErrorImage} alt="에러" />
        </div>
        <h2 className="header3-bold md:header1-bold pb-40 pt-20">비정상적인 접근입니다</h2>
        <Link
          className="flex h-50 w-200 items-center justify-center rounded-100 border border-gray-700 text-gray-700 md:h-65 md:w-280"
          href={"/"}
        >
          홈으로 가기
        </Link>
      </div>
    </>
  );
}
