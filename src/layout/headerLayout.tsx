import IcMenu from "@/assets/icons/ic_menu.svg";
import IcSearch from "@/assets/icons/ic_search.svg";
import Input from "@/components/input/Input";
import Logo from "@/components/logo";
import { useResponsive } from "@/hooks/useReponsive";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { Activity, ReactNode, useEffect, useRef, useState } from "react";

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const { isMobile } = useResponsive();

  const searchRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Search 영역 외부 클릭 시
      if (isSearch && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearch(false);
      }

      // Menu 영역 외부 클릭 시
      if (isMenu && asideRef.current && !asideRef.current.contains(event.target as Node)) {
        setIsMenu(false);
      }
    };

    // 둘 중 하나라도 열려있을 때만 이벤트 리스너 추가
    if (isSearch || isMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearch, isMenu]);

  const handleSearchOpenClick = () => {
    setIsSearch(!isSearch);
  };

  const handleMenuOpenClick = () => {
    setIsMenu(!isMenu);
  };

  const getMobilePadding = () => {
    if (isSearch) return "py-8";
    return "py-16";
  };

  const LogoWidthSize = isMobile ? 160 : 128;
  const LogoHeightSize = isMobile ? 40 : 32;

  const hoverCategory = `hover:bg-primary-200 hover:text-primary-600 rounded-8`;

  return (
    <>
      <header className="hidden items-center justify-between border-b border-gray-200 px-20 py-20 md:flex md:px-30 md:py-15 lg:px-120 lg:py-22">
        <Logo width={LogoWidthSize} height={LogoHeightSize} />
        <div className="flex items-center md:gap-30 lg:gap-60">
          <div className="md:w-300 lg:w-400">
            <Input
              variant="search"
              value={searchValue}
              onChange={setSearchValue}
              leftIcon="search"
              placeholder="상품 이름을 검색해 보세요"
            />
          </div>
          <Link className="text-gray-700" href={"/login"}>
            로그인
          </Link>
          <Link className="text-gray-700" href={"/signup"}>
            회원가입
          </Link>
        </div>
      </header>
      <header
        className={`relative flex h-64 items-center justify-between gap-20 border-b border-gray-200 px-20 py-16 md:hidden ${getMobilePadding()}`}
      >
        <button onClick={handleMenuOpenClick}>
          <IcMenu className="h-24 w-24" />
        </button>
        <Activity mode={isSearch ? "hidden" : "visible"}>
          <Logo width={LogoWidthSize} height={LogoHeightSize} />
          <button onClick={handleSearchOpenClick}>
            <IcSearch className="h-24 w-24 text-gray-500" />
          </button>
        </Activity>
        <Activity mode={!isSearch ? "hidden" : "visible"}>
          <div className="flex-1" ref={searchRef}>
            <Input
              variant="search"
              value={searchValue}
              onChange={setSearchValue}
              placeholder="상품 이름을 검색해 보세요"
              leftIcon="search"
            />
          </div>
        </Activity>
        <Activity mode={isMenu ? "visible" : "hidden"}>
          <aside className="absolute left-0 top-0">
            <div className="fixed h-full w-full bg-black opacity-30"></div>
            <div className="fixed h-full w-180 bg-white py-10" ref={asideRef}>
              <p className="pb-20 pl-20 pt-45 text-14-regular">카테고리</p>
              <ul className="flex flex-col gap-4">
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>음악</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>영화/드라마</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>강의/책</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>호텔</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>가구/인테리어</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>식당</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>전자기기</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>화장품</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>의류/악세서리</li>
                <li className={cn("cursor-pointer px-20 py-13", hoverCategory)}>앱</li>
              </ul>
            </div>
          </aside>
        </Activity>
      </header>
      {children}
    </>
  );
}
