import PopPage from "@/assets/icons/ic_pop.svg";
import Logo from "@/assets/logo/logo.png";
import LogoTitle from "@/assets/logo/logo_name.png";
import Button from "@/components/Button";
import Input from "@/components/input/Input";
import LoginFooter from "@/components/login/footer";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useEffect, useState } from "react";

export default function SnsSignupPage() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);

  useEffect(() => {
    setDisabled(!validated);
  }, [validated]);

  // 닉네임 유효성 검사 (값을 직접 받는 버전)
  const validateNicknameValue = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("닉네임을 입력해 주세요");
      setValidated(false);
      return false;
    }

    if (trimmedValue.length > 10) {
      setError("최대 10자 입력이 가능해요.");
      setValidated(false);
      return false;
    }

    setError("");
    setValidated(true);
    return true;
  };

  // 기존 함수는 onBlur와 handleSubmit에서 사용
  const validateNickname = () => validateNicknameValue(nickname);

  const handleChange = (value: string) => {
    setNickname(value);
    // 실시간 유효성 검사
    validateNicknameValue(value);
  };

  const handleSubmit = async () => {
    const isValid = validateNickname();
    if (!isValid) return;

    localStorage.setItem("sns_nickname", nickname);

    const redirectUri = `${window.location.origin}/auth/kakaoSignup`;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    setError("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <Head>
        <title>SNS 회원가입-모가조아</title>
        <meta property="og:title" content="SNS 회원가입-모가조아" key="title" />
      </Head>
      <div className="flex max-w-1325 items-center justify-center pb-45 pt-113 md:pt-104 lg:m-auto lg:justify-between lg:pb-160 lg:pt-94">
        <div className="hidden flex-col justify-center gap-8 lg:flex">
          <div className="flex flex-col items-center justify-center gap-16">
            <Image quality={100} src={Logo} width={100} height={100} alt="로고" />
            <Image quality={100} src={LogoTitle} width={240} height={60} alt="모가조아" />
          </div>
        </div>
        <div onKeyDown={onKeyDown} className="max-w-335 md:max-w-600 lg:max-w-640">
          <div className="flex w-full items-center pb-40 md:pb-80">
            <Link className="h-32 w-32 md:h-40 md:w-40" href={"/login"}>
              <PopPage width={32} height={32} />
            </Link>
            <h1 className="header2-bold md:big-title flex-1 text-center">간편 회원가입</h1>
            <div className="h-32 w-32 md:h-40 md:w-40"></div>
          </div>
          <article className="flex flex-col gap-32 md:gap-48">
            <Input
              variant="rounded"
              value={nickname}
              onChange={handleChange}
              onBlur={validateNickname}
              leftIcon="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요"
              label="닉네임"
              error={!!error}
              errorText={error}
              subText="최대 10자 입력이 가능해요"
            />
          </article>
          <div className="pt-80">
            <Button type="button" variant="primary" disabled={disabled} onClick={handleSubmit}>
              가입하기
            </Button>
          </div>
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
