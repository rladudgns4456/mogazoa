"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatNumber } from "@/utils/formatNumber";
import { isValidImageUrl } from "@/utils/validateImageUrl";
import cn from "clsx";
import Badge from "./Badge";
import DefaultProductImage from "@/assets/images/not_card.svg";

interface ItemCardProps {
  product: Product;
  rank?: number;
  showRank?: boolean;
}

/**
 * 상품 카드 컴포넌트
 * - 상품 이미지, 이름, 평균 별점, 리뷰 개수, 찜 개수를 표시
 * - rank prop이 있으면 좌측 상단에 순위 뱃지 표시
 * - 클릭하면 상품 상세 페이지로 이동
 */

export default function ItemCard({ product, rank, showRank = false }: ItemCardProps) {
  const { id, name, image, rating, reviewCount, favoriteCount } = product;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/product/${id}`} className={cn("block overflow-hidden")}>
      {/* 이미지 영역 */}
      <div className={cn("relative aspect-square w-full overflow-hidden rounded-8")}>
        {/* 스켈레톤 로딩 UI */}
        {isLoading && (
          <div className={cn("absolute inset-0 overflow-hidden rounded-8 bg-gray-300")}>
            <div
              className={cn(
                "via-white/20 absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent",
              )}
            />
          </div>
        )}

        {isValidImageUrl(image) ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="100vw"
            className={cn(
              "rounded-8 object-cover transition-transform duration-300",
              isLoading && "opacity-0",
              "hover:scale-105",
            )}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center bg-gray-100")}>
            <DefaultProductImage className={cn("h-full w-full opacity-60")} />
          </div>
        )}
      </div>

      {/* 순위 뱃지 */}
      {showRank && rank && (
        <div className={cn("absolute left-8 top-8", "md:left-12 md:top-12")}>
          <Badge rank={rank} />
        </div>
      )}

      {/* 상품 정보 영역 */}
      <div className={cn("pt-20", "md:px-8")}>
        <h3 className={cn("mb-8 truncate text-14-medium text-gray-900", "md:mb-12 md:text-18-medium")}>{name}</h3>

        <div className={cn("flex items-center justify-between text-12-regular text-gray-700", "md:text-16-regular")}>
          {/* 리뷰 정보 */}
          <div className={cn("flex items-center gap-12")}>
            <span className={cn("flex items-center gap-4")}>리뷰 {formatNumber(reviewCount)}</span>
            <span className={cn("flex items-center gap-4")}>찜 {formatNumber(favoriteCount)}</span>
          </div>

          {/* 별점 */}
          <div className={cn("flex items-center gap-4")}>
            <span className={cn("text-yellow-400")}>★</span>
            <span className={cn("text-gray-700")}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
