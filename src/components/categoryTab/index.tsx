import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { useCategories } from "../../hooks/useCategories";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";
import Ic_Next from "@/assets/svgr/ic_chevron_right.svg?react";

interface TabPops {
  isHome?: boolean;
  url: string;
  onHandleLoad: (id: number) => void;
}

interface NavButtonProps {
  swiperRef: React.RefObject<SwiperClass | null>;
  direction: "prev" | "next";
  styleClass: string;
  disabled: boolean;
}

// 카테고리 네비게이션
export default function CategoryTab({ isHome, url, onHandleLoad }: TabPops) {
  const swiperRef = useRef<SwiperClass>(null);
  const [isEnd, setIsEnd] = useState(true);
  const [isSwiperMounted, setIsSwiperMounted] = useState(false);
  const router = useRouter();
  const currentPath = router.query;
  const { combinedCategory, isLoading, isError } = useCategories();

  const onSwiper = (swiper: SwiperClass) => {
    swiperRef.current = swiper;
    setIsEnd(swiper.isEnd);
  };

  const onSlideChange = (swiper: SwiperClass) => {
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    if (combinedCategory.length > 0) {
      setIsSwiperMounted(true);
    }
  }, []);

  const ani = "transition duration-200";

  let gap = 0;
  if (isHome) {
    gap = 8;
  }

  return (
    <div
      className={cn(
        "-tracking-0.4 relative w-full max-w-972 text-nowrap pr-28 md:pr-67 xl:pr-0",
        isHome && "hidden md:block",
      )}
    >
      <Swiper
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        spaceBetween={gap}
        slidesPerView={"auto"}
        modules={[Navigation]}
        navigation={true}
      >
        {combinedCategory?.map((item, index) => (
          <SwiperSlide
            key={index}
            className={cn(
              isHome
                ? "round-md h-90 min-h-90 w-90 min-w-90 max-w-90 overflow-hidden border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "text-gary-500 h-66 w-80 min-w-80 max-w-80 border-b border-gray-300 text-gray-500 hover:text-black md:h-90 md:w-97 md:max-w-97",
            )}
          >
            <Link
              href={`/${url}/${item.id}`}
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-y-8 font-normal hover:font-bold",
                ani,
                isHome ? "h-90 w-90" : "h-66 w-78 md:h-90 md:w-97",
                currentPath.id === String(item.id) &&
                  (isHome ? "bg-gray-800 text-white" : "border-b-2 border-black font-bold text-black"),
              )}
              onClick={e => {
                onHandleLoad(item.id); //부모에 id 전달
              }}
            >
              <div
                className={cn(
                  "h-24 w-24 font-normal hover:font-bold md:h-28 md:w-28",
                  ani,
                  isHome ? "text-gray-900" : "text-gary-500",
                  currentPath.id === String(item.id) && isHome && "bg-gray-800 text-white",
                )}
              >
                {item.icon}
              </div>
              <span className={cn(isHome ? "text-12" : "text-11 md:text-12")}>{item.label}</span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <NavigationButton direction="next" swiperRef={swiperRef} styleClass={""} disabled={isEnd} />
    </div>
  );
}

//슬라이드 버튼
export const NavigationButton = ({ swiperRef, direction, styleClass, disabled }: NavButtonProps) => {
  const isPrev = direction === "prev";

  const onClick = () => {
    if (isPrev) {
      swiperRef.current?.slidePrev();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <button
      className={cn(
        "absolute -right-7 top-13 flex h-32 w-32 items-center justify-center rounded-40 border border-gray-300 pl-4",
        "md:right-0 md:top-30 md:h-40 md:w-40 xl:hidden",
        styleClass,
      )}
      onClick={onClick}
    >
      <Ic_Next className={cn("h-20 w-20", "md:h-24 md:w-24", disabled ? "text-gray-300" : "text-gray-700")} />
    </button>
  );
};
