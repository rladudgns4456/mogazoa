import IcMenu from "@/assets/icons/ic_menu.svg";
import IcSearch from "@/assets/icons/ic_search.svg";
import Input from "@/components/input/Input";
import { useAuth } from "@/components/login/AuthContext";
import Logo from "@/components/logo";
import { useResponsive } from "@/hooks/useReponsive";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { Activity, ReactNode, useEffect, useRef, useState } from "react";

const CATEGORIES_LIST = [
  "음악",
  "영화/드라마",
  "강의/책",
  "호텔",
  "가구/인테리어",
  "식당",
  "전자기기",
  "화장품",
  "의류/악세서리",
  "앱",
] as const;

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { isMobile } = useResponsive();
  const router = useRouter();

  const ActiveList = router.query.category;

  const searchRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (isMobile) {
      if (isSearch === true || isMenu === true) {
        setIsSearch(false);
        setIsMenu(false);
      }
    }
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
  }, [isSearch, isMenu, isMobile]);

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
  const activeCategory = `bg-primary-200 text-primary-600 rounded-8`;
  const sideBarBasic = `cursor-pointer px-20 py-13 text-gray-600`;

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
          {!isAuthenticated ? (
            <>
              <Link className="text-14-regular text-gray-700" href={"/login"}>
                로그인
              </Link>
              <Link className="text-14-regular text-gray-700" href={"/signup"}>
                회원가입
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-100 border border-primary-500 px-16 py-12 text-14-bold text-primary-600"
                href={"/compare"}
              >
                비교하기
              </Link>
              <Link className="text-14-bold text-gray-700" href={"/mypage"}>
                내 프로필
              </Link>
              <button onClick={handleLogoutClick} className="text-14-bold text-gray-700">
                로그아웃
              </button>
            </>
          )}
        </div>
      </header>
      <header
        className={`relative z-10 flex h-64 items-center justify-between gap-20 border-b border-gray-200 px-20 py-16 md:hidden ${getMobilePadding()}`}
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
            <div className="fixed h-full w-180 bg-white px-10 py-10" ref={asideRef}>
              <p className="pb-20 pl-20 pt-45 text-14-regular">카테고리</p>
              <ul className="flex flex-col gap-4">
                {CATEGORIES_LIST.map((list, i) => (
                  <li
                    key={i}
                    className={cn(sideBarBasic, Number(ActiveList) === i ? activeCategory : null, hoverCategory)}
                  >
                    {list}
                  </li>
                ))}
              </ul>
              <div>
                {!isAuthenticated ? (
                  <ul className="flex flex-col gap-10">
                    <li>
                      <Link className={sideBarBasic} href={"/login"}>
                        로그인
                      </Link>
                    </li>
                    <li>
                      <Link className={sideBarBasic} href={"/signup"}>
                        회원가입
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <>
                    <button onClick={handleLogoutClick} className={sideBarBasic}>
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </Activity>
      </header>
      {children}
    </>
  );
}
