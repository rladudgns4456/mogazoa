// pages/index.tsx
import React from "react";
import Head from "next/head";
import MainPage from "@/components/mainpage";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>모가조아 | 상품 비교 & 핫한 리뷰 확인</title>
        <meta name="description" content="모가조아에서 지금 핫한 상품을 비교하고 리뷰를 확인해보세요!" />

        <meta property="og:title" content="모가조아 | 상품 비교 서비스" />
        <meta property="og:description" content="지금 핫한 상품을 카테고리별로 비교하고 리뷰까지 확인할 수 있어요!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mogazoa.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <MainPage />
    </>
  );
}
