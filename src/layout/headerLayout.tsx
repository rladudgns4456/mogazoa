import Input from "@/components/input/Input";
import Logo from "@/components/logo";
import Link from "next/link";
import { ReactNode, useState } from "react";

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 px-20 py-20 md:px-30 md:py-15 lg:px-120 lg:py-22">
        <Logo />
        <div className="flex items-center gap-60">
          <div className="w-400">
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
      {children}
    </>
  );
}
