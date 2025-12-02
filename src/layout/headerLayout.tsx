import IcMenu from "@/assets/icons/ic_menu.svg";
import IcSearch from "@/assets/icons/ic_search.svg";
import Input from "@/components/input/Input";
import { useAuth } from "@/components/login/AuthContext";
import Logo from "@/components/logo";
import { useResponsive } from "@/hooks/useReponsive";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { Activity, ReactNode, useEffect, useRef, useState } from "react";

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { combinedCategory } = useCategories();

  const ActiveList = router.query.category;

  const searchRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => {
    logout();
    router.push("/");
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: number) => {
    const query = { ...router.query };

    // 같은 카테고리 클릭 시 토글
    if (Number(query.category) === categoryId) {
      delete query.category;
    } else {
      query.category = String(categoryId);
    }

    router.push(
      {
        pathname: "/",
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  // ✅ URL 쿼리 keyword와 검색 input 값 동기화
  useEffect(() => {
    const keyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
    setSearchValue(keyword);
  }, [router.query.keyword]);

  // 라우트 변경 시 사이드 탭 자동 닫기
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenu(false);
      setIsSearch(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearch && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearch(false);
      }
      if (isMenu && asideRef.current && !asideRef.current.contains(event.target as Node)) {
        setIsMenu(false);
      }
    };

    if (isSearch || isMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearch, isMenu]);

  const handleSearchOpenClick = () => {
    setIsSearch(prev => !prev);
  };

  const handleMenuOpenClick = () => {
    setIsMenu(prev => !prev);
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

  // ✅ 실제 검색 수행 (PC + 모바일 공통)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchValue.trim();

    const query = { ...router.query };
    if (keyword) {
      query.keyword = keyword;
    } else {
      delete query.keyword;
    }

    router.push(
      {
        pathname: "/",
        query,
      },
      undefined,
      { shallow: false },
    );

    // 모바일에서는 검색 후 검색창 닫기
    if (isMobile) {
      setIsSearch(false);
    }
  };

  return (
    <>
      <header className="hidden items-center border-b border-gray-200 px-20 py-20 lg:flex lg:px-120 lg:py-22">
        <Logo width={LogoWidthSize} height={LogoHeightSize} />

        <div className="ml-24 flex flex-1 items-center justify-end gap-24">
          {/* 검색 폼 (Enter로 검색) */}
          <form onSubmit={handleSearchSubmit} className="w-300 lg:w-400">
            <Input
              variant="search"
              value={searchValue}
              onChange={setSearchValue}
              leftIcon="search"
              placeholder="상품 이름을 검색해 보세요"
            />
          </form>

          {/* 우측 버튼 그룹 */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-20">
              <Link className="text-14-regular text-gray-700" href={"/login"}>
                로그인
              </Link>
              <Link className="text-14-regular text-gray-700" href={"/signup"}>
                회원가입
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-24 whitespace-nowrap">
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
            </div>
          )}
        </div>
      </header>

      {/* ✅ 모바일/태블릿 헤더: lg 미만에서 사용 */}
      <header
        className={cn(
          "relative z-40 flex h-64 items-center justify-between gap-20 border-b border-gray-200 px-20 py-16 lg:hidden",
          getMobilePadding(),
        )}
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
            {/* 📱 모바일 검색 폼 */}
            <form onSubmit={handleSearchSubmit}>
              <Input
                variant="search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="상품 이름을 검색해 보세요"
                leftIcon="search"
              />
            </form>
          </div>
        </Activity>

        {/* 사이드 메뉴 (모바일) */}
        <Activity mode={isMenu ? "visible" : "hidden"}>
          <aside className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-30" />
            <div className="absolute left-0 top-0 h-full w-180 bg-white px-10 py-10" ref={asideRef}>
              <p className="pb-20 pl-20 pt-45 text-14-regular">카테고리</p>
              <ul className="flex flex-col gap-4">
                {combinedCategory.map(category => (
                  <li
                    key={category.id}
                    className={cn(
                      sideBarBasic,
                      Number(ActiveList) === category.id ? activeCategory : null,
                      hoverCategory,
                    )}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.label}
                  </li>
                ))}
              </ul>
              <div className="mt-24">
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
                  <ul className="flex flex-col gap-10">
                    <li>
                      <Link className={sideBarBasic} href={"/mypage"}>
                        내 프로필
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogoutClick} className={sideBarBasic}>
                        로그아웃
                      </button>
                    </li>
                  </ul>
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
